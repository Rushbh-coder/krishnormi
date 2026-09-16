import { useEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

import Header from "../sections/Header";
import Footer from "../sections/Footer";
import FAQ from "../sections/FAQ";
import Testimonials from "../sections/Testimonials";

import bannerBg from "../assets/contact/banner-bg.png";
import iconLocation from "../assets/footer/icon-location.svg";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import { supabase } from "../lib/supabaseClient";

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

/*
 * Scroll reveals run once. Content remains visible when IntersectionObserver
 * is unavailable or the visitor prefers reduced motion.
 */
function ContactReveal({
  children,
  className = "",
  variant = "up",
  delay = 700,
}) {
  const elementRef = useRef(null);

  const [revealed, setRevealed] = useState(
    () =>
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (revealed) return;

    const element = elementRef.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const show = () => setRevealed(true);

    if (media.matches || !("IntersectionObserver" in window)) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -32px 0px",
      },
    );

    const onMotionChange = (event) => {
      if (event.matches) show();
    };

    observer.observe(element);
    media.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", onMotionChange);
    };
  }, [revealed]);

  return (
    <div
      ref={elementRef}
      className={`contact-reveal ${revealed ? "is-visible" : ""} ${className}`}
      data-reveal={variant}
      style={{
        "--contact-delay": `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const CONTACT_ANIMATION_CSS = `
  .contact-page .contact-reveal {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
    transition: opacity 700ms ease,
      transform 700ms cubic-bezier(.22,1,.36,1);
    transition-delay: var(--contact-delay, 0ms);
  }

  .contact-page .contact-reveal[data-reveal="left"] {
    transform: translate3d(-24px, 0, 0);
  }

  .contact-page .contact-reveal[data-reveal="right"] {
    transform: translate3d(24px, 0, 0);
  }

  .contact-page .contact-reveal[data-reveal="fade"] {
    transform: none;
  }

  .contact-page .contact-reveal.is-visible {
    opacity: 1;
    transform: none;
  }

  .contact-page .contact-accent-line {
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 650ms cubic-bezier(.22,1,.36,1);
  }

  .contact-page .contact-reveal.is-visible
  .contact-accent-line {
    transform: scaleX(1);
  }

  @keyframes contactBannerIn {
    from {
      opacity: .8;
      transform: scale(1.04);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes contactBannerZoom {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.08);
    }
  }

  .contact-page .contact-banner-image {
    animation:
      contactBannerIn 1100ms ease-out both,
      contactBannerZoom 14s ease-in-out 1100ms infinite alternate;
  }

  .contact-page .contact-interactive {
    transition:
      transform 250ms ease,
      box-shadow 250ms ease;
  }

  .contact-page .contact-detail-icon {
    transition: transform 250ms ease;
  }

  .contact-page .contact-input {
    transition:
      border-color 200ms ease,
      box-shadow 200ms ease;
  }

  .contact-page .contact-input:focus {
    box-shadow:
      0 0 0 3px rgba(23,119,63,.10);
  }

  @media (hover: hover) and (pointer: fine) {
    .contact-page .contact-interactive:hover {
      transform: translateY(-3px);
    }

    .contact-page
    .contact-interactive:hover
    .contact-detail-icon {
      transform: scale(1.06);
    }

    .contact-page
    .contact-submit:hover:not(:disabled) {
      transform: translateY(-2px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .contact-page .contact-reveal,
    .contact-page .contact-reveal[data-reveal],
    .contact-page .contact-accent-line,
    .contact-page .contact-banner-image,
    .contact-page .contact-interactive,
    .contact-page .contact-detail-icon,
    .contact-page .contact-input,
    .contact-page .contact-submit {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }

    .contact-page .contact-reveal {
      opacity: 1 !important;
    }
  }
`;

export default function ContactUs() {
  const { row } = useSection("contact");

  const previewMode =
    new URLSearchParams(window.location.search).get("preview") === "true";

  let previewData = null;

  if (previewMode) {
    try {
      previewData = JSON.parse(
        sessionStorage.getItem("contact_preview") || "null",
      );
    } catch {
      previewData = null;
    }
  }

  const content = previewData?.content
    ? previewData.content
    : (row?.content ?? DEFAULT_CONTENT.contact);

  const { row: footerRow } = useSection("footer");

  const footerContent = footerRow?.content ?? DEFAULT_CONTENT.footer;

  const whatsappDigits = (footerContent.whatsapp_number || "").replace(
    /\D/g,
    "",
  );

  const mapQuery =
    content.latitude && content.longitude
      ? `${content.latitude},${content.longitude}`
      : content.address;

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
      value: content.address,
    },
    {
      Icon: FaEnvelope,
      label: "Email",
      value: content.email,
      href: `mailto:${content.email}`,
    },
    {
      Icon: FaPhoneAlt,
      label: "Call",
      value: content.phone,
      href: `tel:${content.phone.replace(/\s+/g, "")}`,
    },
  ];

  return (
    <>
      <Header />

      <main className="contact-page">
        <style>{CONTACT_ANIMATION_CSS}</style>

        {/* =====================================================
            BANNER
        ====================================================== */}

        <section className="relative min-h-[560px] overflow-hidden bg-white max-[960px]:flex max-[960px]:min-h-0 max-[960px]:flex-col">
          <div
            className="absolute inset-0 z-0 max-[960px]:relative max-[960px]:order-2 max-[960px]:h-[300px] max-[560px]:h-[240px]"
            aria-hidden="true"
          >
            <img
              src={bannerBg}
              alt=""
              className="contact-banner-image absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>

          <div className="container relative z-[1] flex min-h-[560px] items-center max-[960px]:order-1 max-[960px]:min-h-0 max-[960px]:py-14">
            <div className="mt-[-10%] max-w-[600px] max-[960px]:mt-0 max-[960px]:max-w-full">
              <ContactReveal variant="left">
                <h3 className="mt-[-20%] font-heading text-[55px] leading-[1.2] font-bold max-[960px]:mt-0 max-[700px]:text-[38px] max-[420px]:text-[30px]">
                  <span className="font-heading text-[55px] not-italic font-bold leading-[77px] text-primary">
                    Contact
                  </span>{" "}
                  <span className="text-text-dark">Us</span>
                </h3>
              </ContactReveal>

              <ContactReveal delay={100}>
                <hr className="section-divider contact-accent-line w-45" />
              </ContactReveal>

              <ContactReveal delay={180}>
                <p className="mt-6 font-heading text-2xl font-semibold text-text-dark max-[420px]:text-xl">
                  {content.banner_heading}
                </p>
              </ContactReveal>

              <ContactReveal delay={280}>
                <p className="mt-4 max-w-[420px] font-heading text-sm leading-[1.6] text-text">
                  {content.banner_text}
                </p>
              </ContactReveal>
            </div>
          </div>
        </section>

        {/* =====================================================
            GET IN TOUCH + APPOINTMENT
            Single white panel overlapping the banner
        ====================================================== */}

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
                      <span className="contact-detail-icon flex h-[50px] w-[50px] flex-none items-center justify-center rounded-full bg-[#3a9090] text-white">
                        <Icon size={26} aria-hidden="true" />
                      </span>

                      {href ? (
                        <a
                          href={href}
                          className="w-full font-heading text-lg leading-[1.4] font-medium text-text-dark hover:text-accent"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="m-0 font-heading text-lg leading-[1.4] font-medium text-text-dark">
                          {value}
                        </p>
                      )}
                    </ContactReveal>
                  ))}
                </div>

                {/* WhatsApp Helpline */}

                <ContactReveal
                  delay={550}
                  className="contact-interactive mt-7 flex items-center gap-4 rounded-[6px] bg-[#e8f5f5] p-[18px_22px]"
                >
                  <a
                    href={
                      whatsappDigits
                        ? `https://wa.me/${whatsappDigits}`
                        : `tel:${content.phone.replace(/\s+/g, "")}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Contact us on WhatsApp"
                    className="flex flex-none items-center justify-center text-[#25d366]"
                  >
                    <FaWhatsapp size={46} aria-hidden="true" />
                  </a>

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
              </div>

              {/* =================================================
                  RIGHT — REQUEST AN APPOINTMENT
              ================================================== */}

              {status !== "success" ? (
                <form
                  onSubmit={handleSubmit}
                  className="w-full min-w-0"
                  noValidate
                >
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

                  <ContactReveal
                    delay={300}
                    className="mb-4 flex flex-col gap-1.5"
                  >
                    <label className={labelClasses} htmlFor="contact-name">
                      Full Name *
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
                        Email *
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
                        Mobile Number *
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
                      <label
                        className={labelClasses}
                        htmlFor="contact-treatment"
                      >
                        Select Treatment *
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
                        Preferred Appointment Date *
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

                  <ContactReveal
                    delay={540}
                    className="mb-5 flex flex-col gap-1.5"
                  >
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
                        {verificationLoading
                          ? "Verifying..."
                          : "I am not a robot"}
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
                      {status === "submitting"
                        ? "Submitting…"
                        : "Submit Request"}
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
                    We have received your appointment request successfully.
                    Our clinic team will contact you to confirm the appointment.
                  </p>
                </div>
              )}
            </ContactReveal>
          </div>
        </section>

        {/* =====================================================
            MAP
        ====================================================== */}

        <section className="w-full bg-[#f9fcfb] pb-[90px] max-[700px]:pb-14">
          <ContactReveal className="relative h-[520px] w-full overflow-hidden border border-[#c6c6c6] max-[900px]:h-[400px] max-[560px]:h-[300px]">
            <iframe
              title="Krishnormi clinic location"
              className="absolute inset-0 h-full w-full border-0"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                mapQuery,
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Location Toggle */}

            <button
              type="button"
              onClick={() => setShowLocationCard(true)}
              aria-expanded={showLocationCard}
              aria-label="Show clinic location details"
              className={`contact-interactive absolute top-6 left-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent p-0 shadow-[0_4px_10px_rgba(13,38,33,0.25)] transition-opacity duration-200 ${
                showLocationCard ? "opacity-0" : "opacity-100"
              }`}
            >
              <img
                src={iconLocation}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 brightness-0 invert"
              />
            </button>

            {/* Location Details Card */}

            <div
              className={`absolute top-6 left-6 w-[280px] max-w-[80%] origin-top-left rounded-[15px] border border-[#d6e3dd] bg-white p-[18px_22px] shadow-[0_10px_24px_-6px_rgba(13,38,33,0.13)] transition-[opacity,transform] duration-300 ease-out ${
                showLocationCard
                  ? "translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none translate-y-1 scale-[0.98] opacity-0"
              }`}
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <p className="font-heading text-xs font-semibold text-accent">
                  {content.map_label_name}
                </p>

                <button
                  type="button"
                  onClick={() => setShowLocationCard(false)}
                  aria-label="Close"
                  className="-mt-1 -mr-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-transparent p-0 text-[#98a2b3] hover:text-text-dark"
                >
                  &times;
                </button>
              </div>

              <p className="mb-1 font-heading text-base font-semibold text-text-dark">
                {content.map_label_line1}
              </p>

              <p className="mb-3 font-heading text-[13px] text-[#60736e]">
                {content.map_label_line2}
              </p>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  mapQuery,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-heading text-[13px] font-semibold text-primary hover:text-primary-dark"
              >
                Get Directions
                <span aria-hidden="true">&rarr;</span>
              </a>

            </div>
          </ContactReveal>
        </section>

        <ContactReveal variant="fade">
          <FAQ />
        </ContactReveal>

        <ContactReveal variant="fade">
          <Testimonials />
        </ContactReveal>
      </main>

      <Footer />
    </>
  );
}
