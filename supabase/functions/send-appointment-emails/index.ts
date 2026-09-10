// Sends the "thank you" email to the person who submitted the Contact Us
// appointment form, and a "new enquiry" notification email to the clinic.
// Invoked from the client (src/pages/ContactUs.jsx) right after the enquiry
// row is inserted into contact_enquiries.
//
// Requires the RESEND_API_KEY secret (https://resend.com). Optional secrets:
//   RESEND_FROM_EMAIL          default: "Krishnormi Dermatology <onboarding@resend.dev>"
//   ADMIN_NOTIFICATION_EMAIL   default: "twisamehta86@gmail.com"
//
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are provided automatically by the
// Edge Functions runtime — used here to read the live Contact Us page copy
// (clinic name, address, phone) so the email footer stays in sync with the CMS.

import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL =
  Deno.env.get("RESEND_FROM_EMAIL") ??
  "Krishnormi Dermatology <onboarding@resend.dev>";
const ADMIN_EMAIL =
  Deno.env.get("ADMIN_NOTIFICATION_EMAIL") ?? "twisamehta86@gmail.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FALLBACK_CLINIC = {
  clinic_name: "Krishnormi Dermatology",
  address:
    "Akshar Complex, Satellite Rd, Shivranjani, Jodhpur Village, Ahmedabad, Gujarat 380015",
  phone: "079 3564 1858",
  email: "info@krishnormi.com",
};

async function getClinicInfo() {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) return FALLBACK_CLINIC;

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await admin
      .from("homepage_sections")
      .select("content")
      .eq("id", "contact")
      .single();

    if (error || !data?.content) return FALLBACK_CLINIC;

    const c = data.content;
    return {
      clinic_name: c.clinic_name || FALLBACK_CLINIC.clinic_name,
      address: c.address || FALLBACK_CLINIC.address,
      phone: c.phone || FALLBACK_CLINIC.phone,
      email: c.email || FALLBACK_CLINIC.email,
    };
  } catch {
    return FALLBACK_CLINIC;
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[ch],
  );
}

function emailShell({ headerLabel, headerColor, heading, bodyHtml, clinic }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(clinic.clinic_name)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f7f9f8;font-family:'Inter',Arial,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f9f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 12px 32px -12px rgba(0,34,97,0.18);">
            <tr>
              <td style="background-color:${headerColor};padding:28px 32px;">
                <p style="margin:0;font-family:'Poppins',Arial,sans-serif;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.75);">
                  ${escapeHtml(headerLabel)}
                </p>
                <p style="margin:6px 0 0;font-family:'Poppins',Arial,sans-serif;font-size:22px;font-weight:700;color:#ffffff;">
                  ${escapeHtml(clinic.clinic_name)}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 20px;font-family:'Poppins',Arial,sans-serif;font-size:20px;font-weight:700;color:#002261;">
                  ${escapeHtml(heading)}
                </p>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px;background-color:#f7f9f8;border-top:1px solid #e4eae7;">
                <p style="margin:0 0 4px;font-family:'Poppins',Arial,sans-serif;font-size:13px;font-weight:600;color:#002261;">
                  ${escapeHtml(clinic.clinic_name)}
                </p>
                <p style="margin:0 0 2px;font-size:12px;line-height:1.6;color:#667085;">${escapeHtml(clinic.address)}</p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#667085;">
                  <a href="tel:${escapeHtml(clinic.phone.replace(/\s+/g, ""))}" style="color:#17773f;text-decoration:none;">${escapeHtml(clinic.phone)}</a>
                  &nbsp;&middot;&nbsp;
                  <a href="mailto:${escapeHtml(clinic.email)}" style="color:#17773f;text-decoration:none;">${escapeHtml(clinic.email)}</a>
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:11px;color:#98a2b3;">This is an automated message from the ${escapeHtml(clinic.clinic_name)} website.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRow(label, value) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #eef1f0;font-size:13px;color:#98a2b3;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eef1f0;font-size:14px;color:#1a1a1a;font-weight:500;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

function buildCustomerEmail(enquiry, clinic) {
  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#344054;">
      Hi ${escapeHtml(enquiry.name)}, thank you for reaching out to ${escapeHtml(clinic.clinic_name)}. We've received your appointment
      request and our team will contact you shortly to confirm your visit.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f9f8;border-radius:10px;padding:4px 18px;margin-bottom:20px;">
      ${detailRow("Treatment", enquiry.treatment)}
      ${detailRow("Preferred date", enquiry.date)}
      ${detailRow("Phone", enquiry.phone)}
      ${detailRow("Message", enquiry.message)}
    </table>
    <a href="tel:${escapeHtml(clinic.phone.replace(/\s+/g, ""))}" style="display:inline-block;background-color:#e02859;color:#ffffff;font-family:'Poppins',Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:8px;">
      Call the clinic
    </a>
    <p style="margin:22px 0 0;font-size:13px;line-height:1.6;color:#667085;">
      Need to reach us sooner? Call or WhatsApp us using the details below.
    </p>`;

  return {
    subject: `We've received your appointment request — ${clinic.clinic_name}`,
    html: emailShell({
      headerLabel: "Appointment request received",
      headerColor: "#17773f",
      heading: "Thank you for reaching out",
      bodyHtml,
      clinic,
    }),
    text: `Hi ${enquiry.name}, thank you for reaching out to ${clinic.clinic_name}. We've received your appointment request${
      enquiry.treatment ? ` for ${enquiry.treatment}` : ""
    }${enquiry.date ? ` on ${enquiry.date}` : ""} and will contact you shortly to confirm. Call us at ${clinic.phone}.`,
  };
}

