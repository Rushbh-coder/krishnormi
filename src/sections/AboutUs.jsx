import photoTop from "../assets/about/photo-2.png";
import photoBottom from "../assets/about/photo-4.png";
import ringDecor from "../assets/about/ellipse-decor.svg";
import dottedFace from "../assets/about/dotted-face-decor.svg";
import playRing from "../assets/about/ellipse-play-ring.svg";
import playTriangle from "../assets/about/play-triangle.svg";
import eyebrowIcon from "../assets/about/eyebrow-icon.svg";
import signatureBar from "../assets/about/signature-bar.svg";
import stethoscopeDecor from "../assets/about/stethoscope-decor.png";

import iconClinical from "../assets/about/icon-clinical-dermatology.svg";
import iconHairScalp from "../assets/about/icon-hair-scalp.svg";
import iconLaser from "../assets/about/icon-laser-dermatology.svg";
import iconAesthetic from "../assets/about/icon-aesthetic-dermatology.svg";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

import {
  useReducedMotion,
  useRevealOnce,
  revealClass,
} from "../hooks/useScrollReveal";

/* =========================================================
   FOCUS CARD ICONS
========================================================= */

const FOCUS_TEMPLATE = [
  {
    icon: iconClinical,
    width: 42,
    height: 46,
  },
  {
    icon: iconHairScalp,
    width: 42,
    height: 46,
    opacity: 0.7,
  },
  {
    icon: iconLaser,
    width: 46,
    height: 46,
  },
  {
    icon: iconAesthetic,
    width: 36,
    height: 46,
  },
];

/* =========================================================
   HIGHLIGHT KRISHNORMI
========================================================= */

function HighlightBrand({ text = "" }) {
  const index = text.indexOf("KRISHNORMI");

  if (index === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, index)}

      <span className="about-brand-highlight text-primary">KRISHNORMI</span>

      {text.slice(index + "KRISHNORMI".length)}
    </>
  );
}

/* =========================================================
   ABOUT US
========================================================= */

