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
import { HiH2 } from "react-icons/hi2";

const TREATMENT_OPTIONS = {
  "Clinical Dermatology": [
    "Acne Treatment",
    "Pigmentation Treatment",
    "Skin Allergy",
    "Skin Infection",
    "Mole & Wart Removal",
  ],
  "Hair & Scalp Care": [
    "Hair Fall Treatment",
    "PRP Therapy",
    "GFC Therapy",
    "Mesotherapy",
    "Dandruff & Scalp Treatment",
    "Hair Transplant Consultation",
  ],
  "Laser Dermatology": [
    "Laser Hair Removal",
    "Laser Skin Resurfacing",
    "Pigmentation Laser",
    "Scar Reduction Laser",
  ],
  "Aesthetic Dermatology": [
    "Botox Treatment",
    "Dermal Fillers",
    "Anti Aging Treatment",
    "Skin Rejuvenation",
  ],
  Other: ["General Consultation"],
};

const inputClasses =
  "contact-input h-14 rounded-[6px] border border-[#c7c7c7] px-3.5 font-heading text-[15px] text-text-dark placeholder:text-[#98a2b3] focus:outline-2 focus:-outline-offset-1 focus:outline-primary";

const labelClasses = "font-heading text-[15px] font-medium text-[#444]";


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
      { threshold: 0, rootMargin: "0px 0px -32px 0px" },
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
      style={{ "--contact-delay": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const CONTACT_ANIMATION_CSS = `
  .contact-page .contact-reveal {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
    transition: opacity 700ms ease, transform 700ms cubic-bezier(.22,1,.36,1);
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
  .contact-page .contact-reveal.is-visible .contact-accent-line {
    transform: scaleX(1);
  }
  @keyframes contactBannerIn {
    from { opacity: .8; transform: scale(1.04); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes contactBannerZoom {
    from { transform: scale(1); }
    to { transform: scale(1.08); }
  }
  .contact-page .contact-banner-image {
    animation:
      contactBannerIn 1100ms ease-out both,
      contactBannerZoom 14s ease-in-out 1100ms infinite alternate;
  }
  .contact-page .contact-interactive {
    transition: transform 250ms ease, box-shadow 250ms ease;
  }
  .contact-page .contact-detail-icon {
    transition: transform 250ms ease;
  }
  .contact-page .contact-input {
    transition: border-color 200ms ease, box-shadow 200ms ease;
  }
  .contact-page .contact-input:focus {
    box-shadow: 0 0 0 3px rgba(23,119,63,.10);
  }
  @media (hover: hover) and (pointer: fine) {
    .contact-page .contact-interactive:hover {
      transform: translateY(-3px);
    }
    .contact-page .contact-interactive:hover .contact-detail-icon {
      transform: scale(1.06);
    }
    .contact-page .contact-submit:hover:not(:disabled) {
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
  const content = row?.content ?? DEFAULT_CONTENT.contact;

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
  const [selectedTreatmentCategory, setSelectedTreatmentCategory] = useState("");
  const [showLocationCard, setShowLocationCard] = useState(false);
  const [showHaritJewellers, setShowHaritJewellers] = useState(false);

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  const maxDateObj = new Date();
  maxDateObj.setMonth(maxDateObj.getMonth() + 3);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const activeMapQuery = showHaritJewellers
    ? "Harit Jewellers, Ahmedabad, Gujarat"
    : mapQuery;

  const set = (key) => (event) =>
    setForm((f) => ({
      ...f,
      [key]: event.target.value,
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const message = [
      form.treatment && `Treatment: ${form.treatment}`,
      form.date && `Preferred appointment date: ${form.date}`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    const { error } = await supabase.from("contact_enquiries").insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    // The enquiry is already saved at this point, so a confirmation-email
    // hiccup shouldn't block the success state the visitor sees.
    supabase.functions
      .invoke("send-appointment-emails", {
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          treatment: form.treatment,
          date: form.date,
          message: form.message,
        },
      })
      .catch((emailError) => {
        console.error("send-appointment-emails failed:", emailError);
      });

    setStatus("success");
    setForm({
      name: "",
      email: "",
      phone: "",
      treatment: "",
      date: "",
      message: "",
    });
    setSelectedTreatmentCategory("");
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
                {/* {content.appointment_note && (
                  <p className="mb-6 inline-block rounded-[10px] bg-[#fff7f9] px-4 py-2.5 font-heading text-[13px] font-semibold text-accent">
                    {content.appointment_note}
                  </p>
                )} */}

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

                  {/* Vertical divider */}
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
                  No separate card background/border/shadow
              ================================================== */}
              <form onSubmit={handleSubmit} className="w-full min-w-0">
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
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Enter your name"
                    className={inputClasses}
                  />
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
                      value={form.email}
                      onChange={set("email")}
                      placeholder="Enter your email"
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className={labelClasses} htmlFor="contact-phone">
                      Mobile Number *
                    </label>

                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="Enter your phone number"
                      className={inputClasses}
                    />
                  </div>
                </ContactReveal>

                {/* Treatment + Date */}
                <ContactReveal
                  delay={460}
                  className="mb-4 grid grid-cols-2 gap-4 max-[500px]:grid-cols-1"
                >
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClasses} htmlFor="contact-treatment">
                      Select Treatment *
                    </label>

                    <div className="relative">
                      <select
                        id="contact-treatment"
                        required
                        value={selectedTreatmentCategory}
                        onChange={(e) => {
                          setSelectedTreatmentCategory(e.target.value);
                          setForm((f) => ({ ...f, treatment: "" }));
                        }}
                        className={`${inputClasses} w-full appearance-none bg-white pr-10`}
                      >
                        <option value="" disabled>
                          Select a treatment
                        </option>

                        {Object.keys(TREATMENT_OPTIONS).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>

                      {/* Right-side dropdown arrow */}
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

                    {selectedTreatmentCategory && (
                      <select
                        required
                        value={form.treatment}
                        onChange={set("treatment")}
                        className={`${inputClasses} mt-3 w-full appearance-none bg-white`}
                      >
                        <option value="" disabled>Select specific treatment</option>
                        {TREATMENT_OPTIONS[selectedTreatmentCategory].map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
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
                      className={inputClasses}
                    />
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
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Briefly describe how we can help"
                    className="contact-input resize-none rounded-[6px] border border-[#c7c7c7] px-3.5 py-3 font-heading text-[15px] text-text-dark placeholder:text-[#98a2b3] focus:outline-2 focus:-outline-offset-1 focus:outline-primary"
                  />
                </ContactReveal>

                {/* Error Message */}
                {status === "error" && (
                  <p
                    className="mb-3 font-heading text-sm text-[#df2759]"
                    role="alert"
                  >
                    {errorMessage || "Something went wrong. Please try again."}
                  </p>
                )}

                {/* Submit */}
                <ContactReveal delay={620}>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="contact-submit btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === "submitting"
                      ? "Submitting…"
                      : status === "success"
                        ? "Thank you — we’ll be in touch"
                        : "Submit Request"}
                  </button>
                </ContactReveal>
              </form>
            </ContactReveal>
          </div>
        </section>

        {/* =====================================================
            MAP
        ====================================================== */}
        {/* Map */}
        <section className="w-full bg-[#f9fcfb] pb-[90px] max-[700px]:pb-14">
          <ContactReveal className="relative h-[520px] w-full overflow-hidden  border border-[#c6c6c6] max-[900px]:h-[400px] max-[560px]:h-[300px]">
            <iframe
              title={
                showHaritJewellers
                  ? "Harit Jewellers location"
                  : "Krishnormi clinic location"
              }
              className="absolute inset-0 h-full w-full border-0"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                activeMapQuery,
              )}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Location Toggle */}
            <button
              type="button"
              onClick={() => {
                setShowHaritJewellers((v) => !v);
                setShowLocationCard(true);
              }}
              aria-expanded={showLocationCard}
              aria-label={
                showHaritJewellers
                  ? "Show clinic location"
                  : "Show Harit Jewellers location"
              }
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
                  {showHaritJewellers
                    ? "Harit Jewellers"
                    : content.map_label_name}
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
                {showHaritJewellers
                  ? "Harit Jewellers, Ahmedabad"
                  : content.map_label_line1}
              </p>

              <p className="mb-3 font-heading text-[13px] text-[#60736e]">
                {showHaritJewellers
                  ? "Select the correct branch in Google Maps."
                  : content.map_label_line2}
              </p>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  activeMapQuery,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-heading text-[13px] font-semibold text-primary hover:text-primary-dark"
              >
                Get Directions
                <span aria-hidden="true">&rarr;</span>
              </a>

              {showHaritJewellers && (
                <button
                  type="button"
                  onClick={() => setShowHaritJewellers(false)}
                  className="mt-3 block font-heading text-[13px] font-semibold text-primary hover:text-primary-dark"
                >
                  ← Show Clinic Location
                </button>
              )}
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
