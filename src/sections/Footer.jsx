import logoIcon from "../assets/header/logo-icon.png";
import logoWordmark from "../assets/header/logo-wordmark.png";
import bgFull from "../assets/footer/bg-full.png";
import bgMobile from "../assets/footer/bg-mobile.png";
import decoration from "../assets/footer/decoration.svg";
import { FaFacebookF, FaLinkedinIn, FaGoogle, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import { useReducedMotion, useRevealOnce, revealClass } from "../hooks/useScrollReveal";

const linksCol1 = [
  "About Us",
  "Our Doctor",
  "Blog",
  "Treatments",
  "Gallery",
  "Contact Us",
];

// const linksCol2 = [
//   "Treatments",
//   "Gallery",
//   "Contact Us",
  
// ];

const COL_BORDER = "[&:not(:last-child)]:border-[rgba(128,128,128,0.3)]";

export default function Footer() {
  const { row } = useSection("footer");
  const content = row?.content ?? DEFAULT_CONTENT.footer;

  const reducedMotion = useReducedMotion();
  const [contentRef, contentVisible] = useRevealOnce(reducedMotion);

  const socials = [
    {
      Icon: FaFacebookF,
      label: "Facebook",
      href: content.facebook_url || "#",
    },
    {
      Icon: FaLinkedinIn,
      label: "LinkedIn",
      href: content.linkedin_url || "#",
    },
    {
      Icon: FaGoogle,
      label: "Google",
      href: content.google_url || "#",
    },
    {
      Icon: FaXTwitter,
      label: "Twitter",
      href: content.twitter_url || "#",
    },
    {
      Icon: FaWhatsapp,
      label: "WhatsApp",
      href:  "https://wa.me/918866589956?text=Hello%20Dr.%20Deepa%20Bhatt%2C%20I%20am%20reaching%20out%20to%20book%20a%20consultation%20appointment.%20Please%20share%20your%20upcoming%20availability%20so%20we%20can%20connect.",

    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#e8e8e8] pt-16">
      {/* Background — desktop */}
      <img
        src={bgFull}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center max-[900px]:hidden"
      />

      {/* Background — mobile only */}
      <img
        src={bgMobile}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full object-cover object-center max-[900px]:block"
      />

      {/* Decoration */}
      <img
        src={decoration}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 z-0 h-auto w-[120px]"
      />

      {/* Main Footer Content */}
      <div
        ref={contentRef}
        className={`container relative z-10 grid grid-cols-[1.15fr_1fr_1fr] gap-10 pb-12 max-[900px]:grid-cols-1 ${revealClass(contentVisible)}`}
      >
        {/* LEFT COLUMN */}
        <div
          className={`
            ${COL_BORDER}
            flex
            flex-col
            items-start
            border-r
            pr-10
            max-[900px]:border-r-0
            max-[900px]:border-b
            max-[900px]:pr-0
            max-[900px]:pb-8
          `}
        >
          {/* Proper Logo Icon + Wordmark */}
          <a
            href="/"
            aria-label="Krishnormi Home"
            className="mb-6 inline-flex flex-none items-center gap-3"
          >
            {/* Logo Icon */}
            <img
              src={logoIcon}
              alt=""
              aria-hidden="true"
              className="
                block
                h-[60px]
                w-auto
                flex-none
                object-contain
                max-[520px]:h-[45px]
                bg-none
              "
            />

            {/* Logo Wordmark */}
            <img
              src={logoWordmark}
              alt="Krishnormi"
              className="
                block
                h-auto
                w-[190px]
                object-contain
                max-[520px]:w-[155px]
              "
            />
          </a>

          {/* Tagline */}
          <p className="mb-3 font-heading text-lg font-medium leading-[1.5] text-text-dark">
            {content.tagline}
          </p>

          {/* Description */}
          <div className="mb-6 max-w-[400px]">
            <p className="font-body text-[15px] leading-[1.6] text-text">{content.description}</p>
          </div>

          {/* Social Icons */}
          <div className="flex flex-wrap gap-3">
            {socials.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-accent
                  text-white
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:opacity-90
                "
              >
                <Icon size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div
          className={`
            ${COL_BORDER}
            border-r
            pr-10
            max-[900px]:border-r-0
            max-[900px]:border-b
            max-[900px]:pr-0
            max-[900px]:pb-8
          `}
        >
          <h4 className="relative mb-5 font-heading text-2xl font-bold text-text-dark">
            Useful Links
            <span
              className="
                relative
                mt-[18px]
                block
                h-0.5
                w-[100px]
                bg-[rgba(128,128,128,0.3)]
                after:absolute
                after:top-0
                after:left-0
                after:h-0.5
                after:w-[30px]
                after:bg-accent
                after:content-['']
              "
            />
          </h4>

          <div className="flex gap-8">
            <ul className="m-0 list-none p-0">
              {linksCol1.map((link, index) => (
                <li
                  key={link}
                  className={`
                    cursor-pointer
                    py-2
                    font-heading
                    text-[17px]
                    font-semibold
                    transition
                    hover:text-accent
                    ${index === 0 ? "text-accent" : "text-text-dark"}
                  `}
                >
                  {link}
                </li>
              ))}
            </ul>

            {/* <ul className="m-0 list-none p-0">
              {linksCol2.map((link) => (
                <li
                  key={link}
                  className="
                    cursor-pointer
                    py-2
                    font-heading
                    text-[17px]
                    font-semibold
                    text-text-dark
                    transition
                    hover:text-accent
                  "
                >
                  {link}
                </li>
              ))}
            </ul> */}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <h4 className="relative mb-5 font-heading text-2xl font-bold text-text-dark">
            Contact Us
            <span
              className="
                relative
                mt-[18px]
                block
                h-0.5
                w-[100px]
                bg-[rgba(128,128,128,0.3)]
                after:absolute
                after:top-0
                after:left-0
                after:h-0.5
                after:w-[30px]
                after:bg-accent
                after:content-['']
              "
            />
          </h4>

          {/* Address */}
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-accent text-white">
              <FaMapMarkerAlt size={25} aria-hidden="true" />
            </span>

            <p className="m-0 pt-2 font-heading text-base leading-[1.5] font-medium text-text-dark">
              {content.address}
            </p>
          </div>

          {/* Email */}
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-accent text-white">
              <FaEnvelope size={20} aria-hidden="true" />
            </span>

            <a
              href={`mailto:${content.email}`}
              className="pt-2 font-heading text-base leading-[1.5] font-medium text-text-dark hover:text-accent"
            >
              {content.email}
            </a>
          </div>

          {/* Phone */}
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-accent text-white">
              <FaPhoneAlt size={20} aria-hidden="true" />
            </span>

            <a
              href={`tel:${content.phone}`}
              className="pt-2 font-heading text-base leading-[1.5] font-medium text-text-dark hover:text-accent"
            >
              {content.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 border-t border-[rgba(128,128,128,0.3)] py-5">
        <div className="container flex flex-wrap items-center justify-between gap-3 max-[900px]:flex-col max-[900px]:text-center">
          <p className="m-0 font-body text-sm text-text-dark">
            &copy; 2026 Krishnormi. All rights reserved.
          </p>

          <p className="m-0 font-body text-sm text-text-dark">
            Privacy Policy
            <span className="mx-2">|</span>
            Terms &amp; Conditions
            <span className="mx-2">|</span>
            Sitemap
          </p>

          <p className="m-0 font-body text-sm text-text-dark">
            Designed &amp; Developed by{" "}
            <a
              href="https://originedgetech.com/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#0f8bc0] hover:underline"
            >
              OriginEdge Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
