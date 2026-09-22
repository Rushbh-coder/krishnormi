import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import ContactReveal from "./ContactReveal";

const TREATMENT_OPTIONS = [
  "Clinical Dermatology",
  "Hair & Scalp Care",
  "Laser Dermatology",
  "Aesthetic Dermatology",
  "Other",
];

const inputClasses =
  "contact-input h-14 rounded-[6px] border border-[#c7c7c7] px-3.5 font-heading text-[15px] text-text-dark placeholder:text-[#98a2b3] focus:outline-2 focus:-outline-offset-1 focus:outline-primary";

const labelClasses = "font-heading text-[15px] font-medium text-[#444]";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const errorClasses =
  "mt-1 font-heading text-[12px] leading-[1.4] text-[#df2759]";

export default function ContactFormSection({ content }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    treatment: "",
    date: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const [formErrors, setFormErrors] = useState({});

  const [confirmationEmailStatus, setConfirmationEmailStatus] =
    useState("idle");

  const [isVerified, setIsVerified] = useState(false);

  const [verificationLoading, setVerificationLoading] = useState(false);

  const [showLocationCard, setShowLocationCard] = useState(false);

  useEffect(() => {
    if (status !== "success") return undefined;

    const resetTimer = window.setTimeout(() => {
      setStatus("idle");
      setForm({
        name: "",
        email: "",
        phone: "",
        treatment: "",
        date: "",
        message: "",
      });
      setFormErrors({});
      setErrorMessage("");
      setConfirmationEmailStatus("idle");
      setIsVerified(false);
      setVerificationLoading(false);
    }, 5000);

    return () => window.clearTimeout(resetTimer);
  }, [status]);

  const today = new Date();

  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date();

  maxDateObj.setMonth(maxDateObj.getMonth() + 3);

  const maxDate = maxDateObj.toISOString().split("T")[0];

  const set = (key) => (event) => {
    const value = event.target.value;

    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setFormErrors((current) => ({
      ...current,
      [key]: "",
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const setPhone = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setForm((current) => ({
      ...current,
      phone: value,
    }));

    setFormErrors((current) => ({
      ...current,
      phone: "",
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    const errors = {};

    const name = form.name.trim();

    const email = form.email.trim();

    const phone = form.phone.trim();

    if (!name) {
      errors.name = "Please enter your full name.";
    } else if (name.length < 2) {
      errors.name = "Please enter a valid full name.";
    }

    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email =
        "Please enter a valid email address, for example name@example.com.";
    }

    if (!phone) {
      errors.phone = "Please enter your mobile number.";
    } else if (!PHONE_REGEX.test(phone)) {
      errors.phone = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (!form.treatment) {
      errors.treatment = "Please select a treatment.";
    }

    if (!form.date) {
      errors.date = "Please select your preferred appointment date.";
    } else if (form.date < minDate || form.date > maxDate) {
      errors.date =
        "Please select a date within the available appointment range.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");

    /*
     * =====================================================
     * VALIDATE FORM
     * =====================================================
     */

    if (!validateForm()) {
      setStatus("idle");
      return;
    }

    /*
     * =====================================================
     * CHECK SECURITY VERIFICATION
     * =====================================================
     */

    if (!isVerified) {
      setStatus("idle");

      setErrorMessage("Please complete verification before submitting.");

      return;
    }

    /*
     * =====================================================
     * START SUBMISSION
     * =====================================================
     */

    setStatus("submitting");

    setConfirmationEmailStatus("idle");

    /*
     * =====================================================
     * CLEAN FORM VALUES
     * =====================================================
     */

    const cleanForm = {
      name: form.name.trim(),

      email: form.email.trim().toLowerCase(),

      phone: form.phone.trim(),

      treatment: form.treatment,

      date: form.date,

      message: form.message.trim(),
    };

    /*
     * =====================================================
     * SAVE APPOINTMENT TO SUPABASE DATABASE
     * =====================================================
     */

    const { error } = await supabase.from("contact_enquiries").insert({
      name: cleanForm.name,

      email: cleanForm.email,

      phone: cleanForm.phone,

      treatment: cleanForm.treatment,

      appointment_date: cleanForm.date,

      message: cleanForm.message,
    });

    /*
     * =====================================================
     * DATABASE FAILURE
     * =====================================================
     */

    if (error) {
      console.error("Appointment submission failed:", error);

      setStatus("error");

      setErrorMessage(
        "We could not submit your appointment request. Please try again.",
      );

      return;
    }

    /*
     * =====================================================
     * SEND EMAILS
     * =====================================================
     */

    setConfirmationEmailStatus("sending");

    try {
      const emailResponse = await fetch(
        "https://lnetznzqwwrvvugycdae.supabase.co/functions/v1/send-appointment-emails",
        {
          method: "POST",
          body: JSON.stringify(cleanForm),
        },
      );

      const emailData = await emailResponse.json().catch(() => null);

      if (!emailResponse.ok || !emailData?.customerEmailSent) {
        console.error(
          "Customer confirmation email failed:",
          emailData || `HTTP ${emailResponse.status}`,
        );

        setConfirmationEmailStatus("failed");
      } else {
        setConfirmationEmailStatus("sent");
      }
    } catch (emailException) {
      console.error("Customer confirmation email exception:", emailException);

      setConfirmationEmailStatus("failed");
    }

    /*
     * =====================================================
     * SHOW THANK-YOU SCREEN
     * =====================================================
     */

    setStatus("success");

    /*
     * Reset verification.
     */

    setIsVerified(false);

    setVerificationLoading(false);
  };

  const contactDetails = [
    {
      Icon: FaMapMarkerAlt,
      label: "Address",
      value: content?.address,
    },
    {
      Icon: FaEnvelope,
      label: "Email",
      value: content?.email,
      href: `mailto:${content.email}`,
    },
    {
      Icon: FaPhoneAlt,
      label: "Call",
      value: content?.phone,
      href: `tel:${content.phone.replace(/\s+/g, "")}`,
    },
  ];

  return (
    <section className="relative z-10 -mt-[120px] bg-transparent pb-[90px] max-[960px]:-mt-16 max-[700px]:pb-14">
      <div className="container max-[560px]:px-2">
        <ContactReveal
          className="
                grid
                grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]
                items-start
                gap-[50px]

                bg-white
                p-[40px]
                shadow-[0_12px_40px_rgba(0,0,0,0.08)]

                max-[1100px]:gap-8
                max-[900px]:grid-cols-1
                max-[700px]:p-6
                max-[560px]:p-5
              "
        >
          {/* =================================================
                  LEFT — GET IN TOUCH
              ================================================== */}

          <div className="min-w-0">
            <ContactReveal variant="left" delay={-20}>
              <h2 className="section-title text-navy">Get in Touch</h2>
            </ContactReveal>

            <ContactReveal delay={120}>
              <hr className="section-divider contact-accent-line mb-6" />
            </ContactReveal>

            <ContactReveal delay={180}>
              <p className="mb-7 font-heading text-sm leading-[1.7] text-text">
                {content.connect_text}
              </p>
            </ContactReveal>

            {/* Contact Details */}

            <div className="flex flex-col gap-6">
              {contactDetails.map(({ Icon, label, value, href }, i) => (
                <ContactReveal
                  key={label}
                  delay={280 + i * 90}
                  className="contact-interactive flex items-center gap-4"
                >
                  <span className="contact-detail-icon flex h-[40px] w-[40px] flex-none items-center justify-center rounded-full bg-[#3a9090] text-white">
                    <Icon size={22} aria-hidden="true" />
                  </span>

                  {href ? (
                    <a
                      href={href}
                      className="w-full font-heading text-lg leading-[1.2] font-medium text-text-dark hover:text-accent"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="m-0 font-heading text-[15px] leading-[1.2] font-medium text-text-dark">
                      {value}
                    </p>
                  )}
                </ContactReveal>
              ))}
            </div>

            {/* WhatsApp Helpline */}
            <a
              href="https://wa.me/918866589956?text=Hello%20Dr.%20Deepa%20Bhatt%2C%20I%20am%20reaching%20out%20to%20book%20a%20consultation%20appointment.%20Please%20share%20your%20upcoming%20availability%20so%20we%20can%20connect."
              target="_blank"
              rel="noreferrer"
              aria-label="Contact us on WhatsApp"
              className="flex flex-none items-center justify-center text-[#25d366] "
            >
              <ContactReveal
                delay={550}
                className="contact-interactive mt-7 flex items-center gap-4 rounded-[6px] bg-[#e8f5f5] p-[18px_22px] cursor-pointer"
              >
                {/* <a
                    href={
                      whatsappDigits
                        ? `https://wa.me/${whatsappDigits}`
                        : `tel:${content.phone.replace(/\s+/g, "")}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Contact us on WhatsApp"
                    className="flex flex-none items-center justify-center text-[#25d366]"
                  > */}
                <FaWhatsapp size={46} aria-hidden="true" />
                {/* </a> */}

                <span
                  className="h-[50px] w-px flex-none bg-[#137979]/25"
                  aria-hidden="true"
                />

                <div className="min-w-0 flex-1">
                  <p className="m-0 mb-1 font-heading text-lg font-semibold text-[#137979]">
                    WhatsApp Helpline
                  </p>

                  <p className="m-0 font-heading text-[15px] text-[#444]">
                    Quick Appointment Booking via Whatsapp
                  </p>

                  <p className="m-0 font-heading text-[15px] text-green-600 font-semibold">
                    Message Us
                  </p>
                </div>
              </ContactReveal>
            </a>
          </div>

          {/* =================================================
                  RIGHT — REQUEST AN APPOINTMENT
              ================================================== */}

          {status !== "success" ? (
            <form onSubmit={handleSubmit} className="w-full min-w-0" noValidate>
              <ContactReveal variant="right" delay={140}>
                <p className="mb-1.5 font-heading text-[27px] font-bold text-navy">
                  {content.form_title}
                </p>
              </ContactReveal>

              <ContactReveal delay={220}>
                <p className="mb-6 font-heading text-xs text-accent italic-[0.95]">
                  {content.form_subtitle}
                </p>
              </ContactReveal>

              {/* Full Name */}

              <ContactReveal delay={300} className="mb-4 flex flex-col gap-1.5">
                <label className={labelClasses} htmlFor="contact-name">
                  Full Name <span className="text-red-500">*</span>
                </label>

                <input
                  id="contact-name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={80}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={
                    formErrors.name ? "contact-name-error" : undefined
                  }
                  className={`${inputClasses} ${
                    formErrors.name
                      ? "border-[#df2759] focus:outline-[#df2759]"
                      : ""
                  }`}
                />

                {formErrors.name && (
                  <p
                    id="contact-name-error"
                    className={errorClasses}
                    role="alert"
                  >
                    {formErrors.name}
                  </p>
                )}
              </ContactReveal>

              {/* Email + Mobile */}

              <ContactReveal
                delay={380}
                className="mb-4 grid grid-cols-2 gap-4 max-[500px]:grid-cols-1"
              >
                <div className="flex flex-col gap-1.5">
                  <label className={labelClasses} htmlFor="contact-email">
                    Email <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="contact-email"
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="email"
                    maxLength={120}
                    value={form.email}
                    onChange={set("email")}
                    placeholder="name@example.com"
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={
                      formErrors.email ? "contact-email-error" : undefined
                    }
                    className={`${inputClasses} ${
                      formErrors.email
                        ? "border-[#df2759] focus:outline-[#df2759]"
                        : ""
                    }`}
                  />

                  {formErrors.email && (
                    <p
                      id="contact-email-error"
                      className={errorClasses}
                      role="alert"
                    >
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClasses} htmlFor="contact-phone">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    autoComplete="tel"
                    pattern="[6-9][0-9]{9}"
                    minLength={10}
                    maxLength={10}
                    value={form.phone}
                    onChange={setPhone}
                    placeholder="10-digit mobile number"
                    aria-invalid={Boolean(formErrors.phone)}
                    aria-describedby={
                      formErrors.phone ? "contact-phone-error" : undefined
                    }
                    className={`${inputClasses} ${
                      formErrors.phone
                        ? "border-[#df2759] focus:outline-[#df2759]"
                        : ""
                    }`}
                  />

                  <p className="mt-1 font-heading text-[11px] leading-[1.4] text-[#7b8d84]">
                    Enter a 10-digit Indian mobile number without +91.
                  </p>

                  {formErrors.phone && (
                    <p
                      id="contact-phone-error"
                      className={errorClasses}
                      role="alert"
                    >
                      {formErrors.phone}
                    </p>
                  )}
                </div>
              </ContactReveal>

              {/* Treatment + Date */}

              <ContactReveal
                delay={460}
                className="mb-4 grid grid-cols-2 gap-4 max-[500px]:grid-cols-1"
              >
                <div className="flex flex-col gap-1.5">
                  <label className={labelClasses} htmlFor="contact-treatment">
                    Select Treatment <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <select
                      id="contact-treatment"
                      required
                      value={form.treatment}
                      onChange={set("treatment")}
                      aria-invalid={Boolean(formErrors.treatment)}
                      aria-describedby={
                        formErrors.treatment
                          ? "contact-treatment-error"
                          : undefined
                      }
                      className={`${inputClasses} w-full appearance-none bg-white pr-10 ${
                        formErrors.treatment
                          ? "border-[#df2759] focus:outline-[#df2759]"
                          : ""
                      }`}
                    >
                      <option value="" disabled>
                        Select a treatment
                      </option>

                      {TREATMENT_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#A9A9A9]"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {formErrors.treatment && (
                    <p
                      id="contact-treatment-error"
                      className={errorClasses}
                      role="alert"
                    >
                      {formErrors.treatment}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClasses} htmlFor="contact-date">
                    Preferred Appointment Date{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-date"
                    type="date"
                    required
                    value={form.date}
                    min={minDate}
                    max={maxDate}
                    onChange={set("date")}
                    aria-invalid={Boolean(formErrors.date)}
                    aria-describedby={
                      formErrors.date ? "contact-date-error" : undefined
                    }
                    className={`${inputClasses} ${
                      formErrors.date
                        ? "border-[#df2759] focus:outline-[#df2759]"
                        : ""
                    }`}
                  />

                  {formErrors.date && (
                    <p
                      id="contact-date-error"
                      className={errorClasses}
                      role="alert"
                    >
                      {formErrors.date}
                    </p>
                  )}
                </div>
              </ContactReveal>

              {/* Message */}

              <ContactReveal delay={540} className="mb-5 flex flex-col gap-1.5">
                <label className={labelClasses} htmlFor="contact-message">
                  Message
                </label>

                <textarea
                  id="contact-message"
                  rows={3}
                  maxLength={1000}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Briefly describe how we can help"
                  className="contact-input resize-none rounded-[6px] border border-[#c7c7c7] px-3.5 py-3 font-heading text-[15px] text-text-dark placeholder:text-[#98a2b3] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
                />

                <p className="mt-1 text-right font-heading text-[11px] text-[#98a2b3]">
                  {form.message.length}
                  /1000
                </p>
              </ContactReveal>

              {/* Verification */}

              <div className="mb-5 rounded-[6px] border border-[#d0d5dd] bg-[#f9fafb] p-4">
                <div className="flex items-center gap-3">
                  <input
                    id="verification-check"
                    type="checkbox"
                    checked={isVerified}
                    disabled={verificationLoading}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setVerificationLoading(true);

                        setErrorMessage("");

                        setTimeout(() => {
                          setVerificationLoading(false);

                          setIsVerified(true);
                        }, 1500);
                      } else {
                        setIsVerified(false);
                      }
                    }}
                    className="h-5 w-5 cursor-pointer accent-[#25D366]"
                  />

                  <label
                    htmlFor="verification-check"
                    className="font-heading text-sm text-[#344054]"
                  >
                    {verificationLoading ? "Verifying..." : "I am not a robot"}
                  </label>
                </div>

                {verificationLoading && (
                  <p className="mt-2 text-xs text-[#667085]">
                    Security verification in progress. Please wait...
                  </p>
                )}

                {isVerified && !verificationLoading && (
                  <p className="mt-2 text-xs font-semibold text-green-600">
                    ✓ Verification completed
                  </p>
                )}
              </div>

              {/* Global error */}

              {errorMessage && (
                <div
                  className="mb-4 rounded-[8px] border border-[#f1c7d1] bg-[#fff7f9] px-4 py-3"
                  role="alert"
                >
                  <p className="m-0 font-heading text-[13px] leading-[1.5] text-[#b4234d]">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Submit */}

              <ContactReveal delay={620}>
                <button
                  type="submit"
                  disabled={status === "submitting" || verificationLoading}
                  className="contact-submit btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Submitting…" : "Submit Request"}
                </button>
              </ContactReveal>
            </form>
          ) : (
            <div
              className="flex min-h-[360px] w-full min-w-0 flex-col items-center justify-center rounded-[18px] border border-[#cfe4d6] bg-[#f0f8f3] px-7 py-12 text-center shadow-[0_18px_50px_rgba(23,119,63,0.12)] max-[560px]:px-5"
              role="status"
              aria-live="polite"
            >
              <div className="flex h-[66px] w-[66px] items-center justify-center rounded-full bg-[#17773f] text-white shadow-[0_10px_26px_rgba(23,119,63,0.25)]">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5 9.2 17 19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="mt-5 mb-1 font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-[#17773f]">
                Request Submitted
              </p>
              <h3 className="m-0 font-heading text-[27px] leading-[1.25] font-bold text-[#173f30] max-[560px]:text-[23px]">
                Thank You!
              </h3>
              <p className="mx-auto mt-3 mb-0 max-w-[470px] font-heading text-[14px] leading-[1.7] text-[#52645b]">
                We have received your appointment request successfully. Our
                clinic team will contact you to confirm the appointment.
              </p>
            </div>
          )}
        </ContactReveal>
      </div>
    </section>
  );
}
