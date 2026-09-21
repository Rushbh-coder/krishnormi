// @ts-nocheck
import logo from "../../../src/assets/header/logo-icon.png"
import logoText from "../../../src/assets/header/logo-wordmark.png"
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
}: {
  to: string[];
  subject: string;
  html: string;
  text: string;
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

    const emailMessage = [
      `From: ${SMTP_FROM}`,
      `To: ${to.join(", ")}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      html,
      "",
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

    const customerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Thank You for Reaching Out | Krishnormi</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #f7f3f1;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; }
    a { text-decoration: none; }
    @keyframes krishnormiLogoFade { 0% { opacity: 0; transform: translateY(-8px);} 100% { opacity:1; transform: translateY(0);} }
    @keyframes krishnormiServices { 0% { opacity:0; transform:translateY(8px);} 100% { opacity:1; transform:translateY(0);} }
    @keyframes krishnormiHero { 0% { opacity:0; transform:scale(1.035);} 100% { opacity:1; transform:scale(1);} }
    @keyframes krishnormiHeading { 0% { opacity:0; transform:translateY(18px);} 100% { opacity:1; transform:translateY(0);} }
    @keyframes krishnormiDescription { 0% { opacity:0; transform:translateY(12px);} 100% { opacity:1; transform:translateY(0);} }
    @keyframes krishnormiDots { 0%, 100% { opacity:0.55;} 50% { opacity:1;} }
    @keyframes krishnormiTrackStep { 0% { opacity:0; transform:translateY(10px) scale(0.9);} 100% { opacity:1; transform:translateY(0) scale(1);} }
    @keyframes krishnormiTrackFill { 0% { background-position:100% 0;} 100% { background-position:0 0;} }
    @keyframes krishnormiTrackPulse { 0% { transform:scale(0.75); opacity:0.55;} 70% { transform:scale(1.7); opacity:0;} 100% { transform:scale(1.7); opacity:0;} }
    @keyframes krishnormiTrackGlow { 0%, 100% { box-shadow:0 0 0 0 rgba(181,45,104,0.35);} 50% { box-shadow:0 0 0 8px rgba(181,45,104,0);} }
    @supports (animation-name: krishnormiLogoFade) {
      .krishnormi-logo-animation { animation: krishnormiLogoFade 0.9s ease-out both; }
      .krishnormi-services-animation { animation: krishnormiServices 0.7s ease-out 0.35s both; }
      .krishnormi-hero-animation { animation: krishnormiHero 1.8s ease-out both; }
      .krishnormi-heading-animation { animation: krishnormiHeading 0.85s ease-out 0.35s both; }
      .krishnormi-description-animation { animation: krishnormiDescription 0.8s ease-out 0.55s both; }
      .krishnormi-dots-animation { animation: krishnormiDots 2.4s ease-in-out infinite; }
      .krishnormi-track-step-1 { animation: krishnormiTrackStep 0.6s ease-out 0.2s both; }
      .krishnormi-track-step-2 { animation: krishnormiTrackStep 0.6s ease-out 0.9s both; }
      .krishnormi-track-step-3 { animation: krishnormiTrackStep 0.6s ease-out 1.6s both; }
      .krishnormi-track-line-1 { animation: krishnormiTrackFill 0.9s ease-out 0.7s both; }
      .krishnormi-track-pulse { animation: krishnormiTrackPulse 1.8s ease-out 1.1s infinite; }
      .krishnormi-track-active-node { animation: krishnormiTrackGlow 1.8s ease-in-out 1.1s infinite; }
    }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding-left: 24px !important; padding-right: 24px !important; }
      .hero-title { font-size: 34px !important; line-height: 42px !important; }
      .section-title { font-size: 25px !important; line-height: 34px !important; }
      .hero-image { width: 100% !important; height: auto !important; }
      .track-label { font-size: 10px !important; }
      .track-node { width: 46px !important; height: 46px !important; font-size: 15px !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f7f3f1;width:100%;">
    <tr>
      <td align="center" style="padding:40px 15px;">
        <table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" class="email-container" style="width:620px;max-width:620px;background:#ffffff;margin:0 auto;">
          <tr>
            <td align="center" style="background:#ffffff;padding:32px 30px 8px;">
              <img
src="https://krishnormi.vercel.app/public/logo-icon.png"
alt="Krishnormi Logo"
width="80"
style="
display:block;
height:auto;
margin:auto;
"
/>              <img class="krishnormi-logo-animation" src={logoText} alt="Krishnormi" width="190" style="display:block;width:190px;max-width:100%;height:auto;margin:0 auto;opacity:1;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#ffffff;padding:4px 30px 28px;">
              <p class="krishnormi-services-animation" style="margin:0;padding:0;color:#16845b;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:18px;font-weight:600;letter-spacing:2px;text-align:center;opacity:1;">
                SKIN&nbsp;&nbsp;•&nbsp;&nbsp;HAIR&nbsp;&nbsp;•&nbsp;&nbsp;LASER&nbsp;&nbsp;•&nbsp;&nbsp;AESTHETICS
              </p>
            </td>
          </tr>
          <tr>
            <td style="overflow:hidden;line-height:0;font-size:0;">
              <img class="hero-image krishnormi-hero-animation" src="https://krishnormi.vercel.app/images/krishnormi-contact-banner.jpg" alt="Krishnormi" width="620" style="display:block;width:100%;max-width:620px;height:auto;margin:0;opacity:1;" />
            </td>
          </tr>
          <tr>
            <td align="center" class="mobile-padding" style="background:#fffaf8;padding:48px 50px 45px;">
              <p style="margin:0 0 15px;color:#16845b;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:18px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;">
                MESSAGE RECEIVED
              </p>
              <h1 class="hero-title krishnormi-heading-animation" style="margin:0 0 20px;color:#b52d68;font-family:Georgia, 'Times New Roman', serif;font-size:40px;line-height:48px;font-weight:600;opacity:1;">
                Thank You for<br />
                Reaching Out
              </h1>
              <p class="krishnormi-description-animation" style="margin:0 auto;max-width:480px;color:#555555;font-family:Arial, Helvetica, sans-serif;font-size:15px;line-height:26px;opacity:1;">
                Hi <strong style="color:#333333;">${escapeHtml(name)}</strong>,<br /><br />
                We're so glad you connected with <strong style="color:#333333;">Krishnormi</strong>.
                Your message has been received successfully, and our team will be in touch with you shortly.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#fffaf8;padding:0 0 35px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="krishnormi-dots-animation" style="width:6px;height:6px;background:#b52d68;border-radius:50%;font-size:0;">&nbsp;</td>
                  <td style="width:8px;"></td>
                  <td class="krishnormi-dots-animation" style="width:6px;height:6px;background:#16845b;border-radius:50%;font-size:0;animation-delay:0.2s;">&nbsp;</td>
                  <td style="width:8px;"></td>
                  <td class="krishnormi-dots-animation" style="width:6px;height:6px;background:#b52d68;border-radius:50%;font-size:0;animation-delay:0.4s;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="mobile-padding" style="background:#ffffff;padding:48px 50px 52px;">
              <p align="center" style="margin:0 0 10px;color:#16845b;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:18px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">
                WHAT HAPPENS NEXT
              </p>
              <h2 class="section-title" align="center" style="margin:0 0 10px;color:#303030;font-family:Georgia, 'Times New Roman', serif;font-size:28px;line-height:36px;font-weight:600;">
                Your message is with us.
              </h2>
              <p align="center" style="margin:0 0 40px;color:#999999;font-family:Arial, Helvetica, sans-serif;font-size:12px;line-height:19px;">
                Status:
                <span style="color:#b52d68; font-weight:700;">Under Review</span>
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="18%" align="center" valign="top">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="krishnormi-track-step-1" style="opacity:1;">
                      <tr>
                        <td align="center" valign="middle" class="track-node" style="width:52px;height:52px;background:#16845b;border-radius:50%;color:#ffffff;font-family:Arial, Helvetica, sans-serif;font-size:18px;font-weight:bold;line-height:52px;">✓</td>
                      </tr>
                    </table>
                  </td>
                  <td width="32%" align="center" valign="middle" style="padding:0 4px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td class="krishnormi-track-line-1" style="height:4px;line-height:4px;font-size:0;border-radius:2px;background-image:linear-gradient(to right, #16845b 50%, #ece3e8 50%);background-size:200% 100%;background-position:0 0;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                  <td width="18%" align="center" valign="top">
                    <div class="krishnormi-track-step-2" style="position:relative;width:52px;margin:0 auto;opacity:1;">
                      <div class="krishnormi-track-pulse" style="position:absolute;top:0;left:0;width:52px;height:52px;border-radius:50%;background:#b52d68;"></div>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="position:relative;">
                        <tr>
                          <td align="center" valign="middle" class="krishnormi-track-active-node track-node" style="width:52px;height:52px;background:#b52d68;border-radius:50%;color:#ffffff;font-family:Arial, Helvetica, sans-serif;font-size:18px;font-weight:bold;line-height:52px;">02</td>
                        </tr>
                      </table>
                    </div>
                  </td>
                  <td width="32%" align="center" valign="middle" style="padding:0 4px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="height:4px;line-height:4px;font-size:0;border-radius:2px;background:#ece3e8;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                  <td width="18%" align="center" valign="top">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" class="krishnormi-track-step-3" style="opacity:1;">
                      <tr>
                        <td align="center" valign="middle" class="track-node" style="width:52px;height:52px;min-width:52px;max-width:52px;box-sizing:border-box;background:#f2eef0;box-shadow:inset 0 0 0 1px #e4dade;border-radius:50%;color:#bbaab4;font-family:Arial, Helvetica, sans-serif;font-size:18px;font-weight:bold;line-height:52px;">03</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td width="18%" align="center" style="padding-top:12px;">
                    <p class="track-label" style="margin:0;color:#16845b;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:16px;font-weight:700;">Message<br />Received</p>
                  </td>
                  <td width="32%"></td>
                  <td width="18%" align="center" style="padding-top:12px;">
                    <p class="track-label" style="margin:0;color:#b52d68;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:16px;font-weight:700;">Being<br />Reviewed</p>
                  </td>
                  <td width="32%"></td>
                  <td width="18%" align="center" style="padding-top:12px;">
                    <p class="track-label" style="margin:0;color:#aaaaaa;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:16px;font-weight:600;">We'll Be<br />In Touch</p>
                  </td>
                </tr>
              </table>
              <p align="center" style="margin:34px 0 0;color:#777777;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:22px;">
                Our team typically reaches out within 24–48 hours. We'll keep this simple — no action needed from you right now.
              </p>
            </td>
          </tr>
          <tr>
            <td class="mobile-padding" style="background:#faf7f8;padding:48px 50px;">
              <p style="margin:0 0 9px;color:#16845b;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:18px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">
                YOUR ENQUIRY
              </p>
              <h2 class="section-title" style="margin:0 0 25px;color:#303030;font-family:Georgia, 'Times New Roman', serif;font-size:26px;line-height:35px;font-weight:600;">
                Here's what you shared with us
              </h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#ffffff;border:1px solid #eee6e9;">
                <tr>
                  <td style="padding:22px 24px 8px;">
                    <p style="margin:0 0 5px;color:#999999;font-family:Arial, Helvetica, sans-serif;font-size:10px;line-height:15px;font-weight:600;letter-spacing:1.5px;">NAME</p>
                    <p style="margin:0;color:#333333;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:22px;font-weight:600;">${escapeHtml(name)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 24px;">
                    <p style="margin:0 0 5px;color:#999999;font-family:Arial, Helvetica, sans-serif;font-size:10px;line-height:15px;font-weight:600;letter-spacing:1.5px;">EMAIL</p>
                    <p style="margin:0;color:#333333;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:22px;">${escapeHtml(email)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 24px;">
                    <p style="margin:0 0 5px;color:#999999;font-family:Arial, Helvetica, sans-serif;font-size:10px;line-height:15px;font-weight:600;letter-spacing:1.5px;">PHONE</p>
                    <p style="margin:0;color:#333333;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:22px;">${escapeHtml(phone)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 24px 24px;">
                    <p style="margin:0 0 7px;color:#999999;font-family:Arial, Helvetica, sans-serif;font-size:10px;line-height:15px;font-weight:600;letter-spacing:1.5px;">MESSAGE</p>
                    <p style="margin:0;color:#555555;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;">${escapeHtml(message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" class="mobile-padding" style="background:#b52d68;padding:55px 50px;">
              <p style="margin:0 0 16px;color:#ffffff;font-family:Arial, Helvetica, sans-serif;font-size:10px;line-height:18px;font-weight:600;letter-spacing:3px;text-transform:uppercase;">
                THE KRISHNORMI EXPERIENCE
              </p>
              <h2 style="margin:0 0 18px;color:#ffffff;font-family:Georgia, 'Times New Roman', serif;font-size:30px;line-height:40px;font-weight:600;">
                Every connection<br />
                begins with a conversation.
              </h2>
              <p style="max-width:450px;margin:0 auto 28px;color:#ffffff;font-family:Arial, Helvetica, sans-serif;font-size:14px;line-height:24px;">
                We're here to listen, understand and help. Thank you for taking the first step and connecting with Krishnormi.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td align="center" style="background:#ffffff;border-radius:30px;">
                    <a href="https://krishnormi.vercel.app/" target="_blank" style="display:inline-block;padding:13px 28px;color:#b52d68;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:18px;font-weight:600;text-decoration:none;">
                      Explore Krishnormi →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#f1f7f4;padding:42px 30px;">
              <p style="margin:0 0 8px;color:#16845b;font-family:Arial, Helvetica, sans-serif;font-size:10px;line-height:18px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">
                STAY CONNECTED
              </p>
              <h3 style="margin:0 0 22px;color:#333333;font-family:Georgia, 'Times New Roman', serif;font-size:22px;line-height:30px;font-weight:600;">
                Follow Krishnormi
              </h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                <tr>
                  <td style="padding:0 10px;"><a href="https://instagram.com/" target="_blank" style="color:#b52d68;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:20px;font-weight:600;text-decoration:none;">Instagram</a></td>
                  <td style="color:#cfcfcf;">•</td>
                  <td style="padding:0 10px;"><a href="https://facebook.com/" target="_blank" style="color:#b52d68;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:20px;font-weight:600;text-decoration:none;">Facebook</a></td>
                  <td style="color:#cfcfcf;">•</td>
                  <td style="padding:0 10px;"><a href="https://linkedin.com/" target="_blank" style="color:#b52d68;font-family:Arial, Helvetica, sans-serif;font-size:13px;line-height:20px;font-weight:600;text-decoration:none;">LinkedIn</a></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#ffffff;padding:35px 30px 38px;">
              <img src="./logo.png" alt="Krishnormi" width="145" style="display:block;width:145px;max-width:100%;height:auto;margin:0 auto 18px;" />
              <p style="max-width:430px;margin:0 auto 17px;color:#999999;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:19px;">
                Thank you for reaching out to Krishnormi. We appreciate your interest and look forward to connecting with you.
              </p>
              <p style="margin:0 0 15px;font-family:Arial, Helvetica, sans-serif;font-size:11px;line-height:18px;">
                <a href="https://yourdomain.com" target="_blank" style="color:#777777;text-decoration:none;">Website</a>
                <span style="color:#cccccc;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a href="https://yourdomain.com/contact" target="_blank" style="color:#777777;text-decoration:none;">Contact</a>
                <span style="color:#cccccc;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a href="https://yourdomain.com/privacy-policy" target="_blank" style="color:#777777;text-decoration:none;">Privacy Policy</a>
              </p>
              <p style="margin:0;color:#aaaaaa;font-family:Arial, Helvetica, sans-serif;font-size:10px;line-height:17px;">
                © 2026 Krishnormi. All rights reserved.
              </p>
              <p style="margin:7px 0 0;color:#bbbbbb;font-family:Arial, Helvetica, sans-serif;font-size:10px;line-height:17px;">
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
