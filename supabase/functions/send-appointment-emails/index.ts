// @ts-nocheck

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

    const customerHtml = `<!doctype html>
<div style="max-width:620px;margin:20px auto;background:#ffffff;border:1px solid #e4ebe7;border-radius:16px;overflow:hidden;font-family:Arial,sans-serif;box-shadow:0 8px 30px rgba(23,63,48,.08);">
  <div style="background:#173f30;padding:30px 35px;text-align:center;">
    <div style="font-size:27px;font-weight:700;color:#ffffff;letter-spacing:1px;">KRISHNORMI</div>
    <div style="font-size:13px;color:#d8e5de;margin-top:7px;">Dr. Deepa Bhatt</div>
  </div>
  <div style="padding:38px 38px 32px;">
    <div style="font-size:12px;font-weight:700;color:#17773f;letter-spacing:1.3px;text-transform:uppercase;margin-bottom:10px;">Appointment Request Received</div>
    <div style="font-size:24px;font-weight:700;color:#173f30;margin-bottom:16px;">Thank You, ${escapeHtml(name)}!</div>
    <div style="font-size:14px;line-height:1.75;color:#56665e;margin-bottom:25px;">
      Thank you for contacting <b>KRISHNORMI – Dr. Deepa Bhatt.</b><br><br>
      We have received your appointment request. Our clinic team will contact you shortly to confirm your appointment based on availability.
    </div>
    <div style="font-size:15px;font-weight:700;color:#173f30;margin-bottom:12px;">Your Request Details</div>
    <table style="width:100%;border-collapse:collapse;background:#f7faf8;border:1px solid #e0ebe5;border-radius:10px;">
      <tr>
        <td style="padding:13px 16px;border-bottom:1px solid #e0ebe5;color:#78877f;font-size:13px;">Treatment</td>
        <td style="padding:13px 16px;border-bottom:1px solid #e0ebe5;color:#263c32;font-size:13px;font-weight:600;">${escapeHtml(treatment)}</td>
      </tr>
      <tr>
        <td style="padding:13px 16px;border-bottom:1px solid #e0ebe5;color:#78877f;font-size:13px;">Preferred Date</td>
        <td style="padding:13px 16px;border-bottom:1px solid #e0ebe5;color:#263c32;font-size:13px;font-weight:600;">${escapeHtml(formattedDate || date)}</td>
      </tr>
      <tr>
        <td style="padding:13px 16px;color:#78877f;font-size:13px;">Mobile Number</td>
        <td style="padding:13px 16px;color:#263c32;font-size:13px;font-weight:600;">${escapeHtml(phone)}</td>
      </tr>
    </table>
    <div style="margin-top:24px;padding:15px 17px;background:#fff7f9;border-left:4px solid #df2759;border-radius:6px;font-size:12.5px;line-height:1.65;color:#66545a;">
      <b style="color:#4d3740;">Please Note:</b><br>
      Submitting an appointment request does not automatically confirm your appointment. Your appointment will be confirmed only after communication from the KRISHNORMI clinic team.
    </div>
    <div style="margin-top:27px;font-size:14px;line-height:1.7;color:#56665e;">
      Thank you for choosing KRISHNORMI.<br>
      We look forward to assisting you.
    </div>
    <div style="margin-top:30px;padding-top:22px;border-top:1px solid #e6ece8;">
      <div style="font-size:14px;font-weight:700;color:#173f30;">KRISHNORMI – Dr. Deepa Bhatt</div>
      <div style="margin-top:7px;font-size:12.5px;line-height:1.65;color:#7a8780;">
        311/312 Akshar Complex<br>
        Shivranjani, Satellite, Ahmedabad
      </div>
    </div>
  </div>
  <div style="background:#f3f7f5;padding:15px 25px;text-align:center;font-size:11px;color:#8a9690;">
    This is an automated confirmation of your appointment request.
  </div>
</div>`;

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
