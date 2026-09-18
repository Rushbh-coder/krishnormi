import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import logoIcon from "../assets/header/logo-icon.png";
import logoWordmark from "../assets/header/logo-wordmark.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Treatments", href: "#treatments" },
  { label: "Gallery", href: "#gallery" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact Us", href: "/contact-us" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const location = useLocation();

  const isLinkActive = (href) =>
    href.startsWith("/")
      ? location.pathname === href
      : location.pathname === "/" && activeHash === href;

  const handleNavClick = (href) => {
    setActiveHash(href.startsWith("/") ? "" : href);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-white shadow-[0_1px_5px_rgba(0,0,0,0.12)]">
      <div className="container relative flex min-h-[92px] items-center justify-between gap-5 max-[1100px]:min-h-[74px] max-[560px]:min-h-[68px]">
        {/* LOGO */}
        <Link
          to="/"
          aria-label="Krishnormi home"
          onClick={() => handleNavClick("/")}
          className="flex min-w-0 flex-none items-center gap-3 max-[380px]:gap-2"
        >
          <img
            src={logoIcon}
            width={70}
            height={70}
            alt=""
            aria-hidden="true"
            className="h-auto w-[44px] flex-none object-contain max-[560px]:w-[34px]"
          />

          <img
            src={logoWordmark}
            width={263}
            height={36}
            alt="Krishnormi"
            className="h-auto w-[168px] flex-none object-contain max-[1100px]:w-[150px] max-[560px]:w-[128px] max-[380px]:w-[112px]"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav
          className="flex min-w-0 items-center max-[1100px]:hidden"
          aria-label="Primary navigation"
        >
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link.href);

              const linkClassName = `inline-flex items-center justify-center whitespace-nowrap px-2.5 py-2 font-body text-[14px] transition-colors duration-200 hover:text-primary ${
                isActive ? "font-semibold text-primary" : "font-normal text-text-dark"
              }`;

              return (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link to={link.href} onClick={() => handleNavClick(link.href)} className={linkClassName}>
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} onClick={() => handleNavClick(link.href)} className={linkClassName}>
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* DESKTOP APPOINTMENT BUTTON */}
        <a
          href="#contact"
          onClick={() => handleNavClick("#contact")}
          className="btn-hero flex-none max-[1100px]:hidden"
        >
          Book an Appointment
        </a>

        {/* MOBILE HAMBURGER */}
        <button
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="hidden h-10 w-10 flex-none flex-col items-center justify-center gap-[5px] rounded-md bg-transparent p-0 max-[1100px]:flex"
        >
          <span
            className={`block h-[2px] w-6 rounded-full bg-text-dark transition-transform duration-200 ${
              isMenuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />

          <span
            className={`block h-[2px] w-6 rounded-full bg-text-dark transition-opacity duration-200 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />

          <span
            className={`block h-[2px] w-6 rounded-full bg-text-dark transition-transform duration-200 ${
              isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* MOBILE MENU */}
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          aria-hidden={!isMenuOpen}
          className={`absolute top-full right-0 left-0 z-50 hidden bg-white px-6 pt-3 pb-6 shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-[opacity,transform] duration-200 max-[1100px]:block max-[560px]:px-5 ${
            isMenuOpen
              ? "pointer-events-auto visible translate-y-0 opacity-100"
              : "pointer-events-none invisible -translate-y-2 opacity-0"
          }`}
        >
          <ul className="m-0 list-none p-0">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link.href);

              const mobileLinkClassName = `flex w-full items-center py-3.5 font-body text-[15px] transition-colors hover:text-primary ${
                isActive ? "font-semibold text-primary" : "font-normal text-text-dark"
              }`;

              return (
                <li key={link.label} className="border-b border-black/[0.07]">
                  {link.href.startsWith("/") ? (
                    <Link
                      to={link.href}
                      onClick={() => handleNavClick(link.href)}
                      tabIndex={isMenuOpen ? 0 : -1}
                      className={mobileLinkClassName}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => handleNavClick(link.href)}
                      tabIndex={isMenuOpen ? 0 : -1}
                      className={mobileLinkClassName}
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          {/* MOBILE APPOINTMENT BUTTON */}
          <a
            href="#contact"
            onClick={() => handleNavClick("#contact")}
            tabIndex={isMenuOpen ? 0 : -1}
            className="btn-hero mt-5 w-full"
          >
            Book an Appointment
          </a>
        </nav>
      </div>
    </header>
  );
}
