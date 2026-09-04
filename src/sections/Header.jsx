import { useState } from "react";

import logoIcon from "../assets/header/logo-icon.png";
import logoWordmark from "../assets/header/logo-wordmark.png";

const NAV_LINKS = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#about" },
  { label: "Our Doctor", href: "#our-doctor" },
  { label: "Areas of Care", href: "#areas-of-care" },
  { label: "Treatments", href: "#treatments" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#");

  const handleNavClick = (href) => {
    setActiveLink(href);
    setIsMenuOpen(false);
  };

  return (
    <header
      className="
        sticky
        top-0
        z-[100]
        w-full
        bg-white
        shadow-[0_1px_5px_rgba(0,0,0,0.12)]
      "
    >
      <div
        className="
          container
          relative
          flex
          min-h-[92px]
          items-center
          justify-between
          gap-5

          max-[1100px]:min-h-[74px]
          max-[560px]:min-h-[68px]
        "
      >
        {/* LOGO */}
        <a
          href="#"
          aria-label="Krishnormi home"
          onClick={() => handleNavClick("#")}
          className="
            flex
            flex-none
            items-center
            gap-3
          "
        >
          <img
            src={logoIcon}
            width={70}
            height={70}
            alt=""
            aria-hidden="true"
            className="
              h-auto
              w-[44px]
              flex-none

              max-[560px]:w-[34px]
            "
          />

          <img
            src={logoWordmark}
            width={263}
            height={36}
            alt="Krishnormi"
            className="
              h-auto
              w-[168px]
              flex-none

              max-[1100px]:w-[150px]
              max-[560px]:w-[128px]
              max-[380px]:w-[112px]
            "
          />
        </a>

        {/* DESKTOP NAV */}
        <nav
          className="
            flex
            items-center
            max-[1100px]:hidden
          "
          aria-label="Primary navigation"
        >
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {NAV_LINKS.map((link) => {
              const isActive = activeLink === link.href;

              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`
                      inline-flex
                      items-center
                      justify-center
                      whitespace-nowrap
                      px-2.5
                      py-2

                      font-body
                      text-[14px]

                      transition-colors
                      duration-200

                      hover:text-primary

                      ${
                        isActive
                          ? "font-semibold text-primary"
                          : "font-normal text-text-dark"
                      }
                    `}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* DESKTOP APPOINTMENT BUTTON */}
        <a
          href="#contact"
          onClick={() => setActiveLink("#contact")}
          className="
            btn-primary
            flex-none
            px-5
            py-3
            text-sm

            max-[1100px]:hidden
          "
        >
          Book an Appointment
        </a>

        {/* MOBILE RIGHT SIDE */}
        <div className="hidden items-center gap-2 max-[1100px]:flex">
          {/* Optional compact appointment button */}
          <a
            href="#contact"
            onClick={() => handleNavClick("#contact")}
            className="
              inline-flex
              h-[38px]
              items-center
              justify-center
              whitespace-nowrap
              rounded-full
              bg-accent
              px-4

              font-body
              text-[12px]
              font-semibold
              text-white

              max-[480px]:hidden
            "
          >
            Book Appointment
          </a>

          {/* HAMBURGER */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="
              flex
              h-10
              w-10
              flex-none
              flex-col
              items-center
              justify-center
              gap-[5px]
              rounded-md
              bg-transparent
              p-0
            "
          >
            <span
              className={`
                block
                h-[2px]
                w-6
                rounded-full
                bg-text-dark
                transition-transform
                duration-200

                ${isMenuOpen ? "translate-y-[7px] rotate-45" : ""}
              `}
            />

            <span
              className={`
                block
                h-[2px]
                w-6
                rounded-full
                bg-text-dark
                transition-opacity
                duration-200

                ${isMenuOpen ? "opacity-0" : ""}
              `}
            />

            <span
              className={`
                block
                h-[2px]
                w-6
                rounded-full
                bg-text-dark
                transition-transform
                duration-200

                ${isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}
              `}
            />
          </button>
        </div>

        {/* MOBILE MENU */}
        <nav
          aria-label="Mobile navigation"
          className={`
            absolute
            top-full
            right-0
            left-0
            z-50

            hidden
            bg-white

            px-6
            pt-3
            pb-6

            shadow-[0_10px_25px_rgba(0,0,0,0.12)]

            transition-all
            duration-200

            max-[1100px]:block

            ${
              isMenuOpen
                ? "pointer-events-auto visible translate-y-0 opacity-100"
                : "pointer-events-none invisible -translate-y-2 opacity-0"
            }
          `}
        >
          <ul className="m-0 list-none p-0">
            {NAV_LINKS.map((link) => {
              const isActive = activeLink === link.href;

              return (
                <li
                  key={link.label}
                  className="
                    border-b
                    border-black/[0.07]
                  "
                >
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`
                      flex
                      w-full
                      items-center
                      py-3.5

                      font-body
                      text-[15px]

                      ${
                        isActive
                          ? "font-semibold text-primary"
                          : "font-normal text-text-dark"
                      }
                    `}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Full width appointment button on mobile */}
          <a
            href="#contact"
            onClick={() => handleNavClick("#contact")}
            className="
              mt-5
              flex
              w-full
              items-center
              justify-center

              rounded-full
              bg-accent

              px-6
              py-3.5

              font-body
              text-sm
              font-semibold
              text-white

              transition
              hover:bg-accent-dark
            "
          >
            Book an Appointment
          </a>
        </nav>
      </div>
    </header>
  );
}
