import bgImage from "../assets/awards/awards-bg.png";
import doctorPhoto from "../assets/awards/doctor-award-photo.png";
import iconExperience from "../assets/awards/icon-experience.svg";
import iconAcademic from "../assets/awards/icon-academic.svg";
import iconTeaching from "../assets/awards/icon-teaching.svg";
import iconParticipation from "../assets/awards/icon-participation.svg";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import {
  useReducedMotion,
  useRevealOnce,
  revealClass,
} from "../hooks/useScrollReveal";

// Fallback icon per card slot
const TEMPLATE = [
  { icon: iconExperience, width: 46, height: 46 },
  { icon: iconAcademic, width: 47, height: 47 },
  { icon: iconTeaching, width: 45, height: 48 },
  { icon: iconParticipation, width: 48, height: 48 },
];

export default function Awards() {
  const { row, loading } = useSection("awards");

  const content = row?.content ?? DEFAULT_CONTENT.awards;
  const visible = row?.visible ?? true;
  const cards = content.cards ?? DEFAULT_CONTENT.awards.cards;

  const reducedMotion = useReducedMotion();

  const [photoRef, photoVisible] = useRevealOnce(reducedMotion);
  const [textRef, textVisible] = useRevealOnce(reducedMotion);

  if (!loading && !visible) return null;

  return (
    <>
      <section className="awards-section relative overflow-hidden bg-[#f3f1e9] pt-[100px] pb-[90px] max-[560px]:pt-16 max-[560px]:pb-14">
        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <div
          className={`absolute inset-0 z-0 ${
            reducedMotion ? "" : "awards-bg-animation"
          }`}
          aria-hidden="true"
        >
          <img
            className="h-full w-full object-cover object-center"
            src={bgImage}
            alt=""
          />
        </div>

        {/* Very subtle animated light */}
        {!reducedMotion && (
          <div
            className="awards-light pointer-events-none absolute inset-0 z-0"
            aria-hidden="true"
          />
        )}

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="container relative z-[1] flex flex-wrap items-start gap-[58px] max-[960px]:flex-col max-[960px]:items-center">
          {/* ===================================================
              DOCTOR PHOTO
          ==================================================== */}

          <div
            ref={photoRef}
            className={`
              awards-photo-wrapper
              aspect-[520/970]
              w-full
              max-w-[490px]
              flex-1
              basis-[420px]
              max-[960px]:max-w-[420px]
              ${revealClass(photoVisible)}
            `}
          >
            <div
              className={`
                awards-photo-inner
                relative
                h-full
                w-full
                overflow-hidden
                ${!reducedMotion && photoVisible ? "awards-photo-active" : ""}
              `}
            >
              <img
                className="
                  awards-doctor-image
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-[1200ms]
                  ease-out
                "
                src={content.photo_url || doctorPhoto}
                width={520}
                height={970}
                alt="Dr. Deepa K. Bhatt receiving a professional recognition award"
              />

              {/* Image shine */}
              {!reducedMotion && (
                <div
                  className="awards-photo-shine pointer-events-none absolute inset-0"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>

          {/* ===================================================
              TEXT CONTENT
          ==================================================== */}

          <div
            ref={textRef}
            className={`
              max-w-[876px]
              flex-1
              basis-[520px]
              max-[960px]:max-w-full
              ${revealClass(textVisible)}
            `}
          >
            {/* TITLE */}

            <div
              className={
                !reducedMotion && textVisible
                  ? "awards-reveal awards-delay-1"
                  : ""
              }
            >
              <h2 className="section-title text-[45px] leading-[1.3] text-navy max-[560px]:text-[32px]">
                {content.title}
              </h2>
            </div>

            {/* DIVIDER */}

            <div className="overflow-hidden">
              <hr
                className={`
                  section-divider
                  w-[205px]
                  origin-left
                  ${
                    !reducedMotion && textVisible ? "awards-divider-active" : ""
                  }
                `}
              />
            </div>

            {/* SUBTITLE */}

            <div
              className={
                !reducedMotion && textVisible
                  ? "awards-reveal awards-delay-2"
                  : ""
              }
            >
              <h3 className="mt-7 font-heading text-[23px] leading-[1.55] font-semibold text-text-dark">
                {content.subtitle}
              </h3>
            </div>

            {/* BODY 1 */}

            <div
              className={
                !reducedMotion && textVisible
                  ? "awards-reveal awards-delay-3"
                  : ""
              }
            >
              <p className="mt-4 font-body text-lg leading-[1.65] text-text">
                {content.body_text_1}
              </p>
            </div>

            {/* BODY 2 */}

            <div
              className={
                !reducedMotion && textVisible
                  ? "awards-reveal awards-delay-4"
                  : ""
              }
            >
              <p className="mt-4 font-body text-lg leading-[1.65] text-text">
                {content.body_text_2}
              </p>
            </div>

            {/* HIGHLIGHTS TITLE */}

            <div
              className={
                !reducedMotion && textVisible
                  ? "awards-reveal awards-delay-5"
                  : ""
              }
            >
              <h4 className="mt-[26px] mb-1 font-heading text-xl font-semibold text-text-dark">
                {content.highlights_title}
              </h4>
            </div>

            {/* HIGHLIGHTS TEXT */}

            <div
              className={
                !reducedMotion && textVisible
                  ? "awards-reveal awards-delay-6"
                  : ""
              }
            >
              <p className="mt-4 font-body text-lg leading-[1.65] text-text">
                {content.highlights_text}
              </p>
            </div>

            {/* =================================================
                CARDS
            ================================================== */}

            <div className="mt-7 grid grid-cols-2 gap-6 max-[560px]:grid-cols-1">
              {cards.map((card, i) => {
                const template = TEMPLATE[i] ?? {};

                return (
                  <div
                    key={i}
                    className={`
          awards-card
          awards-wow-card
          group
          relative
          flex
          items-start
          gap-[18px]
          overflow-hidden
          border
          border-[#d4d4d4]
          bg-white/75
          p-[24px_22px]
          backdrop-blur-[5px]
          ${!reducedMotion && textVisible ? "awards-card-visible" : ""}
        `}
                    style={{
                      animationDelay: `${650 + i * 140}ms`,
                    }}
                    onMouseMove={(e) => {
                      if (reducedMotion) return;

                      const card = e.currentTarget;
                      const rect = card.getBoundingClientRect();

                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;

                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;

                      const rotateX = ((y - centerY) / centerY) * -3;

                      const rotateY = ((x - centerX) / centerX) * 3;

                      card.style.setProperty("--mouse-x", `${x}px`);
                      card.style.setProperty("--mouse-y", `${y}px`);
                      card.style.setProperty("--rotate-x", `${rotateX}deg`);
                      card.style.setProperty("--rotate-y", `${rotateY}deg`);
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget;

                      card.style.setProperty("--rotate-x", "0deg");
                      card.style.setProperty("--rotate-y", "0deg");
                    }}
                  >
                    {/* Mouse spotlight */}
                    <span
                      className="awards-card-spotlight pointer-events-none absolute inset-0 z-0"
                      aria-hidden="true"
                    />

                    {/* moving shine */}
                    <span
                      className="awards-card-shine pointer-events-none absolute inset-0 z-[1]"
                      aria-hidden="true"
                    />

                    {/* animated top border */}
                    <span
                      className="awards-card-border pointer-events-none absolute left-0 top-0 z-[3] h-[2px] w-full"
                      aria-hidden="true"
                    />

                    {/* =========================================
            ICON / LOGO WOW EFFECT
        ========================================== */}

                    <div className="awards-icon-zone relative z-[4] flex h-[58px] w-[58px] flex-none items-center justify-center">
                      {/* outer rotating ring */}
                      <span
                        className="awards-icon-ring pointer-events-none absolute inset-0 rounded-full"
                        aria-hidden="true"
                      />

                      {/* second reverse ring */}
                      <span
                        className="awards-icon-ring-two pointer-events-none absolute inset-[5px] rounded-full"
                        aria-hidden="true"
                      />

                      {/* glow */}
                      <span
                        className="awards-icon-glow pointer-events-none absolute inset-[8px] rounded-full"
                        aria-hidden="true"
                      />

                      {/* pulse circle */}
                      <span
                        className="awards-icon-pulse pointer-events-none absolute inset-[10px] rounded-full"
                        aria-hidden="true"
                      />

                      {/* particles */}
                      <span className="awards-particle awards-particle-1" />
                      <span className="awards-particle awards-particle-2" />
                      <span className="awards-particle awards-particle-3" />
                      <span className="awards-particle awards-particle-4" />

                      <img
                        className="awards-card-icon relative z-[5] block flex-none object-contain"
                        src={template.icon}
                        width={template.width}
                        height={template.height}
                        alt=""
                        aria-hidden="true"
                      />
                    </div>

                    {/* TEXT */}

                    <div className="relative z-[4] min-w-0">
                      <h5 className="awards-card-title mb-2 line-clamp-2 font-heading text-xl font-semibold text-navy">
                        {card.title}
                      </h5>

                      <p className="awards-card-description font-body text-base leading-[1.5] text-text">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`

        /* =====================================================
           BACKGROUND CINEMATIC MOVEMENT
        ====================================================== */

        .awards-bg-animation {
          transform: scale(1.03);
          animation: awardsBackground 18s ease-in-out infinite alternate;
          will-change: transform;
        }

        @keyframes awardsBackground {
          0% {
            transform: scale(1.03) translate3d(0px, 0px, 0);
          }

          50% {
            transform: scale(1.065) translate3d(-8px, -5px, 0);
          }

          100% {
            transform: scale(1.04) translate3d(7px, 4px, 0);
          }
        }


        /* =====================================================
           BACKGROUND LIGHT
        ====================================================== */

        .awards-light {
          background:
            radial-gradient(
              circle at 20% 35%,
              rgba(255,255,255,0.26),
              transparent 28%
            );

          animation: awardsLightMove 9s ease-in-out infinite alternate;
        }

        @keyframes awardsLightMove {
          from {
            opacity: .4;
            transform: translateX(-2%);
          }

          to {
            opacity: .8;
            transform: translateX(4%);
          }
        }


        /* =====================================================
           PHOTO
        ====================================================== */

        .awards-photo-inner {
          transform: translateZ(0);
        }

        .awards-photo-active {
          animation: awardsPhotoFloat 7s ease-in-out 1.1s infinite;
        }

        @keyframes awardsPhotoFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        .awards-photo-wrapper:hover .awards-doctor-image {
          transform: scale(1.035);
        }


        /* =====================================================
           PHOTO LIGHT SWEEP
        ====================================================== */

        .awards-photo-shine {
          background:
            linear-gradient(
              115deg,
              transparent 25%,
              rgba(255,255,255,0.05) 40%,
              rgba(255,255,255,0.30) 50%,
              rgba(255,255,255,0.05) 60%,
              transparent 75%
            );

          transform: translateX(-140%);
          animation: awardsPhotoShine 7s ease-in-out 2s infinite;
        }

        @keyframes awardsPhotoShine {
          0%,
          65% {
            transform: translateX(-140%);
          }

          90%,
          100% {
            transform: translateX(140%);
          }
        }


        /* =====================================================
           TEXT REVEAL
        ====================================================== */

        .awards-reveal {
          opacity: 0;
          transform: translateY(22px);
          animation: awardsReveal .85s cubic-bezier(.22,1,.36,1) forwards;
        }

        @keyframes awardsReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .awards-delay-1 {
          animation-delay: 80ms;
        }

        .awards-delay-2 {
          animation-delay: 170ms;
        }

        .awards-delay-3 {
          animation-delay: 260ms;
        }

        .awards-delay-4 {
          animation-delay: 350ms;
        }

        .awards-delay-5 {
          animation-delay: 440ms;
        }

        .awards-delay-6 {
          animation-delay: 530ms;
        }


        /* =====================================================
           DIVIDER DRAW
        ====================================================== */

        .awards-divider-active {
          transform: scaleX(0);
          animation: awardsDivider .9s cubic-bezier(.22,1,.36,1)
            220ms forwards;
        }

        @keyframes awardsDivider {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }


        /* =====================================================
           CARD ENTRANCE
        ====================================================== */

        .awards-card-visible {
          opacity: 0;
          transform: translateY(28px) scale(.975);

          animation:
            awardsCardEntrance
            .8s
            cubic-bezier(.22,1,.36,1)
            forwards;
        }

        @keyframes awardsCardEntrance {
          from {
            opacity: 0;
            transform: translateY(28px) scale(.975);
          }

          to {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }


        /* =====================================================
           CARD HOVER
        ====================================================== */

        .awards-card {
          transform-style: preserve-3d;

          transition:
            transform .45s cubic-bezier(.22,1,.36,1),
            box-shadow .45s ease,
            border-color .45s ease,
            background-color .45s ease;
        }

        .awards-card:hover {
          transform: translateY(-7px);
          border-color: rgba(27,59,19,.22);
          background-color: rgba(255,255,255,.90);

          box-shadow:
            0 18px 45px rgba(0,0,0,.07),
            0 4px 12px rgba(0,0,0,.03);
        }


        /* =====================================================
           CARD LIGHT SWEEP
        ====================================================== */

        .awards-card-shine {
          background:
            linear-gradient(
              110deg,
              transparent 25%,
              rgba(255,255,255,.65) 48%,
              transparent 70%
            );

          transform: translateX(-150%);
          transition: transform .8s ease;
        }

        .awards-card:hover .awards-card-shine {
          transform: translateX(150%);
        }

        /* =========================================================
   WOW CARD
========================================================= */

.awards-wow-card {
  --mouse-x: 50%;
  --mouse-y: 50%;
  --rotate-x: 0deg;
  --rotate-y: 0deg;

  transform-style: preserve-3d;

  transition:
    transform 0.35s cubic-bezier(.22,1,.36,1),
    box-shadow 0.4s ease,
    border-color 0.4s ease,
    background-color 0.4s ease;
}

.awards-wow-card:hover {
  transform:
    perspective(900px)
    translateY(-9px)
    rotateX(var(--rotate-x))
    rotateY(var(--rotate-y));

  background: rgba(255,255,255,.92);

  border-color: rgba(27,59,19,.22);

  box-shadow:
    0 25px 55px rgba(25,40,25,.12),
    0 8px 20px rgba(25,40,25,.07);
}


/* =========================================================
   MOUSE SPOTLIGHT
========================================================= */

.awards-card-spotlight {
  opacity: 0;

  background:
    radial-gradient(
      220px circle at var(--mouse-x) var(--mouse-y),
      rgba(188,206,141,.25),
      transparent 65%
    );

  transition: opacity .4s ease;
}

.awards-wow-card:hover .awards-card-spotlight {
  opacity: 1;
}


/* =========================================================
   CARD SHINE
========================================================= */

.awards-card-shine {
  width: 45%;

  background:
    linear-gradient(
      110deg,
      transparent,
      rgba(255,255,255,.70),
      transparent
    );

  transform:
    translateX(-250%)
    skewX(-20deg);

  transition: none;
}

.awards-wow-card:hover .awards-card-shine {
  animation: awardsCardSweep .9s ease forwards;
}

@keyframes awardsCardSweep {
  from {
    transform:
      translateX(-250%)
      skewX(-20deg);
  }

  to {
    transform:
      translateX(500%)
      skewX(-20deg);
  }
}


/* =========================================================
   ANIMATED BORDER
========================================================= */

.awards-card-border {
  transform: scaleX(0);
  transform-origin: left;

  background:
    linear-gradient(
      90deg,
      transparent,
      #BCCE8D,
      #1B3B13,
      #BCCE8D,
      transparent
    );

  transition:
    transform .65s
    cubic-bezier(.22,1,.36,1);
}

.awards-wow-card:hover .awards-card-border {
  transform: scaleX(1);
}


/* =========================================================
   ICON ZONE
========================================================= */

.awards-icon-zone {
  perspective: 500px;
}


/* =========================================================
   ICON ROTATING RING
========================================================= */

.awards-icon-ring {
  opacity: 0;

  border:
    1px dashed
    rgba(27,59,19,.30);

  transform:
    scale(.6)
    rotate(0deg);

  transition:
    opacity .35s ease,
    transform .5s ease;
}

.awards-wow-card:hover .awards-icon-ring {
  opacity: 1;

  animation:
    awardsRingRotate
    5s
    linear
    infinite;
}

@keyframes awardsRingRotate {
  from {
    transform:
      scale(1)
      rotate(0deg);
  }

  to {
    transform:
      scale(1)
      rotate(360deg);
  }
}


/* =========================================================
   SECOND REVERSE RING
========================================================= */

.awards-icon-ring-two {
  opacity: 0;

  border-top:
    1px solid
    rgba(188,206,141,.95);

  border-right:
    1px solid
    transparent;

  border-bottom:
    1px solid
    rgba(27,59,19,.4);

  border-left:
    1px solid
    transparent;

  transition: opacity .4s ease;
}

.awards-wow-card:hover .awards-icon-ring-two {
  opacity: 1;

  animation:
    awardsReverseRing
    2.8s
    linear
    infinite;
}

@keyframes awardsReverseRing {
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
}


/* =========================================================
   ICON GLOW
========================================================= */

.awards-icon-glow {
  opacity: 0;

  background:
    radial-gradient(
      circle,
      rgba(188,206,141,.45),
      rgba(188,206,141,.15) 50%,
      transparent 72%
    );

  filter: blur(4px);

  transform: scale(.6);

  transition:
    opacity .4s ease,
    transform .5s
    cubic-bezier(.22,1,.36,1);
}

.awards-wow-card:hover .awards-icon-glow {
  opacity: 1;

  transform: scale(1.7);
}


/* =========================================================
   ICON PULSE
========================================================= */

.awards-icon-pulse {
  opacity: 0;

  border:
    1px solid
    rgba(188,206,141,.7);
}

.awards-wow-card:hover .awards-icon-pulse {
  animation:
    awardsIconPulse
    1.8s
    ease-out
    infinite;
}

@keyframes awardsIconPulse {

  0% {
    opacity: .7;
    transform: scale(.7);
  }

  70% {
    opacity: 0;
    transform: scale(1.7);
  }

  100% {
    opacity: 0;
    transform: scale(1.7);
  }
}


/* =========================================================
   ACTUAL ICON
========================================================= */

.awards-card-icon {
  transform-origin: center;

  transition:
    transform .55s
    cubic-bezier(.22,1,.36,1),
    filter .5s ease;
}

.awards-wow-card:hover .awards-card-icon {
  transform:
    translateY(-2px)
    scale(1.12)
    rotateY(10deg);

  filter:
    drop-shadow(
      0 7px 8px
      rgba(27,59,19,.18)
    );
}


/* =========================================================
   SUBTLE ICON FLOAT
========================================================= */

.awards-icon-zone {
  animation:
    awardsIconFloat
    4s
    ease-in-out
    infinite;
}

.awards-wow-card:nth-child(2)
.awards-icon-zone {
  animation-delay: .5s;
}

.awards-wow-card:nth-child(3)
.awards-icon-zone {
  animation-delay: 1s;
}

.awards-wow-card:nth-child(4)
.awards-icon-zone {
  animation-delay: 1.5s;
}

@keyframes awardsIconFloat {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-3px);
  }
}


/* =========================================================
   PARTICLES
========================================================= */

.awards-particle {
  position: absolute;

  width: 4px;
  height: 4px;

  border-radius: 50%;

  background: #BCCE8D;

  opacity: 0;

  pointer-events: none;
}

.awards-particle-1 {
  top: 7px;
  left: 9px;
}

.awards-particle-2 {
  top: 4px;
  right: 8px;
}

.awards-particle-3 {
  bottom: 7px;
  left: 5px;
}

.awards-particle-4 {
  bottom: 4px;
  right: 8px;
}

.awards-wow-card:hover
.awards-particle-1 {
  animation:
    particleOne
    1.5s
    ease-out
    infinite;
}

.awards-wow-card:hover
.awards-particle-2 {
  animation:
    particleTwo
    1.8s
    ease-out
    infinite .2s;
}

.awards-wow-card:hover
.awards-particle-3 {
  animation:
    particleThree
    1.7s
    ease-out
    infinite .1s;
}

.awards-wow-card:hover
.awards-particle-4 {
  animation:
    particleFour
    1.9s
    ease-out
    infinite .3s;
}

@keyframes particleOne {

  0% {
    opacity: 0;
    transform:
      translate(0,0)
      scale(.5);
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate(-8px,-10px)
      scale(1.2);
  }
}

@keyframes particleTwo {

  0% {
    opacity: 0;
    transform:
      translate(0,0)
      scale(.5);
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate(9px,-9px)
      scale(1.1);
  }
}

@keyframes particleThree {

  0% {
    opacity: 0;
    transform:
      translate(0,0);
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate(-9px,9px);
  }
}

@keyframes particleFour {

  0% {
    opacity: 0;
    transform:
      translate(0,0);
  }

  40% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform:
      translate(10px,8px);
  }
}


/* =========================================================
   TITLE MICRO ANIMATION
========================================================= */

.awards-card-title {
  transition:
    transform .4s
    cubic-bezier(.22,1,.36,1);
}

.awards-wow-card:hover
.awards-card-title {
  transform: translateX(3px);
}


/* =========================================================
   DESCRIPTION
========================================================= */

.awards-card-description {
  transition:
    transform .45s
    cubic-bezier(.22,1,.36,1),
    opacity .4s ease;
}

.awards-wow-card:hover
.awards-card-description {
  transform: translateX(3px);
}


/* =========================================================
   CARD ENTRANCE — MORE CINEMATIC
========================================================= */

.awards-card-visible {
  opacity: 0;

  transform:
    translateY(40px)
    scale(.94);

  filter: blur(5px);

  animation:
    awardsWowEntrance
    1s
    cubic-bezier(.16,1,.3,1)
    forwards;
}

@keyframes awardsWowEntrance {

  0% {
    opacity: 0;

    transform:
      translateY(40px)
      scale(.94);

    filter: blur(5px);
  }

  65% {
    opacity: 1;

    transform:
      translateY(-4px)
      scale(1.01);

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


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {

  .awards-wow-card,
  .awards-card-icon,
  .awards-icon-zone,
  .awards-icon-ring,
  .awards-icon-ring-two,
  .awards-icon-pulse,
  .awards-particle {
    animation: none !important;
    transition: none !important;
  }

  .awards-card-visible {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}

        /* =====================================================
           ICON
        ====================================================== */

        .awards-card-icon {
          transition:
            transform .5s cubic-bezier(.22,1,.36,1),
            filter .5s ease;
        }

        .awards-card:hover .awards-card-icon {
          transform:
            translateY(-3px)
            scale(1.08)
            rotate(-2deg);

          filter:
            drop-shadow(0 7px 8px rgba(0,0,0,.10));
        }


        /* =====================================================
           ACCESSIBILITY
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {

          .awards-bg-animation,
          .awards-light,
          .awards-photo-active,
          .awards-photo-shine,
          .awards-reveal,
          .awards-divider-active,
          .awards-card-visible {
            animation: none !important;
          }

          .awards-reveal,
          .awards-card-visible {
            opacity: 1 !important;
            transform: none !important;
          }

          .awards-divider-active {
            transform: scaleX(1) !important;
          }

          .awards-card,
          .awards-card-icon,
          .awards-doctor-image {
            transition: none !important;
          }
        }

      `}</style>
    </>
  );
}
