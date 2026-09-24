import iconWhatsapp from "../assets/footer/icon-whatsapp.svg";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

export default function WhatsAppButton() {
  const { row } = useSection("footer");

  const content = row?.content ?? DEFAULT_CONTENT.footer;

  const number = (
    content.whatsapp_number ||
    DEFAULT_CONTENT.footer.whatsapp_number ||
    ""
  ).replace(/[^\d]/g, "");

  if (!number) return null;

  const message =
    "Hello Dr. Deepa Bhatt, I am reaching out to book a consultation appointment, please share your upcoming availability so we can connect.";

  return (
    <>
      {/* =====================================================
          WHATSAPP FLOATING BUTTON
      ====================================================== */}

      <div
        className="
          kr-whatsapp-wrapper
          group

          fixed

          right-5
          bottom-5

          z-[300]

          flex
          items-center
          justify-center

          max-[560px]:right-4
          max-[560px]:bottom-4
        "
      >
        {/* ===================================================
            TOOLTIP
        ==================================================== */}

        <div
          className="
            pointer-events-none

            absolute

            right-[72px]
            top-1/2

            -translate-y-1/2
            translate-x-3

            whitespace-nowrap

            rounded-full

            bg-[#15350e]

            px-4
            py-2.5

            font-heading

            text-[12px]
            font-semibold

            text-white

            opacity-0

            shadow-[0_10px_30px_rgba(21,53,14,0.25)]

            transition-all
            duration-300
            ease-out

            group-hover:translate-x-0
            group-hover:opacity-100

            max-[560px]:hidden
          "
        >
          Book on WhatsApp
          {/* Tooltip Arrow */}
          <span
            className="
              absolute

              top-1/2
              right-[-5px]

              h-[10px]
              w-[10px]

              -translate-y-1/2
              rotate-45

              bg-[#15350e]
            "
          />
        </div>

        {/* ===================================================
            OUTER SOFT GLOW
        ==================================================== */}

        <span
          className="
            kr-whatsapp-glow

            pointer-events-none

            absolute
            inset-[-8px]

            rounded-full

            bg-[#25D366]/20

            blur-[8px]
          "
          aria-hidden="true"
        />

        {/* ===================================================
            PULSE RING 1
        ==================================================== */}

        <span
          className="
            kr-whatsapp-ring
            kr-whatsapp-ring-one

            pointer-events-none

            absolute
            inset-0

            rounded-full

            border
            border-[#25D366]/60
          "
          aria-hidden="true"
        />

        {/* ===================================================
            PULSE RING 2
        ==================================================== */}

        <span
          className="
            kr-whatsapp-ring
            kr-whatsapp-ring-two

            pointer-events-none

            absolute
            inset-0

            rounded-full

            border
            border-[#25D366]/35
          "
          aria-hidden="true"
        />

        {/* ===================================================
            SMALL DECORATIVE PARTICLES
        ==================================================== */}

        <span
          className="
            kr-whatsapp-dot
            kr-whatsapp-dot-one

            pointer-events-none

            absolute

            h-[5px]
            w-[5px]

            rounded-full

            bg-[#BCCE8D]
          "
          aria-hidden="true"
        />

        <span
          className="
            kr-whatsapp-dot
            kr-whatsapp-dot-two

            pointer-events-none

            absolute

            h-[4px]
            w-[4px]

            rounded-full

            bg-[#25D366]
          "
          aria-hidden="true"
        />

        <span
          className="
            kr-whatsapp-dot
            kr-whatsapp-dot-three

            pointer-events-none

            absolute

            h-[3px]
            w-[3px]

            rounded-full

            bg-white
          "
          aria-hidden="true"
        />

        {/* ===================================================
            MAIN BUTTON
        ==================================================== */}

        <a
          href={`https://wa.me/${number}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="
            kr-whatsapp-button

            relative

            flex

            h-14
            w-14

            items-center
            justify-center

            overflow-hidden

            rounded-full

            bg-[#25D366]

            shadow-[
              0_8px_24px_rgba(37,211,102,0.45)
            ]

            transition-all
            duration-300
            ease-out

            hover:scale-[1.12]

            hover:shadow-[
              0_12px_35px_rgba(37,211,102,0.60)
            ]

            active:scale-95

            max-[560px]:h-12
            max-[560px]:w-12
          "
        >
          {/* INNER GRADIENT */}

          <span
            className="
              pointer-events-none

              absolute
              inset-0

              rounded-full

              bg-gradient-to-br

              from-white/20
              via-transparent
              to-black/10
            "
          />

          {/* =================================================
              SHINE SWEEP
          ================================================== */}

          <span
            className="
              kr-whatsapp-shine

              pointer-events-none

              absolute

              top-[-20%]
              left-[-80%]

              h-[140%]
              w-[45%]

              rotate-[20deg]

              bg-gradient-to-r

              from-transparent
              via-white/50
              to-transparent

              blur-[1px]
            "
          />

          {/* =================================================
              ICON
          ================================================== */}

          <img
            src={iconWhatsapp}
            alt=""
            aria-hidden="true"
            className="
              kr-whatsapp-icon

              relative
              z-[2]

              h-7
              w-7

              brightness-0
              invert

              drop-shadow-[0_2px_3px_rgba(0,0,0,0.15)]

              max-[560px]:h-6
              max-[560px]:w-6
            "
          />
        </a>
      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>{`

        /* ===================================================
           WHOLE BUTTON FLOATING
        =================================================== */

        .kr-whatsapp-wrapper {
          animation:
            krWhatsappEntrance 0.8s
              cubic-bezier(0.16, 1, 0.3, 1) both,
            krWhatsappFloat 4s ease-in-out 1s infinite;
        }


        /* ===================================================
           ENTRANCE
        =================================================== */

        @keyframes krWhatsappEntrance {

          0% {
            opacity: 0;
            transform:
              translateY(35px)
              scale(0.5)
              rotate(-20deg);
          }

          60% {
            opacity: 1;
            transform:
              translateY(-5px)
              scale(1.08)
              rotate(5deg);
          }

          100% {
            opacity: 1;
            transform:
              translateY(0)
              scale(1)
              rotate(0deg);
          }

        }


        /* ===================================================
           GENTLE FLOAT
        =================================================== */

        @keyframes krWhatsappFloat {

          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }

        }


        /* ===================================================
           BUTTON BREATHING SHADOW
        =================================================== */

        .kr-whatsapp-button {

          animation:
            krWhatsappBreath
            2.8s
            ease-in-out
            infinite;

          isolation: isolate;

        }


        @keyframes krWhatsappBreath {

          0%,
          100% {

            box-shadow:
              0 8px 24px
              rgba(37, 211, 102, 0.42);

          }

          50% {

            box-shadow:
              0 10px 34px
              rgba(37, 211, 102, 0.70),
              0 0 0 5px
              rgba(37, 211, 102, 0.08);

          }

        }


        /* ===================================================
           OUTER GLOW BREATH
        =================================================== */

        .kr-whatsapp-glow {

          animation:
            krWhatsappGlow
            2.8s
            ease-in-out
            infinite;

        }


        @keyframes krWhatsappGlow {

          0%,
          100% {

            opacity: 0.35;

            transform:
              scale(0.9);

          }

          50% {

            opacity: 0.85;

            transform:
              scale(1.15);

          }

        }


        /* ===================================================
           EXPANDING RINGS
        =================================================== */

        .kr-whatsapp-ring {

          opacity: 0;

          animation:
            krWhatsappRing
            3s
            cubic-bezier(
              0.215,
              0.61,
              0.355,
              1
            )
            infinite;

        }


        .kr-whatsapp-ring-two {

          animation-delay: 1.5s;

        }


        @keyframes krWhatsappRing {

          0% {

            opacity: 0;

            transform:
              scale(0.85);

          }

          15% {

            opacity: 0.55;

          }

          100% {

            opacity: 0;

            transform:
              scale(1.85);

          }

        }


        /* ===================================================
           ICON MICRO MOVEMENT
        =================================================== */

        .kr-whatsapp-icon {

          transform-origin:
            center center;

          animation:
            krWhatsappIcon
            5s
            ease-in-out
            infinite;

        }


        @keyframes krWhatsappIcon {

          0%,
          76%,
          100% {

            transform:
              rotate(0deg)
              scale(1);

          }

          80% {

            transform:
              rotate(-12deg)
              scale(1.08);

          }

          84% {

            transform:
              rotate(12deg)
              scale(1.12);

          }

          88% {

            transform:
              rotate(-8deg)
              scale(1.08);

          }

          92% {

            transform:
              rotate(7deg)
              scale(1.05);

          }

          96% {

            transform:
              rotate(0deg)
              scale(1);

          }

        }


        /* ===================================================
           HOVER ICON EFFECT
        =================================================== */

        .kr-whatsapp-button:hover
        .kr-whatsapp-icon {

          animation: none;

          transform:
            rotate(-8deg)
            scale(1.12);

          transition:
            transform 0.3s
            cubic-bezier(
              0.34,
              1.56,
              0.64,
              1
            );

        }


        /* ===================================================
           SHINE
        =================================================== */

        .kr-whatsapp-shine {

          animation:
            krWhatsappShine
            4.5s
            ease-in-out
            infinite;

        }


        @keyframes krWhatsappShine {

          0%,
          65% {

            left: -80%;

            opacity: 0;

          }

          70% {

            opacity: 1;

          }

          88% {

            left: 130%;

            opacity: 0.7;

          }

          100% {

            left: 130%;

            opacity: 0;

          }

        }


        /* ===================================================
           PARTICLES
        =================================================== */

        .kr-whatsapp-dot-one {

          top: -8px;

          right: 5px;

          animation:
            krWhatsappParticleOne
            3.8s
            ease-in-out
            infinite;

        }


        .kr-whatsapp-dot-two {

          bottom: 4px;

          left: -8px;

          animation:
            krWhatsappParticleTwo
            4.5s
            ease-in-out
            infinite;

        }


        .kr-whatsapp-dot-three {

          top: 8px;

          left: -5px;

          animation:
            krWhatsappParticleThree
            4s
            ease-in-out
            infinite;

        }


        @keyframes krWhatsappParticleOne {

          0%,
          100% {

            opacity: 0;

            transform:
              translate(0, 5px)
              scale(0.5);

          }

          50% {

            opacity: 0.9;

            transform:
              translate(6px, -10px)
              scale(1);

          }

        }


        @keyframes krWhatsappParticleTwo {

          0%,
          100% {

            opacity: 0;

            transform:
              translate(5px, 0)
              scale(0.5);

          }

          50% {

            opacity: 0.75;

            transform:
              translate(-8px, 7px)
              scale(1);

          }

        }


        @keyframes krWhatsappParticleThree {

          0%,
          100% {

            opacity: 0;

            transform:
              translate(5px, 5px)
              scale(0.4);

          }

          50% {

            opacity: 0.8;

            transform:
              translate(-6px, -7px)
              scale(1);

          }

        }


        /* ===================================================
           HOVER — STOP FLOATING SLIGHTLY
        =================================================== */

        .kr-whatsapp-wrapper:hover {

          animation-play-state:
            paused;

        }


        /* ===================================================
           ACCESSIBILITY
        =================================================== */

        @media
        (prefers-reduced-motion: reduce) {

          .kr-whatsapp-wrapper,
          .kr-whatsapp-button,
          .kr-whatsapp-glow,
          .kr-whatsapp-ring,
          .kr-whatsapp-icon,
          .kr-whatsapp-shine,
          .kr-whatsapp-dot {

            animation: none !important;

          }

          .kr-whatsapp-wrapper {

            transform: none !important;

          }

        }

      `}</style>
    </>
  );
}
