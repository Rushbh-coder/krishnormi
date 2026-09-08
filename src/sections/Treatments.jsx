import { useState } from "react";

import bgImage from "../assets/treatments/bg-1.png";
import heroTreatment from "../assets/treatments/hero-treatment.png";
import iconDermatology from "../assets/treatments/icon-dermatology.svg";
import iconFacials from "../assets/treatments/icon-facials.svg";
import iconAcne from "../assets/treatments/icon-acne.svg";
import cornerWhite from "../assets/treatments/icon-bg-1.svg";
import cornerAccent from "../assets/treatments/icon-bg-3.svg";
import arrow from "../assets/treatments/arrow.svg";
import arrowAccent from "../assets/treatments/arrow-accent.svg";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import { useReducedMotion, useRevealOnce, revealClass } from "../hooks/useScrollReveal";

// Fallback icon per card slot (position matches the DB `cards` array).
const TEMPLATE = [
  { icon: iconDermatology },
  { icon: iconFacials },
  { icon: iconAcne },
  { icon: iconAcne },
];

export default function Treatments() {
  const { row, loading } = useSection("treatments");
  const content = row?.content ?? DEFAULT_CONTENT.treatments;
  const visible = row?.visible ?? true;
  const cards = content.cards ?? DEFAULT_CONTENT.treatments.cards;

  // First card selected by default.
  const [activeCard, setActiveCard] = useState(0);

  const reducedMotion = useReducedMotion();
  const [leftRef, leftVisible] = useRevealOnce(reducedMotion);
  const [cardsRef, cardsVisible] = useRevealOnce(reducedMotion);

  if (!loading && !visible) return null;

  return (
    <section
      className="relative overflow-hidden bg-[#15350e] bg-cover bg-center pt-[90px] pb-[-2%] max-[460px]:pt-16 max-[460px]:pb-5"
      style={{
        backgroundImage: `url(${content.background_image_url || bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(36,71,17,0.75),#15350e_75%)]" />

      <div className="container relative grid grid-cols-[minmax(280px,460px)_1fr] items-start gap-10 max-[900px]:grid-cols-1">
        {/* LEFT CONTENT */}
        <div ref={leftRef} className={`relative ${revealClass(leftVisible)}`}>
          <h2 className="m-0 font-heading text-[44px] leading-[1.25] font-bold text-white">
            {content.title}
          </h2>

          <hr className="section-divider mb-6" />

          <div className="mb-8">
            <p className="font-heading text-[17px] leading-[1.7] text-white/90">{content.body_text}</p>
          </div>

          <button type="button" className="btn-primary">
            {content.button_label}
          </button>

          <img
            className="mix-blend-screen left-[50%] translate-x-[-10%] mt-15 mb-0 h-auto w-full max-w-[760px] max-[900px]:mb-[-10%] max-[900px]:mt-10 max-[900px]:w-full max-[900px]:max-w-[600px] max-[460px]:max-w-[400px]"
            src={content.hero_image_url || heroTreatment}
            width={1600}
            height={1200}
            alt="Dermatology treatment illustration"
          />
        </div>

        {/* RIGHT CARDS */}
        <div ref={cardsRef} className={`flex max-w-[700px] gap-5 max-[600px]:max-w-full max-[600px]:flex-col ${revealClass(cardsVisible)}`}>
          {[0, 1].map((col) => (
            <div
              key={col}
              className={`flex flex-1 flex-col gap-5 ${
                col === 1 ? "mt-6 max-[600px]:mt-0" : ""
              }`}
            >
              {[col, col + 2].map((i) => {
                const card = cards[i];
                if (!card) return null;

                const template = TEMPLATE[i] ?? {};
                const isActive = activeCard === i;

                return (
                  <div
                    key={i}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    onClick={() => setActiveCard(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveCard(i);
                      }
                    }}
                    className={`relative min-h-[14px] cursor-pointer overflow-hidden rounded p-[28px_24px_60px] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent max-[400px]:p-[22px_18px_50px] ${
                      isActive ? "bg-[#132106]" : "bg-white/10"
                    }`}
                  >
                    {/* Short L-shaped pink border — only 25% */}
                    <span
                      className={`pointer-events-none absolute top-0 left-0 z-[2] h-[3px] w-1/3 bg-accent transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />

                    <span
                      className={`pointer-events-none absolute top-0 left-0 z-[2] h-1/3 w-[3px] bg-accent transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden="true"
                    />

                    {/* Existing corner decoration */}
                    <img
                      className="pointer-events-none absolute top-0 left-0 h-[110px] w-[110px] max-[400px]:h-[80px] max-[400px]:w-[80px]"
                      src={isActive ? cornerAccent : cornerWhite}
                      alt=""
                      aria-hidden="true"
                    />

                    {/* Icon */}
                    <div className="relative mb-6 flex h-16 w-14 items-center justify-center">
                      <img
                        className="relative h-auto w-[34px]"
                        src={template.icon}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>

                    {/* Title */}
                    <h5 className="m-0 mb-3 line-clamp-2 font-heading text-[18px] font-semibold text-white">
                      {card.title}
                    </h5>

                    {/* Description */}
                    <p className="m-0 line-clamp-4 font-heading text-base leading-[1.7] text-white/85">
                      {card.text}
                    </p>

                    {/* Arrow */}
                    <img
                      className="absolute right-5 bottom-5 h-9 w-9 rounded"
                      src={isActive ? arrowAccent : arrow}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