export default function AboutUs() {
  const { row, loading } = useSection("about");

  const content = row?.content ?? DEFAULT_CONTENT.about;

  const visible = row?.visible ?? true;

  const focusItems = content.focus_items ?? DEFAULT_CONTENT.about.focus_items;

  const reducedMotion = useReducedMotion();

  const [imageRef, imageVisible] = useRevealOnce(reducedMotion);

  const [textRef, textVisible] = useRevealOnce(reducedMotion);

  const [cardsRef, cardsVisible] = useRevealOnce(reducedMotion);

  if (!loading && !visible) {
    return null;
  }

  return (
    <>
      <section
        className="
          about-wow-section

          relative
          overflow-hidden

          bg-white

          pt-[75px]
          pb-[80px]

          max-[960px]:pt-[65px]

          max-[560px]:pt-[50px]
          max-[560px]:pb-[55px]
        "
      >
        {/* =====================================================
            SUBTLE BACKGROUND LIGHT
        ====================================================== */}

        {!reducedMotion && (
          <>
            <span
              className="
                about-bg-light
                pointer-events-none
                absolute
                top-[-200px]
                right-[-200px]
                z-0
                h-[550px]
                w-[550px]
                rounded-full
              "
              aria-hidden="true"
            />

            <span
              className="
                about-bg-light-two
                pointer-events-none
                absolute
                bottom-[-250px]
                left-[-250px]
                z-0
                h-[600px]
                w-[600px]
                rounded-full
              "
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
            z-[1]

            flex
            items-start
            gap-[55px]

            max-[1100px]:gap-[35px]

            max-[960px]:flex-col
          "
        >
          {/* =================================================
              LEFT IMAGE COMPOSITION
          ================================================== */}

          <div
            ref={imageRef}
            className={`
              about-image-composition

              relative

              aspect-[620/650]

              w-full
              max-w-[520px]

              flex-none

              max-[1100px]:max-w-[460px]

              max-[960px]:mx-auto
              max-[960px]:max-w-[520px]

              ${revealClass(imageVisible)}
            `}
          >
            {/* ===============================================
                GREEN DECORATIVE RING
            ================================================ */}

            <span
              className="
                about-green-ring

                pointer-events-none

                absolute

                top-[7%]
                left-[0%]

                z-[1]

                aspect-square
                w-[28%]

                bg-contain
                bg-center
                bg-no-repeat
              "
              style={{
                backgroundImage: `url(${ringDecor})`,
              }}
              aria-hidden="true"
            />

            {/* ===============================================
                TOP IMAGE
            ================================================ */}

            <div
              className="
                about-top-image-wrapper

                absolute

                top-[0%]
                left-[10%]

                z-[2]

                h-[64%]
                w-[57%]

                overflow-hidden

                shadow-[0_12px_30px_rgba(0,34,97,0.10)]
              "
            >
              <img
                src={content.photo_top_url || photoTop}
                width={467}
                height={583}
                alt="Dermatology treatment being performed at Krishnormi clinic"
                className="
                  about-top-image

                  h-full
                  w-full

                  object-cover
                "
              />

              <span
                className="about-image-shine pointer-events-none absolute inset-0"
                aria-hidden="true"
              />
            </div>

            {/* ===============================================
                HOW WE WORK
            ================================================ */}

            <span
              className="
                about-how-work

                absolute

                top-[15%]
                left-[64%]

                z-[5]

                whitespace-nowrap

                origin-center
                -rotate-90

                font-heading

                text-[15px]
                font-semibold

                text-navy

                max-[560px]:text-[12px]
              "
            >
              How We Work
            </span>

            {/* ===============================================
                PLAY BUTTON
            ================================================ */}

            <div
              className="
                about-play-button

                absolute

                top-[34%]
                left-[65%]

                z-[6]

                aspect-square
                w-[12%]
              "
            >
              <span
                className="about-play-pulse absolute inset-0 rounded-full"
                aria-hidden="true"
              />

              <span
                className="about-play-pulse-two absolute inset-0 rounded-full"
                aria-hidden="true"
              />

              <img
                src={playRing}
                alt=""
                aria-hidden="true"
                className="
                  about-play-ring

                  absolute
                  inset-0

                  h-full
                  w-full
                "
              />

              <img
                src={playTriangle}
                alt=""
                aria-hidden="true"
                className="
                  about-play-triangle

                  absolute

                  top-[34%]
                  left-[34%]

                  h-[32%]
                  w-[32%]
                "
              />
            </div>

            {/* ===============================================
                BOTTOM IMAGE
            ================================================ */}

            <div
              className="
                about-bottom-image-wrapper

                absolute

                top-[51%]
                left-[33%]

                z-[3]

                h-[45%]
                w-[61%]

                overflow-hidden

                shadow-[0_12px_30px_rgba(0,34,97,0.10)]
              "
            >
              <img
                src={content.photo_bottom_url || photoBottom}
                width={480}
                height={398}
                alt="Patient consultation at Krishnormi clinic"
                className="
                  about-bottom-image

                  h-full
                  w-full

                  object-cover
                "
              />

              <span
                className="about-image-shine-two pointer-events-none absolute inset-0"
                aria-hidden="true"
              />
            </div>

            {/* ===============================================
                EXPERIENCE BADGE
            ================================================ */}

            <div
              className="
                about-experience-badge

                absolute

                top-[48%]
                left-[18%]

                z-[7]

                flex

                aspect-square
                w-[28%]

                flex-col
                items-center
                justify-center

                overflow-hidden

                rounded-full

                border-[7px]
                border-white

                bg-navy

                text-center
                text-white

                shadow-[0_10px_24px_rgba(0,34,97,0.20)]
              "
            >
              <span
                className="about-badge-glow pointer-events-none absolute inset-0"
                aria-hidden="true"
              />

              <span
                className="about-badge-shine pointer-events-none absolute inset-0"
                aria-hidden="true"
              />

              <span
                className="
                  relative
                  z-[2]

                  font-heading

                  text-[clamp(23px,3vw,34px)]

                  leading-[1]
                  font-bold
                "
              >
                {content.badge_number}
              </span>

              <span
                className="
                  relative
                  z-[2]

                  mt-1

                  font-heading

                  text-[clamp(11px,1.5vw,15px)]

                  leading-[1.2]
                  font-medium
                "
              >
                {content.badge_label}
              </span>
            </div>

            {/* ===============================================
                DOTTED FACE
            ================================================ */}

            <img
              src={dottedFace}
              alt=""
              aria-hidden="true"
              className="
                about-dotted-face

                pointer-events-none

                absolute

                bottom-[4%]
                left-[7%]

                z-[1]

                w-[20%]

                opacity-90
              "
            />
          </div>

          {/* =================================================
              RIGHT CONTENT
          ================================================== */}

          <div
            ref={textRef}
            className={`
              relative

              min-w-0
              flex-1

              pt-[8px]
              pr-[80px]

              max-[1200px]:pr-[40px]

              max-[960px]:w-full
              max-[960px]:pr-0

              ${revealClass(textVisible)}
            `}
          >
            {/* ===============================================
                EYEBROW
            ================================================ */}

            <p
              className={`
                section-eyebrow

                about-content-reveal
                about-delay-1

                mb-[12px]

                flex
                items-center
                gap-2

                ${textVisible ? "about-content-visible" : ""}
              `}
            >
              <img
                src={eyebrowIcon}
                width={18}
                height={18}
                alt=""
                aria-hidden="true"
                className="about-eyebrow-icon"
              />

              {content.eyebrow_text}
            </p>

            {/* ===============================================
                HEADING
            ================================================ */}

            <h2
              className={`
                section-title

                about-content-reveal
                about-delay-2

                text-[clamp(26px,2.3vw,36px)]
                leading-[1.2]

                ${textVisible ? "about-content-visible" : ""}
              `}
            >
              <HighlightBrand text={content.heading} />
            </h2>

            {/* ===============================================
                DIVIDER
            ================================================ */}

            <hr
              className={`
                section-divider

                about-divider

                mt-[12px]
                mb-[18px]

                w-[125px]

                ${textVisible ? "about-divider-visible" : ""}
              `}
            />

            {/* ===============================================
                LEAD
            ================================================ */}

            <p
              className={`
                about-content-reveal
                about-delay-3

                font-heading

                text-[15px]
                leading-[1.5]
                font-semibold

                text-text-dark

                ${textVisible ? "about-content-visible" : ""}
              `}
            >
              {content.lead_text}
            </p>

            {/* ===============================================
                BODY 1
            ================================================ */}

            <p
              className={`
                about-content-reveal
                about-delay-4

                mt-[17px]

                max-w-[600px]

                font-body

                text-[14px]
                leading-[1.65]

                text-text

                ${textVisible ? "about-content-visible" : ""}
              `}
            >
              {content.body_text_1}
            </p>

            {/* ===============================================
                BODY 2
            ================================================ */}

            <p
              className={`
                about-content-reveal
                about-delay-5

                mt-[14px]

                max-w-[600px]

                font-body

                text-[14px]
                leading-[1.65]

                text-text

                ${textVisible ? "about-content-visible" : ""}
              `}
            >
              {content.body_text_2}
            </p>

            {/* ===============================================
                BODY 3
            ================================================ */}

            <p
              className={`
                about-content-reveal
                about-delay-6

                mt-[14px]

                max-w-[600px]

                font-body

                text-[14px]
                leading-[1.65]

                text-text

                ${textVisible ? "about-content-visible" : ""}
              `}
            >
              {content.body_text_3}
            </p>

            {/* ===============================================
                SIGNATURE
            ================================================ */}

            <div
              className={`
                about-content-reveal
                about-delay-7

                mt-[20px]

                flex

                max-w-[590px]
                gap-[12px]

                ${textVisible ? "about-content-visible" : ""}
              `}
            >
              <div className="about-signature-bar-wrapper overflow-hidden">
                <img
                  src={signatureBar}
                  alt=""
                  aria-hidden="true"
                  className="
                    about-signature-bar

                    h-full
                    w-[7px]
                    flex-none

                    object-fill
                  "
                />
              </div>

              <div className="about-signature-content">
                <p
                  className="
                    mb-[4px]

                    font-heading

                    text-[13px]
                    font-semibold

                    text-[#293253]
                  "
                >
                  {content.signature_role}
                </p>

                <p
                  className="
                    mb-[4px]

                    font-heading

                    text-[12px]
                    leading-[1.45]

                    text-[#636363]
                    italic
                  "
                >
                  {content.signature_note}
                </p>

                <p
                  className="
                    font-heading

                    text-[12px]
                    font-bold

                    text-[#636363]
                  "
                >
                  {content.signature_name}
                </p>
              </div>
            </div>

            {/* ===============================================
                CTA
            ================================================ */}

            <a
              href={content.cta_link || "#contact"}
              className={`
                btn-hero
                about-cta

                about-content-reveal
                about-delay-8

                relative
                overflow-hidden

                mt-[20px]

                inline-flex
                min-h-[38px]

                items-center
                justify-center

                px-[25px]
                py-[9px]

                text-[12px]

                ${textVisible ? "about-content-visible" : ""}
              `}
            >
              <span
                className="about-cta-shine pointer-events-none absolute inset-0"
                aria-hidden="true"
              />

              <span className="relative z-[2]">{content.cta_label}</span>
            </a>

            {/* ===============================================
                STETHOSCOPE
            ================================================ */}

            <img
              src={stethoscopeDecor}
              alt=""
              aria-hidden="true"
              className="
                about-stethoscope

                pointer-events-none

                absolute

                right-[-80px]
                bottom-[-20px]

                z-[0]

                hidden
                w-[150px]

                object-contain

                min-[1150px]:block
              "
            />
          </div>
        </div>

        {/* =====================================================
            FOCUS CARDS — HOVER ONLY
        ====================================================== */}

        <div className="container">
          <div
            ref={cardsRef}
            className={`
              mt-12

              grid
              grid-cols-4
              gap-5

              max-[960px]:grid-cols-2
              max-[560px]:grid-cols-1

              ${revealClass(cardsVisible)}
            `}
          >
            {FOCUS_TEMPLATE.map((template, i) => {
              const item = focusItems[i] ?? {};

              return (
                <div
                  key={i}
                  className={`
                    focus-wow-card

                    ${cardsVisible ? "focus-card-visible" : ""}

                    group

                    relative
                    overflow-hidden

                    rounded-[10px]

                    border-y-[3px]
                    border-y-[#A9A9A9]
                    border-x-accent

                    px-7
                    py-8

                    text-left

                    transition-all
                    duration-500
                    ease-out

                    hover:-translate-y-1
                    hover:border-y-accent
                    hover:border-y-[3px]

                    hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)]
                  `}
                  style={{
                    "--card-delay": `${i * 130}ms`,
                  }}
                >
                  {/* CARD SPOTLIGHT */}

                  <span
                    className="focus-card-spotlight pointer-events-none absolute inset-0 z-0"
                    aria-hidden="true"
                  />

                  {/* LIGHT SWEEP */}

                  <span
                    className="focus-card-shine pointer-events-none absolute inset-0 z-[1]"
                    aria-hidden="true"
                  />

                  {/* TOP BORDER */}

                  <span
                    className="
                      focus-border-light

                      pointer-events-none

                      absolute
                      top-0
                      left-0

                      z-[2]

                      h-[3px]
                      w-full
                    "
                    aria-hidden="true"
                  />

                  {/* BOTTOM BORDER */}

                  <span
                    className="
                      focus-border-light-bottom

                      pointer-events-none

                      absolute
                      bottom-0
                      left-0

                      z-[2]

                      h-[3px]
                      w-full
                    "
                    aria-hidden="true"
                  />

                  {/* =========================================
                      ICON
                  ========================================== */}

                  <div
                    className="
                      focus-icon-area

                      relative
                      z-[3]

                      mx-auto
                      mb-[26px]

                      flex
                      h-[58px]
                      w-[58px]

                      items-center
                      justify-center
                    "
                  >
                    <span
                      className="focus-icon-glow pointer-events-none absolute inset-0 rounded-full"
                      aria-hidden="true"
                    />

                    <span
                      className="focus-icon-orbit pointer-events-none absolute inset-[-7px] rounded-full"
                      aria-hidden="true"
                    >
                      <span className="focus-orbit-dot" />
                    </span>

                    <span
                      className="focus-icon-orbit-two pointer-events-none absolute inset-[-12px] rounded-full"
                      aria-hidden="true"
                    >
                      <span className="focus-orbit-dot-two" />
                    </span>

                    <span
                      className="focus-icon-pulse pointer-events-none absolute inset-[3px] rounded-full"
                      aria-hidden="true"
                    />

                    <span className="focus-spark focus-spark-1" />
                    <span className="focus-spark focus-spark-2" />
                    <span className="focus-spark focus-spark-3" />
                    <span className="focus-spark focus-spark-4" />

                    <img
                      className="
                        focus-card-icon

                        relative
                        z-[5]

                        block
                        object-contain
                      "
                      src={template.icon}
                      width={template.width}
                      height={template.height}
                      style={
                        template.opacity
                          ? { opacity: template.opacity }
                          : undefined
                      }
                      alt=""
                      aria-hidden="true"
                    />
                  </div>

                  {/* TITLE */}

                  <h3
                    className="
                      focus-card-title

                      relative
                      z-[3]

                      mb-3.5

                      line-clamp-1

                      font-heading
                      text-xl
                      font-semibold

                      text-navy

                      transition-colors
                      duration-300

                      group-hover:text-accent
                    "
                  >
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      focus-card-description

                      relative
                      z-[3]

                      line-clamp-4

                      font-body

                      text-[15px]
                      leading-[1.6]

                      text-text
                    "
                  >
                    {item.description}
                  </p>

                  <span
                    className="
                      focus-corner-glow

                      pointer-events-none

                      absolute

                      -right-12
                      -bottom-12

                      z-0

                      h-28
                      w-28

                      rounded-full
                    "
                    aria-hidden="true"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          ALL ANIMATIONS
      ====================================================== */}

      <style>{`

/* =========================================================
   BACKGROUND LIGHT
========================================================= */

.about-bg-light {
  background:
    radial-gradient(
      circle,
      rgba(188,206,141,.14),
      rgba(188,206,141,.04) 45%,
      transparent 70%
    );

  filter: blur(25px);

  animation:
    aboutBgFloat 10s
    ease-in-out infinite alternate;
}

.about-bg-light-two {
  background:
    radial-gradient(
      circle,
      rgba(0,34,97,.045),
      transparent 70%
    );

  filter: blur(30px);

  animation:
    aboutBgFloatTwo 13s
    ease-in-out infinite alternate;
}

@keyframes aboutBgFloat {
  from {
    transform: translate(0,0) scale(1);
  }

  to {
    transform: translate(-70px,70px) scale(1.15);
  }
}

@keyframes aboutBgFloatTwo {
  from {
    transform: translate(0,0);
  }

  to {
    transform: translate(80px,-40px);
  }
}


/* =========================================================
   IMAGE COMPOSITION
========================================================= */

.about-image-composition {
  perspective: 1000px;
}


/* =========================================================
   GREEN RING
========================================================= */

.about-green-ring {
  transform-origin: center;

  animation:
    aboutRingRotate 16s
    linear infinite;
}

@keyframes aboutRingRotate {
  0% {
    transform:
      rotate(0deg)
      scale(1);
  }

  50% {
    transform:
      rotate(180deg)
      scale(1.05);
  }

  100% {
    transform:
      rotate(360deg)
      scale(1);
  }
}


/* =========================================================
   TOP IMAGE
========================================================= */

.about-top-image-wrapper {
  transition:
    transform .8s cubic-bezier(.16,1,.3,1),
    box-shadow .6s ease;
}

.about-top-image {
  transition:
    transform 1.1s
    cubic-bezier(.16,1,.3,1);
}

.about-image-composition:hover
.about-top-image-wrapper {
  transform:
    translateY(-6px)
    rotate(-.5deg);

  box-shadow:
    0 20px 40px
    rgba(0,34,97,.14);
}

.about-image-composition:hover
.about-top-image {
  transform: scale(1.045);
}


/* =========================================================
   IMAGE SHINE
========================================================= */

.about-image-shine,
.about-image-shine-two {
  width: 40%;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.45),
      transparent
    );

  transform:
    translateX(-300%)
    skewX(-15deg);
}

.about-image-composition:hover
.about-image-shine {
  animation:
    aboutImageShine 1.2s
    ease forwards;
}

.about-image-composition:hover
.about-image-shine-two {
  animation:
    aboutImageShine 1.2s
    .15s ease forwards;
}

@keyframes aboutImageShine {
  to {
    transform:
      translateX(600%)
      skewX(-15deg);
  }
}


/* =========================================================
   BOTTOM IMAGE
========================================================= */

.about-bottom-image-wrapper {
  transition:
    transform .8s
    cubic-bezier(.16,1,.3,1),
    box-shadow .6s ease;
}

.about-bottom-image {
  transition:
    transform 1.1s
    cubic-bezier(.16,1,.3,1);
}

.about-image-composition:hover
.about-bottom-image-wrapper {
  transform:
    translate(5px,5px)
    rotate(.5deg);

  box-shadow:
    0 20px 40px
    rgba(0,34,97,.14);
}

.about-image-composition:hover
.about-bottom-image {
  transform: scale(1.045);
}


/* =========================================================
   HOW WE WORK
========================================================= */

.about-how-work {
  animation:
    aboutHowWork 4s
    ease-in-out infinite;
}

@keyframes aboutHowWork {
  0%,
  100% {
    letter-spacing: 0;
  }

  50% {
    letter-spacing: 1px;
  }
}


/* =========================================================
   PLAY BUTTON
========================================================= */

.about-play-button {
  transition:
    transform .5s
    cubic-bezier(.16,1,.3,1);
}

.about-play-button:hover {
  transform: scale(1.12);
}

.about-play-ring {
  animation:
    aboutPlayRotate 10s
    linear infinite;
}

@keyframes aboutPlayRotate {
  to {
    transform: rotate(360deg);
  }
}

.about-play-triangle {
  animation:
    aboutTriangle 2.2s
    ease-in-out infinite;
}

@keyframes aboutTriangle {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }
}

.about-play-pulse,
.about-play-pulse-two {
  border:
    1px solid
    rgba(188,206,141,.7);

  opacity: 0;

  animation:
    aboutPlayPulse
    2.3s ease-out infinite;
}

.about-play-pulse-two {
  animation-delay: 1.1s;
}

@keyframes aboutPlayPulse {
  0% {
    opacity: .7;
    transform: scale(.75);
  }

  100% {
    opacity: 0;
    transform: scale(1.7);
  }
}


/* =========================================================
   EXPERIENCE BADGE
========================================================= */

.about-experience-badge {
  animation:
    aboutBadgeFloat
    4.5s ease-in-out infinite;

  transition:
    transform .6s
    cubic-bezier(.16,1,.3,1),
    box-shadow .5s ease;
}

@keyframes aboutBadgeFloat {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -6px;
  }
}

.about-experience-badge:hover {
  scale: 1.05;

  box-shadow:
    0 18px 35px
    rgba(0,34,97,.28);
}

.about-badge-glow {
  background:
    radial-gradient(
      circle at 50% 50%,
      rgba(255,255,255,.12),
      transparent 65%
    );

  animation:
    aboutBadgeGlow
    3s ease-in-out infinite;
}

@keyframes aboutBadgeGlow {
  50% {
    transform: scale(1.2);
    opacity: .5;
  }
}

.about-badge-shine {
  width: 30%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.28),
      transparent
    );

  transform:
    translateX(-300%)
    skewX(-20deg);

  animation:
    aboutBadgeShine
    5s ease-in-out infinite;
}

@keyframes aboutBadgeShine {
  0%,
  65% {
    transform:
      translateX(-300%)
      skewX(-20deg);
  }

  100% {
    transform:
      translateX(600%)
      skewX(-20deg);
  }
}


/* =========================================================
   DOTTED FACE
========================================================= */

.about-dotted-face {
  animation:
    aboutDots
    6s ease-in-out infinite;
}

@keyframes aboutDots {
  0%,
  100% {
    transform:
      translateY(0)
      rotate(0deg);
  }

  50% {
    transform:
      translateY(-6px)
      rotate(2deg);
  }
}


/* =========================================================
   CONTENT REVEAL
========================================================= */

.about-content-reveal {
  opacity: 0;

  transform:
    translateY(20px);

  filter: blur(2px);

  transition:
    opacity .8s
    cubic-bezier(.16,1,.3,1),
    transform .8s
    cubic-bezier(.16,1,.3,1),
    filter .8s ease;

  transition-delay:
    var(--about-delay, 0ms);
}

.about-content-visible {
  opacity: 1;

  transform:
    translateY(0);

  filter: blur(0);
}

.about-delay-1 {
  --about-delay: 80ms;
}

.about-delay-2 {
  --about-delay: 150ms;
}

.about-delay-3 {
  --about-delay: 230ms;
}

.about-delay-4 {
  --about-delay: 310ms;
}

.about-delay-5 {
  --about-delay: 390ms;
}

.about-delay-6 {
  --about-delay: 470ms;
}

.about-delay-7 {
  --about-delay: 550ms;
}

.about-delay-8 {
  --about-delay: 630ms;
}


/* =========================================================
   EYEBROW ICON
========================================================= */

.about-eyebrow-icon {
  animation:
    aboutEyebrowIcon
    3s ease-in-out infinite;
}

@keyframes aboutEyebrowIcon {
  0%,
  100% {
    transform:
      translateY(0)
      rotate(0);
  }

  50% {
    transform:
      translateY(-2px)
      rotate(8deg);
  }
}


/* =========================================================
   BRAND
========================================================= */

.about-brand-highlight {
  position: relative;

  display: inline-block;

  animation:
    aboutBrandGlow
    4s ease-in-out infinite;
}

@keyframes aboutBrandGlow {
  0%,
  100% {
    filter:
      drop-shadow(
        0 0 0
        rgba(188,206,141,0)
      );
  }

  50% {
    filter:
      drop-shadow(
        0 3px 5px
        rgba(188,206,141,.20)
      );
  }
}


/* =========================================================
   DIVIDER
========================================================= */

.about-divider {
  transform:
    scaleX(0);

  transform-origin:
    left center;

  transition:
    transform 1s
    cubic-bezier(.16,1,.3,1)
    .25s;
}

.about-divider-visible {
  transform:
    scaleX(1);
}


/* =========================================================
   SIGNATURE
========================================================= */

.about-signature-bar-wrapper {
  width: 7px;
  flex: none;
}

.about-signature-bar {
  transform:
    translateY(-100%);

  animation:
    aboutSignatureBar
    1.1s
    cubic-bezier(.16,1,.3,1)
    .8s forwards;
}

@keyframes aboutSignatureBar {
  to {
    transform:
      translateY(0);
  }
}

.about-signature-content {
  transition:
    transform .45s ease;
}

.about-signature-content:hover {
  transform:
    translateX(3px);
}


/* =========================================================
   CTA
========================================================= */

.about-cta {
  transition:
    transform .4s
    cubic-bezier(.16,1,.3,1),
    box-shadow .4s ease;
}

.about-cta:hover {
  transform:
    translateY(-3px);

  box-shadow:
    0 10px 24px
    rgba(0,34,97,.16);
}

.about-cta-shine {
  width: 35%;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.45),
      transparent
    );

  transform:
    translateX(-300%)
    skewX(-20deg);
}

.about-cta:hover
.about-cta-shine {
  animation:
    aboutCTAshine
    .8s ease forwards;
}

@keyframes aboutCTAshine {
  to {
    transform:
      translateX(600%)
      skewX(-20deg);
  }
}


/* =========================================================
   STETHOSCOPE
========================================================= */

.about-stethoscope {
  transform-origin:
    top center;

  animation:
    aboutStethoscope
    6s ease-in-out infinite;
}

@keyframes aboutStethoscope {
  0%,
  100% {
    transform:
      translateY(0)
      rotate(-1deg);
  }

  50% {
    transform:
      translateY(-7px)
      rotate(2deg);
  }
}


/* =========================================================
   FOCUS CARDS
========================================================= */

.focus-wow-card {
  cursor: default;

  isolation: isolate;

  transform-style:
    preserve-3d;

  opacity: 0;

  transform:
    translateY(35px)
    scale(.96);

  filter: blur(3px);
}

.focus-card-visible {
  animation:
    focusCardEntrance
    .9s
    cubic-bezier(.16,1,.3,1)
    forwards;

  animation-delay:
    var(--card-delay);
}

@keyframes focusCardEntrance {
  0% {
    opacity: 0;

    transform:
      translateY(35px)
      scale(.96);

    filter: blur(3px);
  }

  70% {
    opacity: 1;

    transform:
      translateY(-3px)
      scale(1.005);

    filter: blur(0);
  }

  100% {
    opacity: 1;

    transform:
      translateY(0)
      scale(1);

    filter: blur(0);
  }
}

.focus-wow-card:hover {
  transform:
    translateY(-8px)
    scale(1.012);

  box-shadow:
    0 18px 38px
    rgba(0,34,97,.10),
    0 6px 14px
    rgba(0,34,97,.05);
}


/* =========================================================
   CARD SPOTLIGHT
========================================================= */

.focus-card-spotlight {
  opacity: 0;

  background:
    radial-gradient(
      circle at 50% 20%,
      rgba(188,206,141,.22),
      transparent 57%
    );

  transform:
    scale(.7);

  transition:
    opacity .5s ease,
    transform .7s
    cubic-bezier(.16,1,.3,1);
}

.focus-wow-card:hover
.focus-card-spotlight {
  opacity: 1;

  transform:
    scale(1.25);
}


/* =========================================================
   CARD SHINE
========================================================= */

.focus-card-shine {
  width: 38%;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.7),
      transparent
    );

  transform:
    translateX(-300%)
    skewX(-18deg);
}

.focus-wow-card:hover
.focus-card-shine {
  animation:
    focusCardShine
    1s ease forwards;
}

@keyframes focusCardShine {
  to {
    transform:
      translateX(600%)
      skewX(-18deg);
  }
}


/* =========================================================
   CARD BORDERS
========================================================= */

.focus-border-light,
.focus-border-light-bottom {
  transform:
    scaleX(0);

  background:
    linear-gradient(
      90deg,
      transparent,
      #14db8c,
      #23b95c,
      #248612,
      transparent
    );

  transition:
    transform .7s
    cubic-bezier(.16,1,.3,1);
}

.focus-border-light {
  transform-origin: left;
}

.focus-border-light-bottom {
  transform-origin: right;
}

.focus-wow-card:hover
.focus-border-light,
.focus-wow-card:hover
.focus-border-light-bottom {
  transform:
    scaleX(1);
}


/* =========================================================
   ICON AREA
========================================================= */

.focus-icon-area {
  perspective: 600px;

  transition:
    transform .6s
    cubic-bezier(.16,1,.3,1);
}

.focus-wow-card:hover
.focus-icon-area {
  transform:
    translateY(-4px)
    scale(1.08);
}


/* =========================================================
   ICON
========================================================= */

.focus-card-icon {
  transform-origin: center;

  animation:
    focusIconIdle
    4s ease-in-out infinite;

  transition:
    transform .6s
    cubic-bezier(.16,1,.3,1),
    filter .5s ease;
}

@keyframes focusIconIdle {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -3px;
  }
}

.focus-wow-card:nth-child(2)
.focus-card-icon {
  animation-delay: .5s;
}

.focus-wow-card:nth-child(3)
.focus-card-icon {
  animation-delay: 1s;
}

.focus-wow-card:nth-child(4)
.focus-card-icon {
  animation-delay: 1.5s;
}

.focus-wow-card:hover
.focus-card-icon {
  transform:
    scale(1.12)
    rotateY(12deg);

  filter:
    drop-shadow(
      0 8px 7px
      rgba(0,34,97,.15)
    );
}


/* =========================================================
   ICON GLOW
========================================================= */

.focus-icon-glow {
  opacity: 0;

  background:
    radial-gradient(
      circle,
      rgba(188,206,141,.45),
      rgba(188,206,141,.15) 45%,
      transparent 72%
    );

  filter:
    blur(4px);

  transform:
    scale(.5);

  transition:
    opacity .4s ease,
    transform .6s ease;
}

.focus-wow-card:hover
.focus-icon-glow {
  opacity: 1;

  transform:
    scale(1.6);
}


/* =========================================================
   ICON ORBITS
========================================================= */

.focus-icon-orbit {
  opacity: 0;

  border:
    1px dashed
    rgba(73, 97, 0, 0.2);
}

.focus-wow-card:hover
.focus-icon-orbit {
  opacity: 1;

  animation:
    focusOrbit
    4.5s linear infinite;
}

@keyframes focusOrbit {
  to {
    transform:
      rotate(360deg);
  }
}

.focus-icon-orbit-two {
  opacity: 0;

  border-top:
    1px solid
    rgba(188,206,141,.75);

  border-right:
    1px solid transparent;

  border-bottom:
    1px solid
    rgba(0,34,97,.18);

  border-left:
    1px solid transparent;
}

.focus-wow-card:hover
.focus-icon-orbit-two {
  opacity: 1;

  animation:
    focusOrbitReverse
    6s linear infinite;
}

@keyframes focusOrbitReverse {
  to {
    transform:
      rotate(-360deg);
  }
}

.focus-orbit-dot {
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

.focus-orbit-dot-two {
  position: absolute;

  right: -2px;
  top: 50%;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background:
    #1B3B13;
}


/* =========================================================
   ICON PULSE
========================================================= */

.focus-icon-pulse {
  opacity: 0;

  border:
    1px solid
    rgba(188,206,141,.75);
}

.focus-wow-card:hover
.focus-icon-pulse {
  animation:
    focusPulse
    1.8s ease-out infinite;
}

@keyframes focusPulse {
  0% {
    opacity: .65;

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
   SPARKLES
========================================================= */

.focus-spark {
  position: absolute;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background:
    #BCCE8D;

  opacity: 0;

  pointer-events: none;

  box-shadow:
    0 0 5px
    rgba(188,206,141,.8);
}

.focus-spark-1 {
  top: 2px;
  left: 5px;
}

.focus-spark-2 {
  top: 5px;
  right: 3px;
}

.focus-spark-3 {
  bottom: 2px;
  left: 8px;
}

.focus-spark-4 {
  right: 5px;
  bottom: 4px;
}

.focus-wow-card:hover
.focus-spark-1 {
  animation:
    sparkOne
    1.5s ease-out infinite;
}

.focus-wow-card:hover
.focus-spark-2 {
  animation:
    sparkTwo
    1.8s .2s ease-out infinite;
}

.focus-wow-card:hover
.focus-spark-3 {
  animation:
    sparkThree
    1.7s .3s ease-out infinite;
}

.focus-wow-card:hover
.focus-spark-4 {
  animation:
    sparkFour
    1.6s .1s ease-out infinite;
}

@keyframes sparkOne {
  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
      translate(-9px,-12px)
      scale(1.3);
  }
}

@keyframes sparkTwo {
  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
      translate(10px,-10px);
  }
}

@keyframes sparkThree {
  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
      translate(-9px,10px);
  }
}

@keyframes sparkFour {
  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;

    transform:
      translate(10px,11px);
  }
}


/* =========================================================
   CARD TEXT
========================================================= */

.focus-card-title,
.focus-card-description {
  transition:
    transform .5s
    cubic-bezier(.16,1,.3,1);
}

.focus-wow-card:hover
.focus-card-title,
.focus-wow-card:hover
.focus-card-description {
  transform:
    translateX(4px);
}


/* =========================================================
   CORNER GLOW
========================================================= */

.focus-corner-glow {
  opacity: 0;

  background:
    radial-gradient(
      circle,
      rgba(178, 245, 8, 0.3),
      transparent 68%
    );

  filter:
    blur(10px);

  transform:
    scale(.5);

  transition:
    opacity .6s ease,
    transform .8s ease;
}

.focus-wow-card:hover
.focus-corner-glow {
  opacity: 1;

  transform:
    scale(1.5);
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .about-bg-light,
  .about-bg-light-two,
  .about-green-ring,
  .about-play-ring,
  .about-play-triangle,
  .about-play-pulse,
  .about-play-pulse-two,
  .about-experience-badge,
  .about-badge-glow,
  .about-badge-shine,
  .about-dotted-face,
  .about-eyebrow-icon,
  .about-brand-highlight,
  .about-stethoscope,
  .focus-wow-card,
  .focus-card-icon,
  .focus-icon-orbit,
  .focus-icon-orbit-two,
  .focus-icon-pulse,
  .focus-spark {
    animation: none !important;
  }

  .about-content-reveal,
  .focus-wow-card {
    opacity: 1 !important;

    transform: none !important;

    filter: none !important;
  }

  .about-divider {
    transform:
      scaleX(1) !important;
  }
}

      `}</style>
    </>
  );
}
