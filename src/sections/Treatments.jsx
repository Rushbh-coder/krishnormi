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

import {
  useReducedMotion,
  useRevealOnce,
  revealClass,
} from "../hooks/useScrollReveal";

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

  /*
   * Hover state only.
   * First card visually highlighted when nothing is hovered.
   */
  const [hoveredCard, setHoveredCard] = useState(null);

  const reducedMotion = useReducedMotion();

  const [leftRef, leftVisible] = useRevealOnce(reducedMotion);
  const [cardsRef, cardsVisible] = useRevealOnce(reducedMotion);

  if (!loading && !visible) return null;

  return (
    <>
      <section
        className="
          treatments-wow-section

          relative
          overflow-hidden

          bg-[#15350e]
          bg-cover
          bg-center

          pt-[90px]
          pb-[-2%]

          max-[460px]:pt-16
          max-[460px]:pb-5
        "
        style={{
          backgroundImage: `url(${content.background_image_url || bgImage})`,
        }}
      >
        {/* =====================================================
            ORIGINAL GREEN OVERLAY
        ====================================================== */}

        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(36,71,17,0.75),#15350e_75%)]" />

        {/* =====================================================
            ANIMATED BACKGROUND LAYERS
        ====================================================== */}

        {!reducedMotion && (
          <>
            <div
              className="treatment-bg-drift pointer-events-none absolute inset-[-5%] z-0"
              aria-hidden="true"
            />

            <span
              className="treatment-ambient treatment-ambient-one"
              aria-hidden="true"
            />

            <span
              className="treatment-ambient treatment-ambient-two"
              aria-hidden="true"
            />

            <span
              className="treatment-ambient treatment-ambient-three"
              aria-hidden="true"
            />

            <div
              className="treatment-grain pointer-events-none absolute inset-0 z-0"
              aria-hidden="true"
            />

            <div
              className="treatment-scan-light pointer-events-none absolute inset-0 z-0"
              aria-hidden="true"
            />
          </>
        )}

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div
          className="
            container
            relative
            z-[3]

            grid
            grid-cols-[minmax(280px,460px)_1fr]

            items-start
            gap-10

            max-[900px]:grid-cols-1
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div
            ref={leftRef}
            className={`
              relative

              ${revealClass(leftVisible)}
            `}
          >
            {/* HEADING */}

            <h2
              className={`
                treatment-content-reveal
                treatment-delay-1

                m-0

                font-heading

                text-[44px]
                leading-[1.25]
                font-bold

                text-white

                ${leftVisible ? "treatment-content-visible" : ""}
              `}
            >
              {content.title}
            </h2>

            {/* DIVIDER */}

            <hr
              className={`
                section-divider
                treatment-divider

                mb-6

                ${leftVisible ? "treatment-divider-visible" : ""}
              `}
            />

            {/* BODY */}

            <div
              className={`
                treatment-content-reveal
                treatment-delay-2

                mb-8

                ${leftVisible ? "treatment-content-visible" : ""}
              `}
            >
              <p className="font-heading text-[17px] leading-[1.7] text-white/90">
                {content.body_text}
              </p>
            </div>

            {/* BUTTON */}

            <button
              type="button"
              className={`
                btn-hero
                treatment-main-button

                treatment-content-reveal
                treatment-delay-3

                relative
                overflow-hidden

                ${leftVisible ? "treatment-content-visible" : ""}
              `}
            >
              <span
                className="treatment-button-light pointer-events-none absolute inset-0"
                aria-hidden="true"
              />

              <span
                className="treatment-button-glow pointer-events-none absolute inset-0"
                aria-hidden="true"
              />

              <span className="relative z-[2]">{content.button_label}</span>
            </button>

            {/* =================================================
                HERO TREATMENT IMAGE
            ================================================== */}

            <div
              className={`
                treatment-hero-wrapper

                treatment-content-reveal
                treatment-delay-4

                relative

                ${leftVisible ? "treatment-content-visible" : ""}
              `}
            >
              {/* soft aura behind image */}

              <span
                className="treatment-hero-aura pointer-events-none absolute"
                aria-hidden="true"
              />

              {/* floating particles around hero */}

              {!reducedMotion && (
                <>
                  <span className="hero-particle hero-particle-1" />
                  <span className="hero-particle hero-particle-2" />
                  <span className="hero-particle hero-particle-3" />
                  <span className="hero-particle hero-particle-4" />
                  <span className="hero-particle hero-particle-5" />
                </>
              )}

              <img
                className="
                  treatment-hero-image

                  mix-blend-screen

                  left-[5%]

                  mt-15
                  mb-0

                  h-auto
                  w-full
                  max-w-[760px]

                  translate-x-[-3%]

                  max-[900px]:mt-10
                  max-[900px]:mb-[-10%]
                  max-[900px]:w-full
                  max-[900px]:max-w-[600px]

                  max-[460px]:max-w-[400px]
                "
                src={content.hero_image_url || heroTreatment}
                width={1600}
                height={1200}
                alt="Dermatology treatment illustration"
              />
            </div>
          </div>

          {/* =================================================
              RIGHT CARDS
          ================================================== */}

          <div
            ref={cardsRef}
            className={`
              flex
              max-w-[700px]
              gap-5

              max-[600px]:max-w-full
              max-[600px]:flex-col

              ${revealClass(cardsVisible)}
            `}
          >
            {[0, 1].map((col) => (
              <div
                key={col}
                className={`
                  flex
                  flex-1
                  flex-col
                  gap-5

                  ${col === 1 ? "mt-6 max-[600px]:mt-0" : ""}
                `}
              >
                {[col, col + 2].map((i) => {
                  const card = cards[i];

                  if (!card) return null;

                  const template = TEMPLATE[i] ?? {};

                  const isHighlighted =
                    hoveredCard === i || (hoveredCard === null && i === 0);

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredCard(i)}
                      onMouseLeave={(e) => {
                        setHoveredCard(null);

                        e.currentTarget.style.setProperty("--rx", "0deg");

                        e.currentTarget.style.setProperty("--ry", "0deg");
                      }}
                      onMouseMove={(e) => {
                        if (reducedMotion) return;

                        const rect = e.currentTarget.getBoundingClientRect();

                        const x = e.clientX - rect.left;

                        const y = e.clientY - rect.top;

                        const centerX = rect.width / 2;

                        const centerY = rect.height / 2;

                        const rotateY = ((x - centerX) / centerX) * 2.5;

                        const rotateX = ((y - centerY) / centerY) * -2.5;

                        e.currentTarget.style.setProperty(
                          "--mouse-x",
                          `${x}px`,
                        );

                        e.currentTarget.style.setProperty(
                          "--mouse-y",
                          `${y}px`,
                        );

                        e.currentTarget.style.setProperty(
                          "--rx",
                          `${rotateX}deg`,
                        );

                        e.currentTarget.style.setProperty(
                          "--ry",
                          `${rotateY}deg`,
                        );
                      }}
                      className={`
                        treatment-wow-card

                        ${cardsVisible ? "treatment-card-visible" : ""}

                        group

                        relative

                        min-h-[14px]

                        cursor-default

                        overflow-hidden

                        rounded

                        p-[28px_24px_60px]

                        transition-colors
                        duration-200

                        max-[400px]:p-[22px_18px_50px]

                        ${isHighlighted ? "bg-[#132106]" : "bg-white/10"}
                      `}
                      style={{
                        "--card-delay": `${i * 130}ms`,
                      }}
                    >
                      {/* =====================================
                          CURSOR SPOTLIGHT
                      ====================================== */}

                      <span
                        className="treatment-card-spotlight pointer-events-none absolute inset-0 z-0"
                        aria-hidden="true"
                      />

                      {/* =====================================
                          GLASS SHINE
                      ====================================== */}

                      <span
                        className="treatment-card-shine pointer-events-none absolute inset-0 z-[1]"
                        aria-hidden="true"
                      />

                      {/* =====================================
                          SUBTLE INNER GLOW
                      ====================================== */}

                      <span
                        className="treatment-card-inner-glow pointer-events-none absolute inset-0 z-0"
                        aria-hidden="true"
                      />

                      {/* =====================================
                          L-SHAPED ACCENT BORDER
                      ====================================== */}

                      <span
                        className={`
                          treatment-border-horizontal

                          pointer-events-none

                          absolute
                          top-0
                          left-0

                          z-[4]

                          h-[3px]
                          w-1/3

                          bg-accent

                          ${isHighlighted ? "opacity-100" : "opacity-0"}
                        `}
                        aria-hidden="true"
                      />

                      <span
                        className={`
                          treatment-border-vertical

                          pointer-events-none

                          absolute
                          top-0
                          left-0

                          z-[4]

                          h-1/3
                          w-[3px]

                          bg-accent

                          ${isHighlighted ? "opacity-100" : "opacity-0"}
                        `}
                        aria-hidden="true"
                      />

                      {/* =====================================
                          CORNER DECORATION
                      ====================================== */}

                      <img
                        className="
                          treatment-corner

                          pointer-events-none

                          absolute
                          top-0
                          left-0

                          z-[2]

                          h-[110px]
                          w-[110px]

                          max-[400px]:h-[80px]
                          max-[400px]:w-[80px]
                        "
                        src={isHighlighted ? cornerAccent : cornerWhite}
                        alt=""
                        aria-hidden="true"
                      />

                      {/* =====================================
                          ICON
                      ====================================== */}

                      <div
                        className="
                          treatment-icon-zone

                          relative
                          z-[5]

                          mb-6

                          flex
                          h-16
                          w-14

                          items-center
                          justify-center
                        "
                      >
                        {/* glow */}

                        <span
                          className="treatment-icon-glow pointer-events-none absolute inset-0 rounded-full"
                          aria-hidden="true"
                        />

                        {/* orbit 1 */}

                        <span
                          className="treatment-icon-orbit pointer-events-none absolute inset-[-7px] rounded-full"
                          aria-hidden="true"
                        >
                          <span className="treatment-orbit-dot" />
                        </span>

                        {/* orbit 2 */}

                        <span
                          className="treatment-icon-orbit-two pointer-events-none absolute inset-[-12px] rounded-full"
                          aria-hidden="true"
                        >
                          <span className="treatment-orbit-dot-two" />
                        </span>

                        {/* pulse */}

                        <span
                          className="treatment-icon-pulse pointer-events-none absolute inset-[5px] rounded-full"
                          aria-hidden="true"
                        />

                        {/* sparks */}

                        <span className="treatment-spark treatment-spark-1" />
                        <span className="treatment-spark treatment-spark-2" />
                        <span className="treatment-spark treatment-spark-3" />
                        <span className="treatment-spark treatment-spark-4" />

                        <img
                          className="
                            treatment-card-icon

                            relative
                            z-[5]

                            h-auto
                            w-[34px]
                          "
                          src={template.icon}
                          alt=""
                          aria-hidden="true"
                        />
                      </div>

                      {/* =====================================
                          TITLE
                      ====================================== */}

                      <h5
                        className="
                          treatment-card-title

                          relative
                          z-[5]

                          m-0
                          mb-3

                          line-clamp-2

                          font-heading

                          text-[18px]
                          font-semibold

                          text-white
                        "
                      >
                        {card.title}
                      </h5>

                      {/* =====================================
                          DESCRIPTION
                      ====================================== */}

                      <p
                        className="
                          treatment-card-description

                          relative
                          z-[5]

                          m-0

                          line-clamp-4

                          font-heading

                          text-base
                          leading-[1.7]

                          text-white/85
                        "
                      >
                        {card.text}
                      </p>

                      {/* =====================================
                          ARROW
                      ====================================== */}

                      <div
                        className="
                          treatment-arrow-wrapper

                          absolute
                          right-5
                          bottom-5

                          z-[6]

                          h-9
                          w-9
                        "
                      >
                        <span
                          className="treatment-arrow-pulse pointer-events-none absolute inset-0 rounded"
                          aria-hidden="true"
                        />

                        <img
                          className="
                            treatment-arrow

                            relative
                            z-[2]

                            h-9
                            w-9

                            rounded
                          "
                          src={isHighlighted ? arrowAccent : arrow}
                          alt=""
                          aria-hidden="true"
                        />
                      </div>

                      {/* =====================================
                          BOTTOM AMBIENT LIGHT
                      ====================================== */}

                      <span
                        className="treatment-card-bottom-light pointer-events-none absolute"
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

      <style>{`

/* =========================================================
   BACKGROUND
========================================================= */

.treatment-bg-drift {
  background:
    radial-gradient(
      circle at 25% 45%,
      rgba(188,206,141,.07),
      transparent 32%
    );

  animation:
    treatmentBackgroundMove
    14s ease-in-out infinite alternate;
}

@keyframes treatmentBackgroundMove {
  0% {
    transform:
      scale(1)
      translate3d(-1%,0,0);
  }

  100% {
    transform:
      scale(1.08)
      translate3d(3%,-2%,0);
  }
}


/* =========================================================
   AMBIENT LIGHTS
========================================================= */

.treatment-ambient {
  position: absolute;

  pointer-events: none;

  border-radius: 50%;

  filter: blur(55px);

  z-index: 0;
}

.treatment-ambient-one {
  width: 350px;
  height: 350px;

  top: -180px;
  right: 15%;

  background:
    rgba(188,206,141,.10);

  animation:
    treatmentAmbientOne
    10s ease-in-out infinite alternate;
}

.treatment-ambient-two {
  width: 300px;
  height: 300px;

  bottom: -150px;
  left: 25%;

  background:
    rgba(255,255,255,.035);

  animation:
    treatmentAmbientTwo
    12s ease-in-out infinite alternate;
}

.treatment-ambient-three {
  width: 220px;
  height: 220px;

  top: 45%;
  right: -100px;

  background:
    rgba(188,206,141,.07);

  animation:
    treatmentAmbientThree
    9s ease-in-out infinite alternate;
}

@keyframes treatmentAmbientOne {
  to {
    transform:
      translate(-80px,80px)
      scale(1.2);
  }
}

@keyframes treatmentAmbientTwo {
  to {
    transform:
      translate(90px,-40px)
      scale(1.15);
  }
}

@keyframes treatmentAmbientThree {
  to {
    transform:
      translate(-70px,-30px)
      scale(1.25);
  }
}


/* =========================================================
   VERY SUBTLE TEXTURE
========================================================= */

.treatment-grain {
  opacity: .08;

  background-image:
    radial-gradient(
      rgba(255,255,255,.25) .5px,
      transparent .5px
    );

  background-size:
    7px 7px;

  mask-image:
    linear-gradient(
      to right,
      transparent,
      black 25%,
      black 85%,
      transparent
    );
}


/* =========================================================
   SLOW BACKGROUND LIGHT
========================================================= */

.treatment-scan-light {
  width: 35%;

  opacity: .1;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.10),
      transparent
    );

  transform:
    translateX(-300%)
    skewX(-20deg);

  animation:
    treatmentScan
    10s ease-in-out infinite;
}

@keyframes treatmentScan {
  0%,
  65% {
    transform:
      translateX(-300%)
      skewX(-20deg);
  }

  100% {
    transform:
      translateX(500%)
      skewX(-20deg);
  }
}


/* =========================================================
   LEFT CONTENT ENTRANCE
========================================================= */

.treatment-content-reveal {
  opacity: 0;

  transform:
    translateY(24px);

  filter: blur(3px);

  transition:
    opacity .9s
      cubic-bezier(.16,1,.3,1),
    transform .9s
      cubic-bezier(.16,1,.3,1),
    filter .8s ease;

  transition-delay:
    var(--treatment-delay,0ms);
}

.treatment-content-visible {
  opacity: 1;

  transform:
    translateY(0);

  filter: blur(0);
}

.treatment-delay-1 {
  --treatment-delay: 80ms;
}

.treatment-delay-2 {
  --treatment-delay: 190ms;
}

.treatment-delay-3 {
  --treatment-delay: 300ms;
}

.treatment-delay-4 {
  --treatment-delay: 400ms;
}


/* =========================================================
   DIVIDER
========================================================= */

.treatment-divider {
  transform:
    scaleX(0);

  transform-origin:
    left center;

  transition:
    transform 1.1s
      cubic-bezier(.16,1,.3,1)
      .2s;
}

.treatment-divider-visible {
  transform:
    scaleX(1);
}


/* =========================================================
   BUTTON
========================================================= */

.treatment-main-button {
  transition:
    transform .4s
      cubic-bezier(.16,1,.3,1),
    box-shadow .4s ease;
}

.treatment-main-button:hover {
  transform:
    translateY(-4px)
    scale(1.02);

  box-shadow:
    0 12px 30px
    rgba(0,0,0,.18);
}

.treatment-button-light {
  width: 40%;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.55),
      transparent
    );

  transform:
    translateX(-300%)
    skewX(-20deg);
}

.treatment-main-button:hover
.treatment-button-light {
  animation:
    treatmentButtonShine
    .85s ease forwards;
}

@keyframes treatmentButtonShine {
  to {
    transform:
      translateX(600%)
      skewX(-20deg);
  }
}

.treatment-button-glow {
  opacity: 0;

  box-shadow:
    inset 0 0 18px
    rgba(255,255,255,.18);

  transition:
    opacity .4s ease;
}

.treatment-main-button:hover
.treatment-button-glow {
  opacity: 1;
}


/* =========================================================
   HERO IMAGE
========================================================= */

.treatment-hero-wrapper {
  perspective: 1000px;
}

.treatment-hero-image {
  position: relative;
  z-index: 2;

  transform-origin:
    50% 60%;

  animation:
    treatmentHeroBreathing
    6s ease-in-out infinite;

  transition:
    transform .9s
      cubic-bezier(.16,1,.3,1),
    filter .6s ease;

  will-change: transform;
}

@keyframes treatmentHeroBreathing {
  0%,
  100% {
    transform:
      translateX(-3%)
      translateY(0)
      scale(1);
  }

  50% {
    transform:
      translateX(-3%)
      translateY(-7px)
      scale(1.008);
  }
}

.treatment-hero-wrapper:hover
.treatment-hero-image {
  animation-play-state: paused;

  transform:
    translateX(-3%)
    translateY(-5px)
    scale(1.025);

  filter:
    drop-shadow(
      0 18px 22px
      rgba(0,0,0,.10)
    );
}


/* =========================================================
   HERO AURA
========================================================= */

.treatment-hero-aura {
  width: 70%;
  height: 45%;

  left: 8%;
  bottom: 10%;

  border-radius: 50%;

  background:
    radial-gradient(
      ellipse,
      rgba(188,206,141,.15),
      transparent 68%
    );

  filter:
    blur(35px);

  animation:
    treatmentHeroAura
    5s ease-in-out infinite;
}

@keyframes treatmentHeroAura {
  50% {
    opacity: .55;

    transform:
      scale(1.15);
  }
}


/* =========================================================
   HERO PARTICLES
========================================================= */

.hero-particle {
  position: absolute;

  z-index: 3;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background:
    rgba(188,206,141,.8);

  box-shadow:
    0 0 8px
    rgba(188,206,141,.55);

  opacity: 0;
}

.hero-particle-1 {
  left: 10%;
  top: 30%;

  animation:
    heroParticle 5s
    1s ease-in-out infinite;
}

.hero-particle-2 {
  left: 35%;
  top: 20%;

  animation:
    heroParticle 6s
    2s ease-in-out infinite;
}

.hero-particle-3 {
  right: 18%;
  top: 45%;

  animation:
    heroParticle 5.5s
    .5s ease-in-out infinite;
}

.hero-particle-4 {
  right: 30%;
  bottom: 20%;

  animation:
    heroParticle 7s
    2.5s ease-in-out infinite;
}

.hero-particle-5 {
  left: 20%;
  bottom: 15%;

  animation:
    heroParticle 6.5s
    1.5s ease-in-out infinite;
}

@keyframes heroParticle {
  0% {
    opacity: 0;

    transform:
      translateY(15px)
      scale(.5);
  }

  40% {
    opacity: .8;
  }

  100% {
    opacity: 0;

    transform:
      translateY(-35px)
      scale(1.2);
  }
}


/* =========================================================
   CARD BASE
========================================================= */

.treatment-wow-card {
  --mouse-x: 50%;
  --mouse-y: 50%;
  --rx: 0deg;
  --ry: 0deg;

  opacity: 0;

  transform:
    translateY(38px)
    scale(.96);

  filter:
    blur(4px);

  transform-style:
    preserve-3d;

  isolation:
    isolate;

  transition:
    background-color .35s ease,
    transform .4s
      cubic-bezier(.16,1,.3,1),
    box-shadow .4s ease,
    filter .4s ease;
}

.treatment-card-visible {
  animation:
    treatmentCardEntrance
    .95s
    cubic-bezier(.16,1,.3,1)
    forwards;

  animation-delay:
    var(--card-delay);
}

@keyframes treatmentCardEntrance {
  0% {
    opacity: 0;

    transform:
      translateY(38px)
      scale(.96);

    filter:
      blur(4px);
  }

  70% {
    opacity: 1;

    transform:
      translateY(-4px)
      scale(1.008);

    filter:
      blur(0);
  }

  100% {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);

    filter:
      blur(0);
  }
}

.treatment-wow-card:hover {
  transform:
    perspective(900px)
    translateY(-8px)
    scale(1.012)
    rotateX(var(--rx))
    rotateY(var(--ry));

  box-shadow:
    0 25px 55px
    rgba(0,0,0,.20),
    0 7px 18px
    rgba(0,0,0,.12);
}


/* =========================================================
   CURSOR SPOTLIGHT
========================================================= */

.treatment-card-spotlight {
  opacity: 0;

  background:
    radial-gradient(
      220px circle
      at var(--mouse-x)
      var(--mouse-y),

      rgba(188,206,141,.18),

      transparent 65%
    );

  transition:
    opacity .4s ease;
}

.treatment-wow-card:hover
.treatment-card-spotlight {
  opacity: 1;
}


/* =========================================================
   INNER GLOW
========================================================= */

.treatment-card-inner-glow {
  opacity: 0;

  box-shadow:
    inset 0 0 35px
    rgba(188,206,141,.06);

  transition:
    opacity .5s ease;
}

.treatment-wow-card:hover
.treatment-card-inner-glow {
  opacity: 1;
}


/* =========================================================
   CARD GLASS SHINE
========================================================= */

.treatment-card-shine {
  width: 35%;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.12),
      rgba(255,255,255,.28),
      rgba(255,255,255,.12),
      transparent
    );

  transform:
    translateX(-350%)
    skewX(-18deg);
}

.treatment-wow-card:hover
.treatment-card-shine {
  animation:
    treatmentCardShine
    1.05s ease forwards;
}

@keyframes treatmentCardShine {
  to {
    transform:
      translateX(650%)
      skewX(-18deg);
  }
}


/* =========================================================
   L BORDER
========================================================= */

.treatment-border-horizontal {
  transform-origin:
    left center;

  transition:
    opacity .3s ease,
    transform .6s
      cubic-bezier(.16,1,.3,1);
}

.treatment-border-vertical {
  transform-origin:
    top center;

  transition:
    opacity .3s ease,
    transform .6s
      cubic-bezier(.16,1,.3,1)
      .08s;
}

.treatment-wow-card:hover
.treatment-border-horizontal {
  transform:
    scaleX(1.2);
}

.treatment-wow-card:hover
.treatment-border-vertical {
  transform:
    scaleY(1.2);
}


/* =========================================================
   CORNER DECORATION
========================================================= */

.treatment-corner {
  transform-origin:
    top left;

  transition:
    transform .75s
      cubic-bezier(.16,1,.3,1),
    filter .5s ease;
}

.treatment-wow-card:hover
.treatment-corner {
  transform:
    scale(1.08)
    rotate(2deg);

  filter:
    drop-shadow(
      3px 5px 8px
      rgba(0,0,0,.10)
    );
}


/* =========================================================
   ICON AREA
========================================================= */

.treatment-icon-zone {
  perspective:
    500px;

  transition:
    transform .6s
      cubic-bezier(.16,1,.3,1);
}

.treatment-wow-card:hover
.treatment-icon-zone {
  transform:
    translateY(-5px)
    scale(1.07);
}


/* =========================================================
   ICON
========================================================= */

.treatment-card-icon {
  transform-origin:
    center;

  animation:
    treatmentIconIdle
    4.2s ease-in-out infinite;

  transition:
    transform .65s
      cubic-bezier(.16,1,.3,1),
    filter .5s ease;
}

.treatment-wow-card:nth-child(2)
.treatment-card-icon {
  animation-delay: .6s;
}

.treatment-wow-card:nth-child(3)
.treatment-card-icon {
  animation-delay: 1.2s;
}

.treatment-wow-card:nth-child(4)
.treatment-card-icon {
  animation-delay: 1.8s;
}

@keyframes treatmentIconIdle {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -3px;
  }
}

.treatment-wow-card:hover
.treatment-card-icon {
  transform:
    scale(1.15)
    rotateY(14deg)
    rotateZ(-2deg);

  filter:
    drop-shadow(
      0 7px 7px
      rgba(188,206,141,.22)
    );
}


/* =========================================================
   ICON GLOW
========================================================= */

.treatment-icon-glow {
  opacity: 0;

  background:
    radial-gradient(
      circle,
      rgba(188,206,141,.35),
      rgba(188,206,141,.10) 48%,
      transparent 72%
    );

  filter:
    blur(5px);

  transform:
    scale(.4);

  transition:
    opacity .4s ease,
    transform .65s
      cubic-bezier(.16,1,.3,1);
}

.treatment-wow-card:hover
.treatment-icon-glow {
  opacity: 1;

  transform:
    scale(1.7);
}


/* =========================================================
   ICON ORBIT 1
========================================================= */

.treatment-icon-orbit {
  opacity: 0;

  border:
    1px dashed
    rgba(188,206,141,.45);

  transition:
    opacity .4s ease;
}

.treatment-wow-card:hover
.treatment-icon-orbit {
  opacity: 1;

  animation:
    treatmentOrbit
    4.5s linear infinite;
}

@keyframes treatmentOrbit {
  to {
    transform:
      rotate(360deg);
  }
}

.treatment-orbit-dot {
  position: absolute;

  top: -3px;
  left: 50%;

  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    #BCCE8D;

  box-shadow:
    0 0 8px
    rgba(188,206,141,.9);
}


/* =========================================================
   ICON ORBIT 2
========================================================= */

.treatment-icon-orbit-two {
  opacity: 0;

  border-top:
    1px solid
    rgba(255,255,255,.4);

  border-right:
    1px solid transparent;

  border-bottom:
    1px solid
    rgba(188,206,141,.3);

  border-left:
    1px solid transparent;

  transition:
    opacity .4s ease;
}

.treatment-wow-card:hover
.treatment-icon-orbit-two {
  opacity: 1;

  animation:
    treatmentOrbitReverse
    6s linear infinite;
}

@keyframes treatmentOrbitReverse {
  to {
    transform:
      rotate(-360deg);
  }
}

.treatment-orbit-dot-two {
  position: absolute;

  right: -2px;
  top: 50%;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background:
    white;
}


/* =========================================================
   ICON PULSE
========================================================= */

.treatment-icon-pulse {
  opacity: 0;

  border:
    1px solid
    rgba(188,206,141,.7);
}

.treatment-wow-card:hover
.treatment-icon-pulse {
  animation:
    treatmentIconPulse
    1.8s ease-out infinite;
}

@keyframes treatmentIconPulse {
  0% {
    opacity: .7;

    transform:
      scale(.65);
  }

  100% {
    opacity: 0;

    transform:
      scale(1.8);
  }
}


/* =========================================================
   SPARKS
========================================================= */

.treatment-spark {
  position: absolute;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background:
    #BCCE8D;

  opacity: 0;

  pointer-events:
    none;

  box-shadow:
    0 0 7px
    rgba(188,206,141,.8);
}

.treatment-spark-1 {
  top: 0;
  left: 4px;
}

.treatment-spark-2 {
  top: 4px;
  right: 0;
}

.treatment-spark-3 {
  left: 5px;
  bottom: 0;
}

.treatment-spark-4 {
  right: 3px;
  bottom: 3px;
}

.treatment-wow-card:hover
.treatment-spark-1 {
  animation:
    treatmentSparkOne
    1.5s ease-out infinite;
}

.treatment-wow-card:hover
.treatment-spark-2 {
  animation:
    treatmentSparkTwo
    1.8s .2s ease-out infinite;
}

.treatment-wow-card:hover
.treatment-spark-3 {
  animation:
    treatmentSparkThree
    1.7s .3s ease-out infinite;
}

.treatment-wow-card:hover
.treatment-spark-4 {
  animation:
    treatmentSparkFour
    1.6s .1s ease-out infinite;
}

@keyframes treatmentSparkOne {
  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
      translate(-9px,-12px)
      scale(1.3);
  }
}

@keyframes treatmentSparkTwo {
  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
      translate(10px,-10px);
  }
}

@keyframes treatmentSparkThree {
  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
      translate(-9px,10px);
  }
}

@keyframes treatmentSparkFour {
  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
      translate(10px,11px);
  }
}


/* =========================================================
   CARD TITLE
========================================================= */

.treatment-card-title {
  transition:
    transform .5s
      cubic-bezier(.16,1,.3,1),
    text-shadow .5s ease;
}

.treatment-wow-card:hover
.treatment-card-title {
  transform:
    translateX(4px);

  text-shadow:
    0 5px 14px
    rgba(0,0,0,.15);
}


/* =========================================================
   DESCRIPTION
========================================================= */

.treatment-card-description {
  transition:
    transform .55s
      cubic-bezier(.16,1,.3,1),
    opacity .4s ease;
}

.treatment-wow-card:hover
.treatment-card-description {
  transform:
    translateX(4px);

  opacity: .95;
}


/* =========================================================
   ARROW
========================================================= */

.treatment-arrow-wrapper {
  transition:
    transform .5s
      cubic-bezier(.16,1,.3,1);
}

.treatment-arrow {
  transition:
    transform .55s
      cubic-bezier(.16,1,.3,1),
    filter .4s ease;
}

.treatment-wow-card:hover
.treatment-arrow-wrapper {
  transform:
    translate(3px,-3px);
}

.treatment-wow-card:hover
.treatment-arrow {
  transform:
    rotate(-8deg)
    scale(1.08);

  filter:
    drop-shadow(
      0 6px 7px
      rgba(0,0,0,.18)
    );
}

.treatment-arrow-pulse {
  opacity: 0;

  border:
    1px solid
    rgba(188,206,141,.5);
}

.treatment-wow-card:hover
.treatment-arrow-pulse {
  animation:
    treatmentArrowPulse
    1.8s ease-out infinite;
}

@keyframes treatmentArrowPulse {
  0% {
    opacity: .6;

    transform:
      scale(.8);
  }

  100% {
    opacity: 0;

    transform:
      scale(1.5);
  }
}


/* =========================================================
   BOTTOM LIGHT
========================================================= */

.treatment-card-bottom-light {
  width: 60%;
  height: 60px;

  left: 20%;
  bottom: -55px;

  border-radius: 50%;

  opacity: 0;

  background:
    rgba(188,206,141,.15);

  filter:
    blur(20px);

  transition:
    opacity .5s ease,
    transform .7s ease;
}

.treatment-wow-card:hover
.treatment-card-bottom-light {
  opacity: 1;

  transform:
    translateY(-12px)
    scale(1.15);
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

  .treatment-wow-card:hover {
    transform:
      translateY(-5px);
  }

  .treatment-hero-image {
    animation-duration:
      7s;
  }
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .treatment-bg-drift,
  .treatment-ambient,
  .treatment-scan-light,
  .treatment-hero-image,
  .treatment-hero-aura,
  .hero-particle,
  .treatment-card-visible,
  .treatment-card-icon,
  .treatment-icon-orbit,
  .treatment-icon-orbit-two,
  .treatment-icon-pulse,
  .treatment-spark,
  .treatment-arrow-pulse {
    animation: none !important;
  }

  .treatment-content-reveal,
  .treatment-wow-card {
    opacity: 1 !important;

    transform: none !important;

    filter: none !important;
  }

  .treatment-divider {
    transform:
      scaleX(1) !important;
  }
}

      `}</style>
    </>
  );
}
