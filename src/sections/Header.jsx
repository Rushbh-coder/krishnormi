import { useState } from 'react';
import logoIcon from '../assets/header/logo-icon.png';
import logoWordmark from '../assets/header/logo-wordmark.png';

const NAV_LINKS = [
  { label: 'Home', href: '#', active: true },
  { label: 'About Us', href: '#about' },
  { label: 'Our Doctor', href: '#our-doctor' },
  { label: 'Areas of Care', href: '#areas-of-care' },
  { label: 'Treatments', href: '#treatments' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact Us', href: '#contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-100 bg-white shadow-[0_0_3px_rgba(0,0,0,0.25)]">
      <div className="container flex min-h-[100px] items-center justify-between gap-6 max-[960px]:min-h-[84px]">
        <a href="#" className="flex flex-none items-center gap-[18px]" aria-label="Krishnormi home">
          <img
            className="w-11 h-auto max-[520px]:w-9"
            src={logoIcon}
            width={59}
            height={64}
            alt=""
            aria-hidden="true"
          />
          <img
            className="w-[168px] h-auto max-[960px]:w-[140px] max-[520px]:w-[120px]"
            src={logoWordmark}
            width={263}
            height={36}
            alt="Krishnormi"
          />
        </a>

        <nav
          className={`flex items-center max-[960px]:absolute max-[960px]:top-full max-[960px]:left-0 max-[960px]:right-0 max-[960px]:flex-col max-[960px]:items-stretch max-[960px]:gap-2 max-[960px]:bg-white max-[960px]:px-10 max-[960px]:pt-4 max-[960px]:pb-6 max-[960px]:shadow-[0_8px_16px_rgba(0,0,0,0.1)] max-[960px]:origin-top max-[960px]:transition-[transform,opacity] max-[960px]:duration-200 ${
            isMenuOpen
              ? 'max-[960px]:scale-y-100 max-[960px]:opacity-100 max-[960px]:pointer-events-auto'
              : 'max-[960px]:pointer-events-none max-[960px]:scale-y-0 max-[960px]:opacity-0'
          }`}
          aria-label="Primary"
        >
          <ul className="flex list-none items-center gap-2.5 m-0 p-0 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-0">
            {NAV_LINKS.map((link) => (
              <li key={link.label} className="max-[960px]:w-full">
                <a
                  href={link.href}
                  className={`inline-flex items-center justify-center whitespace-nowrap p-2.5 font-body text-base text-text-dark transition-colors duration-200 hover:text-primary max-[960px]:w-full max-[960px]:justify-start max-[960px]:border-b max-[960px]:border-black/[0.06] max-[960px]:px-1 max-[960px]:py-3 ${
                    link.active ? 'font-semibold text-[#16743e]' : 'font-normal'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="btn-primary hidden max-[960px]:mt-3 max-[960px]:inline-flex max-[960px]:w-full"
          >
            Book an Appointment
          </a>
        </nav>

        <a href="#contact" className="btn-primary max-[960px]:hidden">
          Book an Appointment
        </a>

        <button
          type="button"
          className="hidden flex-none w-10 h-10 flex-col items-center justify-center gap-[5px] bg-transparent p-0 max-[960px]:flex"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span
            className={`block h-0.5 w-6 rounded-sm bg-text-dark transition-transform duration-200 ${
              isMenuOpen ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span className={`block h-0.5 w-6 rounded-sm bg-text-dark transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span
            className={`block h-0.5 w-6 rounded-sm bg-text-dark transition-transform duration-200 ${
              isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>
    </header>
  );
}