function buildAdminEmail(enquiry, clinic) {
  const submittedAt = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#344054;">
      A new appointment enquiry was submitted on the website.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
      ${detailRow("Name", enquiry.name)}
      ${detailRow("Email", enquiry.email)}
      ${detailRow("Phone", enquiry.phone)}
      ${detailRow("Treatment", enquiry.treatment)}
      ${detailRow("Preferred date", enquiry.date)}
      ${detailRow("Message", enquiry.message)}
      ${detailRow("Submitted", `${submittedAt} IST`)}
    </table>
    <a href="mailto:${escapeHtml(enquiry.email)}" style="display:inline-block;background-color:#17773f;color:#ffffff;font-family:'Poppins',Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:8px;margin-right:10px;">
      Reply by email
    </a>
    <a href="tel:${escapeHtml(enquiry.phone.replace(/\s+/g, ""))}" style="display:inline-block;background-color:#ffffff;color:#17773f;border:1.5px solid #17773f;font-family:'Poppins',Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;padding:11px 20px;border-radius:8px;">
      Call ${escapeHtml(enquiry.name)}
    </a>
    <p style="margin:22px 0 0;font-size:12px;line-height:1.6;color:#98a2b3;">
      View all enquiries in the admin panel under Appointments.
    </p>`;

  return {
    subject: `New appointment enquiry from ${enquiry.name}`,
    html: emailShell({
      headerLabel: "New website enquiry",
      headerColor: "#002261",
      heading: "New appointment enquiry",
      bodyHtml,
      clinic,
    }),
    text: `New appointment enquiry from ${enquiry.name} (${enquiry.email}, ${enquiry.phone}). Treatment: ${
      enquiry.treatment || "—"
    }. Preferred date: ${enquiry.date || "—"}. Message: ${enquiry.message || "—"}. Submitted ${submittedAt} IST.`,
  };
}

async function sendEmail({ to, subject, html, text, replyTo }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload?.message || `Resend request failed (${res.status})`);
  }
  return payload;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "RESEND_API_KEY is not configured for this function. Set it with `supabase secrets set RESEND_API_KEY=...`.",
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  let enquiry;
  try {
    enquiry = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!enquiry?.name || !enquiry?.email || !enquiry?.phone) {
    return new Response(
      JSON.stringify({ error: "name, email and phone are required" }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  const clinic = await getClinicInfo();
  const result = { customerEmailSent: false, adminEmailSent: false, errors: [] };

  const customerEmail = buildCustomerEmail(enquiry, clinic);
  try {
    await sendEmail({
      to: enquiry.email,
      subject: customerEmail.subject,
      html: customerEmail.html,
      text: customerEmail.text,
      replyTo: clinic.email,
    });
    result.customerEmailSent = true;
  } catch (err) {
    result.errors.push(`customer email: ${err.message}`);
  }

  const adminEmail = buildAdminEmail(enquiry, clinic);
  try {
    await sendEmail({
      to: ADMIN_EMAIL,
      subject: adminEmail.subject,
      html: adminEmail.html,
      text: adminEmail.text,
      replyTo: enquiry.email,
    });
    result.adminEmailSent = true;
  } catch (err) {
    result.errors.push(`admin email: ${err.message}`);
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
