import logo from "../assets/footer/logo.png";
import bgLeaf from "../assets/footer/bg-leaf.png";
import decoration from "../assets/footer/decoration.svg";
import iconLocation from "../assets/footer/icon-location.svg";
import iconEmail from "../assets/footer/icon-email.svg";
import iconPhone from "../assets/footer/icon-phone.svg";
import iconFacebook from "../assets/footer/icon-facebook.svg";
import iconLinkedin from "../assets/footer/icon-linkedin.svg";
import iconGoogle from "../assets/footer/icon-google.svg";
import iconSocial4 from "../assets/footer/icon-social-4.svg";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

const linksCol1 = ["Home", "About Us", "Our Doctor", "Areas of Care"];
const linksCol2 = ["Treatments", "Gallery", "Contact Us", "Book an Appointment"];

const COL_BORDER = "[&:not(:last-child)]:border-[rgba(128,128,128,0.3)]";

export default function Footer() {
  const { row } = useSection('footer');
  const content = row?.content ?? DEFAULT_CONTENT.footer;

  const socials = [
    { icon: iconFacebook, label: "Facebook", href: content.facebook_url || '#' },
    { icon: iconLinkedin, label: "LinkedIn", href: content.linkedin_url || '#' },
    { icon: iconGoogle, label: "Google", href: content.google_url || '#' },
    { icon: iconSocial4, label: "Twitter", href: content.twitter_url || '#', plain: true },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#e8e8e8] pt-16">
      <img
        className="pointer-events-none absolute top-[-10%] right-[-8%] h-auto w-[45%] object-contain opacity-50"
        src={bgLeaf}
        alt=""
        aria-hidden="true"
      />
      <img className="pointer-events-none absolute right-0 bottom-0 h-auto w-[120px]" src={decoration} alt="" aria-hidden="true" />

      <div className="container relative grid grid-cols-[1.1fr_1fr_1fr] gap-10 pb-12 max-[900px]:grid-cols-1">
        <div
          className={`${COL_BORDER} [&:not(:last-child)]:border-r [&:not(:last-child)]:pr-10 max-[900px]:[&:not(:last-child)]:border-r-0 max-[900px]:[&:not(:last-child)]:border-b max-[900px]:[&:not(:last-child)]:pr-0 max-[900px]:[&:not(:last-child)]:pb-8`}
        >
          <img className="mb-5 h-[72px] w-auto" src={logo} alt="Krishnormi" />
          <p className="mb-3 font-heading text-lg font-medium text-text-dark">{content.tagline}</p>
          <p className="mb-6 max-w-[400px] font-body text-[15px] leading-[1.6] text-text">{content.description}</p>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                href={s.href}
                className={
                  s.plain
                    ? "flex h-9 w-9 items-center justify-center rounded-full [&_img]:h-9 [&_img]:w-9"
                    : "flex h-9 w-9 items-center justify-center rounded-full bg-accent [&_img]:h-4 [&_img]:w-4 [&_img]:brightness-0 [&_img]:invert"
                }
                key={s.label}
                aria-label={s.label}
              >
                <img src={s.icon} alt="" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div
          className={`${COL_BORDER} [&:not(:last-child)]:border-r [&:not(:last-child)]:pr-10 max-[900px]:[&:not(:last-child)]:border-r-0 max-[900px]:[&:not(:last-child)]:border-b max-[900px]:[&:not(:last-child)]:pr-0 max-[900px]:[&:not(:last-child)]:pb-8`}
        >
          <h4 className="relative mb-5 font-heading text-2xl font-bold text-text-dark">
            Useful Links
            <span className="relative mt-[18px] block h-0.5 w-[100px] bg-[rgba(128,128,128,0.3)] after:absolute after:top-0 after:left-0 after:h-0.5 after:w-[30px] after:bg-accent after:content-['']" />
          </h4>
          <div className="flex gap-6">
            <ul className="m-0 list-none p-0">
              {linksCol1.map((link, i) => (
                <li
                  key={link}
                  className={`cursor-pointer py-2 font-heading text-[17px] font-semibold ${
                    i === 0 ? "text-accent" : "text-text-dark"
                  }`}
                >
                  {link}
                </li>
              ))}
            </ul>
            <ul className="m-0 list-none p-0">
              {linksCol2.map((link) => (
                <li key={link} className="cursor-pointer py-2 font-heading text-[17px] font-semibold text-text-dark">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={COL_BORDER}>
          <h4 className="relative mb-5 font-heading text-2xl font-bold text-text-dark">
            Contact With Us
            <span className="relative mt-[18px] block h-0.5 w-[100px] bg-[rgba(128,128,128,0.3)] after:absolute after:top-0 after:left-0 after:h-0.5 after:w-[30px] after:bg-accent after:content-['']" />
          </h4>
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-accent [&_img]:h-[18px] [&_img]:w-[18px] [&_img]:brightness-0 [&_img]:invert">
              <img src={iconLocation} alt="" aria-hidden="true" />
            </span>
            <p className="m-0 pt-2 font-heading text-base leading-[1.5] font-medium text-text-dark">{content.address}</p>
          </div>
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-accent [&_img]:h-[18px] [&_img]:w-[18px] [&_img]:brightness-0 [&_img]:invert">
              <img src={iconEmail} alt="" aria-hidden="true" />
            </span>
            <p className="m-0 pt-2 font-heading text-base leading-[1.5] font-medium text-text-dark">{content.email}</p>
          </div>
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-full bg-accent [&_img]:h-[18px] [&_img]:w-[18px] [&_img]:brightness-0 [&_img]:invert">
              <img src={iconPhone} alt="" aria-hidden="true" />
            </span>
            <p className="m-0 pt-2 font-heading text-base leading-[1.5] font-medium text-text-dark">{content.phone}</p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-[rgba(128,128,128,0.3)] py-5">
        <div className="container flex flex-wrap items-center justify-between gap-3 max-[900px]:flex-col max-[900px]:text-center">
          <p className="m-0 font-body text-sm text-text-dark">&copy;2026 Krishnormi. All rights reserved.</p>
          <p className="m-0 font-body text-sm text-text-dark">Privacy Policy&nbsp;|&nbsp;Terms &amp; Conditions&nbsp;|&nbsp;Sitemap</p>
          <p className="m-0 font-body text-sm text-text-dark">
            Designed &amp; Develop by{" "}
            <a href="https://originedgetech.com/" target="_blank" rel="noreferrer" className="font-medium text-[#0f8bc0]">
              OriginEdge Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
