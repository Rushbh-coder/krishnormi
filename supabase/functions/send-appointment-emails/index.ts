// @ts-nocheck
import { LOGO_ICON_BASE64, LOGO_WORDMARK_BASE64 } from "./logos.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PHONE_REGEX = /^[6-9]\d{9}$/;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>\"']/g, (character) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return map[character] ?? character;
  });
}

function formatDate(value: string) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Base64 keeps every line short and ASCII-only, so long HTML lines and
// characters like "•" or "✓" survive SMTP without being mangled.
function encodeMimeBody(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/.{76}/g, "$&\r\n");
}

async function readSmtpResponse(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      return buffer;
    }

    buffer += decoder.decode(value, { stream: true });

    if (buffer.includes("\n")) {
      return buffer;
    }
  }
}

async function writeSmtpCommand(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  command: string,
) {
  await writer.write(new TextEncoder().encode(command));
}

async function sendEmailViaGmailSmtp({
  to,
  subject,
  html,
  text,
  inlineImages = [],
}: {
  to: string[];
  subject: string;
  html: string;
  text: string;
  inlineImages?: { cid: string; filename: string; base64: string }[];
}) {
  const SMTP_HOST = Deno.env.get("SMTP_HOST")?.trim() || "smtp.gmail.com";
  const SMTP_PORT = Number(Deno.env.get("SMTP_PORT") || "465");
  const SMTP_USER = Deno.env.get("SMTP_USER")?.trim() || "";
  const SMTP_PASS = Deno.env.get("SMTP_PASS")?.trim() || "";
  const SMTP_FROM = Deno.env.get("SMTP_FROM")?.trim() || SMTP_USER;

  if (!SMTP_USER || !SMTP_PASS) {
    return {
      ok: false,
      status: 500,
      data: {
        error: "SMTP_USER and SMTP_PASS are not configured.",
      },
    };
  }

  const conn = await Deno.connectTls({
    hostname: SMTP_HOST,
    port: SMTP_PORT,
  });

  const reader = conn.readable.getReader();
  const writer = conn.writable.getWriter();

  try {
    let response = await readSmtpResponse(reader);

    if (!response.startsWith("220")) {
      throw new Error(`SMTP connect failed: ${response}`);
    }

    await writeSmtpCommand(writer, "EHLO localhost\r\n");
    response = await readSmtpResponse(reader);

    if (!response.includes("250")) {
      throw new Error(`SMTP EHLO failed: ${response}`);
    }

    await writeSmtpCommand(writer, "AUTH LOGIN\r\n");
    response = await readSmtpResponse(reader);

    if (!response.startsWith("334")) {
      throw new Error(`SMTP AUTH LOGIN failed: ${response}`);
    }

    await writeSmtpCommand(writer, `${btoa(SMTP_USER)}\r\n`);
    response = await readSmtpResponse(reader);

    if (!response.startsWith("334")) {
      throw new Error(`SMTP username rejected: ${response}`);
    }

    await writeSmtpCommand(writer, `${btoa(SMTP_PASS)}\r\n`);
    response = await readSmtpResponse(reader);

    if (!response.startsWith("235")) {
      throw new Error(`SMTP password rejected: ${response}`);
    }

    await writeSmtpCommand(writer, `MAIL FROM:<${SMTP_FROM}>\r\n`);
    response = await readSmtpResponse(reader);

    if (!response.startsWith("250")) {
      throw new Error(`SMTP MAIL FROM failed: ${response}`);
    }

    for (const recipient of to) {
      await writeSmtpCommand(writer, `RCPT TO:<${recipient}>\r\n`);
      response = await readSmtpResponse(reader);

      if (!response.startsWith("250") && !response.startsWith("251")) {
        throw new Error(`SMTP RCPT TO failed for ${recipient}: ${response}`);
      }
    }

    await writeSmtpCommand(writer, "DATA\r\n");
    response = await readSmtpResponse(reader);

    if (!response.startsWith("354")) {
      throw new Error(`SMTP DATA failed: ${response}`);
    }

    const boundary = `krishnormi-${crypto.randomUUID()}`;
    const relatedBoundary = `krishnormi-related-${crypto.randomUUID()}`;

    const htmlPart = [
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      encodeMimeBody(html),
    ];

    // Inline images travel inside the email and are referenced from the HTML
    // as cid:<id>, so they show without the client fetching anything remote.
    const htmlWithImagesPart = [
      `Content-Type: multipart/related; boundary="${relatedBoundary}"`,
      "",
      `--${relatedBoundary}`,
      ...htmlPart,
      ...inlineImages.flatMap((image) => [
        `--${relatedBoundary}`,
        `Content-Type: image/png; name="${image.filename}"`,
        "Content-Transfer-Encoding: base64",
        `Content-ID: <${image.cid}>`,
        `Content-Disposition: inline; filename="${image.filename}"`,
        "",
        image.base64.replace(/.{76}/g, "$&\r\n"),
      ]),
      `--${relatedBoundary}--`,
    ];

    const emailMessage = [
      `From: Krishnormi Dermatology <${SMTP_FROM}>`,
      `To: ${to.join(", ")}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      encodeMimeBody(text),
      `--${boundary}`,
      ...(inlineImages.length > 0 ? htmlWithImagesPart : htmlPart),
      `--${boundary}--`,
      ".",
      "",
    ].join("\r\n");

    await writeSmtpCommand(writer, `${emailMessage}\r\n`);
    response = await readSmtpResponse(reader);

    if (!response.startsWith("250")) {
      throw new Error(`SMTP message send failed: ${response}`);
    }

    return {
      ok: true,
      status: 250,
      data: {
        messageId: response,
      },
    };
  } finally {
    try {
      await writeSmtpCommand(writer, "QUIT\r\n");
      await readSmtpResponse(reader);
    } catch {
      // Ignore QUIT errors during cleanup.
    }

    try {
      writer.releaseLock();
    } catch {
      // Ignore release lock errors.
    }

    try {
      conn.close();
    } catch {
      // Ignore close errors.
    }
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        success: false,
        customerEmailSent: false,
        adminEmailSent: false,
        errors: ["Method not allowed. Please use POST."],
      },
      405,
    );
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")?.trim();
    const RESEND_FROM_EMAIL =
      Deno.env.get("RESEND_FROM_EMAIL")?.trim() ||
      "Krishnormi Dermatology <onboarding@resend.dev>";
    const ADMIN_NOTIFICATION_EMAIL =
      Deno.env.get("ADMIN_NOTIFICATION_EMAIL")?.trim() || "";
    const TEST_MODE =
      (Deno.env.get("TEST_MODE") ?? "true").trim().toLowerCase() === "true";
    const TEST_EMAIL = Deno.env.get("TEST_EMAIL")?.trim() || "";

    const SMTP_HOST = Deno.env.get("SMTP_HOST")?.trim() || "smtp.gmail.com";
    const SMTP_PORT = Number(Deno.env.get("SMTP_PORT") || "465");
    const SMTP_USER = Deno.env.get("SMTP_USER")?.trim() || "";
    const SMTP_PASS = Deno.env.get("SMTP_PASS")?.trim() || "";
    const SMTP_FROM = Deno.env.get("SMTP_FROM")?.trim() || SMTP_USER;

    if (!SMTP_USER || !SMTP_PASS) {
      return jsonResponse(
        {
          success: false,
          customerEmailSent: false,
          adminEmailSent: false,
          errors: ["SMTP_USER and SMTP_PASS must be configured in Supabase secrets."],
        },
        500,
      );
    }

    if (TEST_MODE && !TEST_EMAIL) {
      return jsonResponse(
        {
          success: false,
          customerEmailSent: false,
          adminEmailSent: false,
          errors: ["TEST_EMAIL is required while TEST_MODE=true."],
        },
        500,
      );
    }

    if (!TEST_MODE && !ADMIN_NOTIFICATION_EMAIL) {
      return jsonResponse(
        {
          success: false,
          customerEmailSent: false,
          adminEmailSent: false,
          errors: ["ADMIN_NOTIFICATION_EMAIL is not configured."],
        },
        500,
      );
    }

    let raw: any = null;

    try {
      const bodyText = await req.text();

      if (!bodyText || !bodyText.trim()) {
        return jsonResponse(
          {
            success: false,
            customerEmailSent: false,
            adminEmailSent: false,
            errors: ["Request body is empty."],
          },
          400,
        );
      }

      raw = JSON.parse(bodyText);
    } catch {
      return jsonResponse(
        {
          success: false,
          customerEmailSent: false,
          adminEmailSent: false,
          errors: ["Invalid JSON request body."],
        },
        400,
      );
    }

    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      return jsonResponse(
        {
          success: false,
          customerEmailSent: false,
          adminEmailSent: false,
          errors: ["Request body must be a JSON object."],
        },
        400,
      );
    }

    const name = String(raw?.name ?? "").trim();
    const email = String(raw?.email ?? "").trim().toLowerCase();
    const phone = String(raw?.phone ?? "").replace(/\D/g, "");
    const treatment = String(raw?.treatment ?? "").trim();
    const date = String(raw?.date ?? "").trim();
    const message = String(raw?.message ?? "").trim();

    const validationErrors: string[] = [];

    if (name.length < 2) {
      validationErrors.push("A valid name is required.");
    }

    if (!EMAIL_REGEX.test(email)) {
      validationErrors.push("A valid email address is required.");
    }

    if (!PHONE_REGEX.test(phone)) {
      validationErrors.push("A valid 10-digit Indian mobile number is required.");
    }

    if (!treatment) {
      validationErrors.push("Treatment is required.");
    }

    if (!date) {
      validationErrors.push("Preferred appointment date is required.");
    }

    if (validationErrors.length > 0) {
      return jsonResponse(
        {
          success: false,
          customerEmailSent: false,
          adminEmailSent: false,
          errors: validationErrors,
        },
        400,
      );
    }

    const formattedDate = formatDate(date);

    const customerSubject = "Thank You for Contacting KRISHNORMI";
    const adminSubject = "New KRISHNORMI Appointment Request";

    const SITE_URL = (
      Deno.env.get("SITE_URL")?.trim() || "https://krishnormi.vercel.app"
    ).replace(/\/+$/, "");

    // The logos (from src/assets/header) are attached to the email inline and
    // referenced by Content-ID, so they do not depend on any remote URL.
    const LOGO_ICON_URL = "cid:krishnormi-logo-icon";
    const LOGO_WORDMARK_URL = "cid:krishnormi-logo-wordmark";
    const logoImages = [
      { cid: "krishnormi-logo-icon", filename: "logo-icon.png", base64: LOGO_ICON_BASE64 },
      { cid: "krishnormi-logo-wordmark", filename: "logo-wordmark.png", base64: LOGO_WORDMARK_BASE64 },
    ];

    const FONT_SANS = "Arial, Helvetica, sans-serif";
    const FONT_SERIF = "Georgia, 'Times New Roman', serif";

    const detailRow = (label: string, valueHtml: string, isLast = false) => `
                <tr>
                  <td width="38%" valign="top" style="padding:14px 12px 14px 22px;${isLast ? "" : "border-bottom:1px solid #f1e8ec;"}color:#8a8a8a;font-family:${FONT_SANS};font-size:11px;line-height:20px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;">${label}</td>
                  <td width="62%" valign="top" style="padding:14px 22px 14px 12px;${isLast ? "" : "border-bottom:1px solid #f1e8ec;"}color:#2f2f2f;font-family:${FONT_SANS};font-size:14px;line-height:20px;font-weight:600;word-break:break-word;">${valueHtml}</td>
                </tr>`;

    const stepRow = (
      badge: string,
      badgeBackground: string,
      badgeColor: string,
      title: string,
      titleColor: string,
      description: string,
      isLast = false,
    ) => `
                <tr>
                  <td width="44" valign="top" style="padding:0 0 ${isLast ? "0" : "22px"};">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td width="44" height="44" align="center" valign="middle" bgcolor="${badgeBackground}" style="width:44px;height:44px;background:${badgeBackground};border-radius:22px;color:${badgeColor};font-family:${FONT_SANS};font-size:15px;line-height:44px;font-weight:700;">${badge}</td>
                      </tr>
                    </table>
                  </td>
                  <td valign="top" style="padding:2px 0 ${isLast ? "0" : "22px"} 16px;">
                    <p style="margin:0 0 3px;color:${titleColor};font-family:${FONT_SANS};font-size:15px;line-height:22px;font-weight:700;">${title}</p>
                    <p style="margin:0;color:#6b6b6b;font-family:${FONT_SANS};font-size:13px;line-height:21px;">${description}</p>
                  </td>
                </tr>`;

    const customerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Thank You for Contacting KRISHNORMI</title>
  <style>
    body { margin: 0; padding: 0; width: 100%; background-color: #f7f3f1; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding-left: 22px !important; padding-right: 22px !important; }
      .hero-title { font-size: 28px !important; line-height: 36px !important; }
      .section-title { font-size: 21px !important; line-height: 29px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f7f3f1;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f7f3f1;font-size:1px;line-height:1px;">
    We have received your appointment request for ${escapeHtml(treatment)}. Our team will contact you shortly.
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f7f3f1" style="width:100%;background-color:#f7f3f1;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" class="email-container" bgcolor="#ffffff" style="width:100%;max-width:600px;background:#ffffff;margin:0 auto;">
          <tr>
            <td height="5" bgcolor="#16845b" style="height:5px;line-height:5px;font-size:0;background:#16845b;">&nbsp;</td>
          </tr>
          <tr>
            <td align="center" class="mobile-padding" style="padding:34px 40px 30px;background:#ffffff;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td valign="middle" style="padding:0 12px 0 0;">
                    <a href="${SITE_URL}/" target="_blank" style="text-decoration:none;">
                      <img src="${LOGO_ICON_URL}" alt="" width="52" height="56" style="display:block;width:52px;height:56px;border:0;" />
                    </a>
                  </td>
                  <td valign="middle">
                    <a href="${SITE_URL}/" target="_blank" style="text-decoration:none;">
                      <img src="${LOGO_WORDMARK_URL}" alt="KRISHNORMI" width="198" height="27" style="display:block;width:198px;height:27px;border:0;color:#b52d68;font-family:${FONT_SERIF};font-size:26px;line-height:27px;font-weight:700;letter-spacing:2px;" />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:16px 0 0;color:#16845b;font-family:${FONT_SANS};font-size:10px;line-height:16px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;">
                Skin &nbsp;&bull;&nbsp; Hair &nbsp;&bull;&nbsp; Laser &nbsp;&bull;&nbsp; Aesthetics
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" class="mobile-padding" bgcolor="#fdf4f7" style="padding:44px 48px 46px;background:#fdf4f7;border-top:1px solid #f4e3ea;border-bottom:1px solid #f4e3ea;">
              <p style="margin:0 0 14px;color:#16845b;font-family:${FONT_SANS};font-size:11px;line-height:18px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;">
                Request Received
              </p>
              <h1 class="hero-title" style="margin:0 0 18px;color:#b52d68;font-family:${FONT_SERIF};font-size:34px;line-height:42px;font-weight:700;">
                Thank you, ${escapeHtml(name)}
              </h1>
              <p style="margin:0 auto;max-width:460px;color:#555555;font-family:${FONT_SANS};font-size:15px;line-height:25px;">
                We have received your appointment request at
                <strong style="color:#2f2f2f;">Krishnormi Dermatology</strong>.
                Our team will contact you shortly to confirm your visit.
              </p>
            </td>
          </tr>
          <tr>
            <td class="mobile-padding" style="padding:42px 40px 14px;background:#ffffff;">
              <p style="margin:0 0 8px;color:#16845b;font-family:${FONT_SANS};font-size:11px;line-height:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                Your Request
              </p>
              <h2 class="section-title" style="margin:0 0 20px;color:#2f2f2f;font-family:${FONT_SERIF};font-size:24px;line-height:32px;font-weight:700;">
                Here's what you shared with us
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;border:1px solid #f1e8ec;border-radius:10px;background:#ffffff;">${detailRow("Treatment", `<span style="color:#b52d68;">${escapeHtml(treatment)}</span>`)}${detailRow("Preferred Date", escapeHtml(formattedDate || date))}${detailRow("Name", escapeHtml(name))}${detailRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:#2f2f2f;text-decoration:none;">${escapeHtml(email)}</a>`)}${detailRow("Mobile", `+91 ${escapeHtml(phone)}`, !message)}${message ? detailRow("Message", `<span style="color:#555555;font-weight:400;">${escapeHtml(message).replace(/\r?\n/g, "<br />")}</span>`, true) : ""}
              </table>
            </td>
          </tr>
          <tr>
            <td class="mobile-padding" style="padding:32px 40px 44px;background:#ffffff;">
              <p style="margin:0 0 8px;color:#16845b;font-family:${FONT_SANS};font-size:11px;line-height:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
                What Happens Next
              </p>
              <h2 class="section-title" style="margin:0 0 24px;color:#2f2f2f;font-family:${FONT_SERIF};font-size:24px;line-height:32px;font-weight:700;">
                Three simple steps
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;">${stepRow("&#10003;", "#16845b", "#ffffff", "Request received", "#16845b", "Your details have reached our clinic team safely.")}${stepRow("2", "#b52d68", "#ffffff", "Being reviewed", "#b52d68", "We are checking availability for your preferred date.")}${stepRow("3", "#f2eef0", "#a8979f", "We'll be in touch", "#2f2f2f", "Our team will call or email you to confirm your appointment. Visits are by confirmed appointment only.", true)}
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" class="mobile-padding" bgcolor="#b52d68" style="padding:42px 40px 44px;background:#b52d68;">
              <h2 class="section-title" style="margin:0 0 12px;color:#ffffff;font-family:${FONT_SERIF};font-size:24px;line-height:32px;font-weight:700;">
                Need to reach us sooner?
              </h2>
              <p style="margin:0 auto 24px;max-width:420px;color:#fbe9f0;font-family:${FONT_SANS};font-size:14px;line-height:23px;">
                Call the clinic on
                <a href="tel:+917935641858" style="color:#ffffff;font-weight:700;text-decoration:none;white-space:nowrap;">079 3564 1858</a>
                and we will be happy to help.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="background:#ffffff;border-radius:26px;">
                    <a href="${SITE_URL}/" target="_blank" style="display:inline-block;padding:13px 30px;color:#b52d68;font-family:${FONT_SANS};font-size:13px;line-height:18px;font-weight:700;text-decoration:none;">Visit Our Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" class="mobile-padding" style="padding:34px 40px 36px;background:#ffffff;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto 14px;">
                <tr>
                  <td valign="middle" style="padding:0 9px 0 0;">
                    <img src="${LOGO_ICON_URL}" alt="" width="32" height="35" style="display:block;width:32px;height:35px;border:0;" />
                  </td>
                  <td valign="middle">
                    <img src="${LOGO_WORDMARK_URL}" alt="KRISHNORMI" width="124" height="17" style="display:block;width:124px;height:17px;border:0;" />
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 4px;color:#2f2f2f;font-family:${FONT_SANS};font-size:13px;line-height:20px;font-weight:700;">
                Krishnormi Dermatology
              </p>
              <p style="margin:0 auto 16px;max-width:400px;color:#8a8a8a;font-family:${FONT_SANS};font-size:12px;line-height:19px;">
                311, 312, Akshar Complex, Shivranjani Cross Road, Satellite, Ahmedabad, Gujarat 380015
              </p>
              <p style="margin:0 0 18px;font-family:${FONT_SANS};font-size:12px;line-height:18px;">
                <a href="${SITE_URL}/" target="_blank" style="color:#16845b;font-weight:700;text-decoration:none;">Website</a>
                <span style="color:#d5d5d5;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a href="${SITE_URL}/treatments" target="_blank" style="color:#16845b;font-weight:700;text-decoration:none;">Treatments</a>
                <span style="color:#d5d5d5;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a href="${SITE_URL}/contact-us" target="_blank" style="color:#16845b;font-weight:700;text-decoration:none;">Contact Us</a>
              </p>
              <p style="margin:0;color:#a5a5a5;font-family:${FONT_SANS};font-size:11px;line-height:17px;">
                &copy; ${new Date().getFullYear()} Krishnormi. All rights reserved.
              </p>
              <p style="margin:6px 0 0;color:#b5b5b5;font-family:${FONT_SANS};font-size:11px;line-height:17px;">
                This is an automated confirmation email. Please do not reply to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const customerText = [
      `Thank You, ${name}`,
      "",
      "Thank you for contacting KRISHNORMI – Dr. Deepa Bhatt.",
      "We have successfully received your appointment request.",
      "",
      `Treatment: ${treatment}`,
      `Preferred Date: ${formattedDate || date}`,
      `Mobile Number: ${phone}`,
      "",
      "Thank you for choosing KRISHNORMI.",
    ].join("\n");

    const adminHtml = `<!doctype html><html><body style="margin:0;padding:0;background:#f4f7f5;font-family:Arial,Helvetica,sans-serif;color:#344054;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#f4f7f5;padding:32px 14px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;"><tr><td style="padding:30px 32px;background:#173f30;text-align:center;"><div style="margin:0 0 6px;color:#dfe9e3;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;">New Appointment Request</div><div style="margin:0;color:#ffffff;font-size:26px;line-height:1.3;font-weight:700;">KRISHNORMI</div></td></tr><tr><td style="padding:34px 32px 30px;"><div style="margin:0 0 14px;color:#173f30;font-size:22px;line-height:1.35;font-weight:700;">New Contact Form Submission</div><p style="margin:0 0 18px;color:#52645b;font-size:14px;line-height:1.75;">A new appointment request has been received from the website.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 22px;background:#f8faf9;border:1px solid #e1ebe5;border-radius:10px;"><tr><td style="padding:11px 16px;border-bottom:1px solid #e8eeea;color:#7b8d84;font-size:13px;width:145px;">Name</td><td style="padding:11px 16px;border-bottom:1px solid #e8eeea;color:#344054;font-size:14px;font-weight:600;">${escapeHtml(name)}</td></tr><tr><td style="padding:11px 16px;border-bottom:1px solid #e8eeea;color:#7b8d84;font-size:13px;">Email</td><td style="padding:11px 16px;border-bottom:1px solid #e8eeea;color:#344054;font-size:14px;font-weight:600;">${escapeHtml(email)}</td></tr><tr><td style="padding:11px 16px;border-bottom:1px solid #e8eeea;color:#7b8d84;font-size:13px;">Mobile Number</td><td style="padding:11px 16px;border-bottom:1px solid #e8eeea;color:#344054;font-size:14px;font-weight:600;">${escapeHtml(phone)}</td></tr><tr><td style="padding:11px 16px;border-bottom:1px solid #e8eeea;color:#7b8d84;font-size:13px;">Treatment</td><td style="padding:11px 16px;border-bottom:1px solid #e8eeea;color:#344054;font-size:14px;font-weight:600;">${escapeHtml(treatment)}</td></tr><tr><td style="padding:11px 16px;color:#7b8d84;font-size:13px;">Preferred Date</td><td style="padding:11px 16px;color:#344054;font-size:14px;font-weight:600;">${escapeHtml(formattedDate || date)}</td></tr></table>${message ? `<p style="margin:0 0 18px;color:#52645b;font-size:14px;line-height:1.75;"><strong>Message:</strong> ${escapeHtml(message)}</p>` : ""}<p style="margin:0;color:#667085;font-size:13px;line-height:1.7;">Please contact the patient to confirm the appointment.</p></td></tr></table></td></tr></table></body></html>`;

    const adminText = [
      "New KRISHNORMI Appointment Request",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Mobile Number: ${phone}`,
      `Treatment: ${treatment}`,
      `Preferred Date: ${formattedDate || date}`,
      message ? `Message: ${message}` : "",
      "",
      "Please contact the patient to confirm the appointment.",
    ].filter(Boolean).join("\n");

    const customerRecipient = TEST_MODE ? TEST_EMAIL : email;
    const adminRecipient = TEST_MODE ? TEST_EMAIL : ADMIN_NOTIFICATION_EMAIL;

    const customerResult = await sendEmailViaGmailSmtp({
      to: [customerRecipient],
      subject: TEST_MODE ? `[TEST - Patient] ${customerSubject}` : customerSubject,
      html: customerHtml,
      text: customerText,
      inlineImages: logoImages,
    });

    const adminResult = await sendEmailViaGmailSmtp({
      to: [adminRecipient],
      subject: TEST_MODE ? `[TEST - Clinic] ${adminSubject}` : adminSubject,
      html: adminHtml,
      text: adminText,
    });

    return jsonResponse(
      {
        success: true,
        customerEmailSent: customerResult.ok,
        adminEmailSent: adminResult.ok,
        testMode: TEST_MODE,
        errors: [],
      },
      200,
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        customerEmailSent: false,
        adminEmailSent: false,
        errors: [error instanceof Error ? error.message : "Unexpected server error."],
      },
      500,
    );
  }
});
