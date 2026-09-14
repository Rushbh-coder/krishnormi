import { useEffect, useRef, useState } from "react";

import bgImage from "../assets/testimonials/bg.png";
import leafBg from "../assets/testimonials/leave.jpg";
import l1 from "../assets/testimonials/l1.jpg";
import patientPhoto from "../assets/testimonials/patient-photo.png";
import stars from "../assets/testimonials/stars.svg";
import iconyear from "../assets/testimonials/icon-years.svg";
import iconSkin from "../assets/testimonials/icon-skin.svg";
import iconPatients1 from "../assets/testimonials/icon-patients-1.svg";
import iconPatients2 from "../assets/testimonials/icon-patients-2.svg";
import iconSatisfaction from "../assets/testimonials/icon-satisfaction.svg";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

/* =========================================================
   SETTINGS
========================================================= */

const SLIDE_INTERVAL = 4500;

/* =========================================================
   STAT ICONS
========================================================= */

const STAT_ICONS = [
  <img
    key="years"
    src={iconyear}
    alt=""
    aria-hidden="true"
    className="h-[44px] w-[44px] object-contain"
  />,

  <span
    key="patients"
    className="
      relative
      block
      h-[48px]
      w-[48px]
      flex-none
    "
  >
    <img
      src={iconPatients1}
      alt=""
      aria-hidden="true"
      className="
        absolute
        inset-[24.76%_0_8.74%_0]
        h-auto
        w-full
        object-contain
      "
    />

    <img
      src={iconPatients2}
      alt=""
      aria-hidden="true"
      className="
        absolute
        inset-[8.74%_29.47%_76.26%_55.54%]
        h-auto
        w-auto
        object-contain
      "
    />
  </span>,

  <img
    key="skin"
    src={iconSkin}
    alt=""
    aria-hidden="true"
    className="h-[44px] w-[44px] object-contain"
  />,

  <img
    key="satisfaction"
    src={iconSatisfaction}
    alt=""
    aria-hidden="true"
    className="h-[44px] w-[44px] object-contain"
  />,
];

/* =========================================================
   REDUCED MOTION
========================================================= */

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = () => {
      setReducedMotion(media.matches);
    };

    handleChange();

    media.addEventListener?.("change", handleChange);

    return () => {
      media.removeEventListener?.("change", handleChange);
    };
  }, []);

  return reducedMotion;
}

/* =========================================================
   REVEAL ON SCROLL
========================================================= */

function useRevealOnce(reducedMotion, threshold = 0.12) {
  const ref = useRef(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      return;
    }

    const element = ref.current;

    if (!element) {
      return;
    }

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [visible, reducedMotion, threshold]);

  return [ref, visible];
}

/* =========================================================
   COUNT-UP
========================================================= */

function formatCount(value, progress) {
  const text = String(value ?? "");

  if (progress >= 1) {
    return text;
  }

  const match = text.match(/^(\s*[^0-9+-]*)([+-]?\d[\d,]*(?:\.\d+)?)(.*)$/);

  if (!match) {
    return text;
  }

  const [, prefix, numericText, suffix] = match;

  const target = Number(numericText.replace(/,/g, ""));

  if (!Number.isFinite(target)) {
    return text;
  }

  const decimals = Math.min(numericText.split(".")[1]?.length ?? 0, 6);

  const groups = numericText.split(".")[0].replace(/^[+-]/, "").split(",");

  const indianGrouping =
    groups.length > 2 &&
    groups.slice(1, -1).every((group) => group.length === 2);

  const formatter = new Intl.NumberFormat(indianGrouping ? "en-IN" : "en-US", {
    useGrouping: numericText.includes(","),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const currentValue =
    decimals > 0
      ? Number((target * progress).toFixed(decimals))
      : Math.round(target * progress);

  return `${prefix}${formatter.format(currentValue)}${suffix}`;
}

/* =========================================================
   TESTIMONIAL CARD

   CENTER:
   - high opacity
   - primary background
   - stronger shadow

   SIDES:
   - white
   - text low opacity
   - behind center card

   NO NEXT BUTTON INSIDE CARD
========================================================= */

function TestimonialCard({ testimonial, active }) {
  const patientName =
    testimonial?.name ||
    testimonial?.patient_name ||
    testimonial?.patientName ||
    testimonial?.client_name ||
    testimonial?.clientName ||
    testimonial?.full_name ||
    testimonial?.author ||
    "Patient";

  const patientPhotoUrl =
    testimonial?.photo_url ||
    testimonial?.photo ||
    testimonial?.patient_photo ||
    testimonial?.image_url ||
    testimonial?.image ||
    patientPhoto;

  const testimonialText =
    testimonial?.quote ||
    testimonial?.testimonial ||
    testimonial?.review ||
    testimonial?.message ||
    "";

  return (
    <div
      className="
        relative
        w-full
        pb-[48px]
      "
    >
      <article
        className={`
          relative
          flex
          min-h-[340px]
          w-full
          flex-col
          overflow-hidden

          rounded-[26px]
          border

          px-6
          pt-7
          pb-[68px]

          transition-all
          duration-700

          sm:px-7
          sm:pt-8

          lg:min-h-[355px]

          ${
            active
              ? `
                border-primary
                bg-primary

                shadow-[0_26px_70px_rgba(21,61,46,0.24)]
              `
              : `
                border-[#D8E6DC]
                bg-white/95

                shadow-[0_14px_38px_rgba(23,63,48,0.08)]
              `
          }
        `}
      >
        {/* ==============================================
            DECORATIVE GLOW
        =============================================== */}

        <div
          className={`
            pointer-events-none
            absolute

            -right-16
            -top-16

            h-[180px]
            w-[180px]

            rounded-full

            blur-[55px]

            ${active ? "bg-[#D7B274]/15" : "bg-[#DDECE2]/55"}
          `}
          aria-hidden="true"
        />

        {/* ==============================================
            QUOTE TOP
        =============================================== */}

        <div
          className="
            relative
            z-10

            flex
            items-center
            justify-center

            gap-4
          "
        >
          <span
            className={`
              h-px
              w-[52px]

              sm:w-[62px]

              ${active ? "bg-white/50" : "bg-[#DF2759]/50"}
            `}
          />

          <span
            className={`
              block
              translate-y-[5px]

              font-serif

              text-[72px]
              leading-[0.45]

              sm:text-[80px]

              ${active ? "text-white" : "text-[#DF2759]"}
            `}
            aria-hidden="true"
          >
            “
          </span>

          <span
            className={`
              h-px
              w-[52px]

              sm:w-[62px]

              ${active ? "bg-white/50" : "bg-[#DF2759]/50"}
            `}
          />
        </div>

        {/* ==============================================
            TESTIMONIAL CONTENT
        =============================================== */}

        <div
          className="
            relative
            z-10

            mt-7

            flex
            flex-1
            items-center
            justify-center
          "
        >
          <p
            className={`
              m-0

              mx-auto

              max-w-[430px]

              text-center

              font-heading

              text-[13px]
              leading-[1.8]

              transition-all
              duration-700

              sm:text-[14px]

              ${
                active
                  ? `
                    text-white
                    opacity-100
                  `
                  : `
                    text-[#53675C]
                    opacity-50
                  `
              }
            `}
          >
            {testimonialText}
          </p>
        </div>

        {/* ==============================================
            STARS
        =============================================== */}

        <div
          className="
            relative
            z-10

            mt-6

            flex
            justify-center
          "
        >
          <img
            src={stars}
            alt="5 out of 5 stars"
            className={`
              h-[18px]
              w-auto

              transition-opacity
              duration-700

              ${active ? "opacity-100" : "opacity-65"}
            `}
          />
        </div>

        {/* ==============================================
            NAME
        =============================================== */}

        <p
          className={`
            relative
            z-10

            mt-3
            mb-0

            text-center

            font-heading

            text-[15px]
            font-bold

            transition-opacity
            duration-700

            sm:text-[16px]

            ${
              active
                ? `
                  text-white
                  opacity-100
                `
                : `
                  text-[#173F30]
                  opacity-70
                `
            }
          `}
        >
          {patientName}
        </p>

        {/* ==============================================
            BOTTOM CENTER GLOW
        =============================================== */}

        {active && (
          <div
            className="
              pointer-events-none

              absolute
              inset-x-0
              bottom-0

              h-[3px]

              bg-gradient-to-r

              from-transparent
              via-[#D7B274]
              to-transparent
            "
            aria-hidden="true"
          />
        )}
      </article>

      {/* ==============================================
          PATIENT IMAGE - OUTSIDE CARD
      =============================================== */}

      <div
        className={`
          absolute

          bottom-0
          left-1/2

          z-20

          h-[88px]
          w-[88px]

          -translate-x-1/2

          overflow-hidden

          rounded-full

          border-[4px]

          bg-white

          shadow-[0_10px_25px_rgba(0,0,0,0.16)]

          transition-all
          duration-700

          ${
            active
              ? `
                border-[#E5C17E]
                opacity-100
              `
              : `
                border-white
                opacity-80
              `
          }
        `}
      >
        <img
          src={patientPhotoUrl}
          alt={patientName}
          className="
            h-full
            w-full

            object-cover
            object-center
          "
        />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Testimonials() {
  const { row, loading } = useSection("testimonials");

  const content = row?.content ?? DEFAULT_CONTENT.testimonials;

  const visible = row?.visible ?? true;

  const statsSource = content?.stats ?? DEFAULT_CONTENT.testimonials.stats;

  const testimonialSource =
    content?.testimonials ?? DEFAULT_CONTENT.testimonials.testimonials;

  const stats = Array.isArray(statsSource) ? statsSource : [];

  const testimonialList = Array.isArray(testimonialSource)
    ? testimonialSource
    : [];

  const reducedMotion = useReducedMotion();

  const [statsRef, statsVisible] = useRevealOnce(reducedMotion);

  const [contentRef, contentVisible] = useRevealOnce(reducedMotion);

  const [activeIndex, setActiveIndex] = useState(0);

  const [isInteracting, setIsInteracting] = useState(false);

  const [countProgress, setCountProgress] = useState(0);

  const countCompleted = useRef(false);

  const touchStartX = useRef(null);

  const N = testimonialList.length;

  const hasMultiple = N > 1;

  /* =========================================================
     INDEX HELPERS
  ========================================================= */

  const normalizeIndex = (index) => {
    if (!N) {
      return 0;
    }

    return ((index % N) + N) % N;
  };

  const goNext = () => {
    if (!hasMultiple) {
      return;
    }

    setActiveIndex((current) => normalizeIndex(current + 1));
  };

  const goPrev = () => {
    if (!hasMultiple) {
      return;
    }

    setActiveIndex((current) => normalizeIndex(current - 1));
  };

  const goTo = (index) => {
    setActiveIndex(normalizeIndex(index));
  };

  /* =========================================================
     SLIDE POSITION

     Cards move:

     hidden right
          ↓
        right
          ↓
        center
          ↓
         left
          ↓
     hidden left

     This creates real one-by-one LEFT animation.
  ========================================================= */

  const getSlidePosition = (index) => {
    if (!N) {
      return "hidden-right";
    }

    if (index === activeIndex) {
      return "center";
    }

    const previousIndex = normalizeIndex(activeIndex - 1);

    const nextIndex = normalizeIndex(activeIndex + 1);

    if (index === previousIndex) {
      return "left";
    }

    if (index === nextIndex) {
      return "right";
    }

    const difference = normalizeIndex(index - activeIndex);

    if (difference > N / 2) {
      return "hidden-left";
    }

    return "hidden-right";
  };

  /* =========================================================
     STAT COUNT-UP
  ========================================================= */

  useEffect(() => {
    if (!statsVisible || countCompleted.current) {
      return;
    }

    if (reducedMotion) {
      setCountProgress(1);

      countCompleted.current = true;

      return;
    }

    let frameId;

    let startTime = null;

    const duration = 1500;

    const animate = (time) => {
      if (startTime === null) {
        startTime = time;
      }

      const elapsed = time - startTime;

      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      setCountProgress(eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCountProgress(1);

        countCompleted.current = true;
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [statsVisible, reducedMotion]);

  /* =========================================================
     AUTO SLIDESHOW

     Every 4.5 seconds:
     one card moves LEFT.
  ========================================================= */

  useEffect(() => {
    if (!hasMultiple || !contentVisible || isInteracting || reducedMotion) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => normalizeIndex(current + 1));
    }, SLIDE_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [hasMultiple, contentVisible, isInteracting, reducedMotion, N]);

  /* =========================================================
     TOUCH / SWIPE SUPPORT

     No visible Next button required.
  ========================================================= */

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches?.[0]?.clientX ?? null;

    setIsInteracting(true);
  };

  const handleTouchEnd = (event) => {
    const start = touchStartX.current;

    const end = event.changedTouches?.[0]?.clientX;

    touchStartX.current = null;

    setIsInteracting(false);

    if (start == null || end == null) {
      return;
    }

    const distance = start - end;

    if (Math.abs(distance) < 45) {
      return;
    }

    if (distance > 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  /* =========================================================
     HIDDEN SECTION
  ========================================================= */

  if (!loading && !visible) {
    return null;
  }

  if (!testimonialList.length) {
    return null;
  }

  /* =========================================================
     REVEAL CLASS
  ========================================================= */

  const revealClass = (isVisible) => `
    transition-all
    duration-700
    ease-out

    motion-reduce:transition-none

    ${
      isVisible
        ? `
          translate-y-0
          opacity-100
        `
        : `
          translate-y-8
          opacity-0
        `
    }
  `;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section
      id="testimonials"
      className="
        relative
        isolate

        overflow-visible

        bg-[#F3F6F1]

        pb-[70px]

        md:pb-[90px]
        lg:pb-[100px]
      "
    >
      {/* =====================================================
          ALL ANIMATION CSS
      ====================================================== */}

      <style>
        {`
          /* ================================================
             DECORATIVE BACKGROUND
          ================================================= */

          @keyframes testimonialFloat {
            0%,
            100% {
              transform:
                translate3d(
                  0,
                  0,
                  0
                );
            }

            50% {
              transform:
                translate3d(
                  0,
                  -10px,
                  0
                );
            }
          }

          @keyframes testimonialLeafIn {
            0% {
              opacity: 0;

              transform:
                translateX(-130px)
                rotate(130deg)
                scale(.92);

              filter:
                blur(5px);
            }

            100% {
              opacity: .30;

              transform:
                translateX(0)
                rotate(130deg)
                scale(1);

              filter:
                blur(0);
            }
          }

          /* ================================================
             DOT TIMER
          ================================================= */

          @keyframes testimonialProgress {
            from {
              transform:
                scaleX(0);
            }

            to {
              transform:
                scaleX(1);
            }
          }

          /* ================================================
             OVERLAPPING TESTIMONIAL STAGE
          ================================================= */

          .kr-testimonial-stage {
            position: relative;

            width: 100%;
            max-width: 1180px;

            height: 475px;

            margin-left: auto;
            margin-right: auto;

            overflow: visible;
          }

          .kr-testimonial-slide {
            position: absolute;

            top: 0;

            width: 44%;

            will-change:
              left,
              transform,
              opacity;

            transition:
              left 900ms cubic-bezier(.22,1,.36,1),
              transform 900ms cubic-bezier(.22,1,.36,1),
              opacity 650ms ease,
              filter 650ms ease;
          }

          /* ================================================
             LEFT CARD

             Lower + behind center
          ================================================= */

          .kr-testimonial-left {
            left: 0;

            z-index: 10;

            opacity: .96;

            transform:
              translateY(58px)
              scale(.94);
          }

          /* ================================================
             CENTER CARD

             Most important card
          ================================================= */

          .kr-testimonial-center {
            left: 28%;

            z-index: 30;

            opacity: 1;

            transform:
              translateY(0)
              scale(1.02);
          }

          /* ================================================
             RIGHT CARD

             Lower + behind center
          ================================================= */

          .kr-testimonial-right {
            left: 56%;

            z-index: 10;

            opacity: .96;

            transform:
              translateY(58px)
              scale(.94);
          }

          /* ================================================
             OFF SCREEN LEFT
          ================================================= */

          .kr-testimonial-hidden-left {
            left: -48%;

            z-index: 1;

            opacity: 0;

            pointer-events: none;

            transform:
              translateY(65px)
              scale(.88);
          }

          /* ================================================
             OFF SCREEN RIGHT
          ================================================= */

          .kr-testimonial-hidden-right {
            left: 106%;

            z-index: 1;

            opacity: 0;

            pointer-events: none;

            transform:
              translateY(65px)
              scale(.88);
          }

          /* ================================================
             TABLET
          ================================================= */

          @media (
            min-width: 768px
          ) and (
            max-width: 1023px
          ) {
            .kr-testimonial-stage {
              max-width: 850px;

              height: 470px;

              overflow: hidden;
            }

            .kr-testimonial-slide {
              width: 58%;
            }

            .kr-testimonial-left {
              left: -20%;

              transform:
                translateY(55px)
                scale(.91);
            }

            .kr-testimonial-center {
              left: 21%;

              transform:
                translateY(0)
                scale(1);
            }

            .kr-testimonial-right {
              left: 62%;

              transform:
                translateY(55px)
                scale(.91);
            }

            .kr-testimonial-hidden-left {
              left: -88%;
            }

            .kr-testimonial-hidden-right {
              left: 126%;
            }
          }

          /* ================================================
             MOBILE

             Only center visible.
             Still animates one-by-one left.
          ================================================= */

          @media (
            max-width: 767px
          ) {
            .kr-testimonial-stage {
              width: 100%;

              max-width: 430px;

              height: 445px;

              overflow: hidden;
            }

            .kr-testimonial-slide {
              top: 0;
              left: 0;

              width: 100%;
            }

            .kr-testimonial-center {
              left: 0;

              z-index: 30;

              opacity: 1;

              transform:
                translateX(0)
                translateY(0)
                scale(1);
            }

            .kr-testimonial-left {
              left: 0;

              z-index: 5;

              opacity: 0;

              pointer-events: none;

              transform:
                translateX(-110%)
                scale(.96);
            }

            .kr-testimonial-right {
              left: 0;

              z-index: 5;

              opacity: 0;

              pointer-events: none;

              transform:
                translateX(110%)
                scale(.96);
            }

            .kr-testimonial-hidden-left {
              left: 0;

              opacity: 0;

              transform:
                translateX(-150%)
                scale(.92);
            }

            .kr-testimonial-hidden-right {
              left: 0;

              opacity: 0;

              transform:
                translateX(150%)
                scale(.92);
            }
          }

          /* ================================================
             SMALL MOBILE
          ================================================= */

          @media (
            max-width: 420px
          ) {
            .kr-testimonial-stage {
              height: 455px;
            }
          }

          /* ================================================
             REDUCED MOTION
          ================================================= */

          @media (
            prefers-reduced-motion:
            reduce
          ) {
            .kr-testimonial-slide {
              transition: none;
            }
          }
        `}
      </style>

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none

          absolute
          inset-0

          overflow-hidden
        "
        aria-hidden="true"
      >
        {/* BASE */}

        <div
          className="
            absolute
            inset-0

            bg-[#F3F6F1]
          "
        />

        {/* CMS BACKGROUND */}

        <div
          className="
            absolute
            inset-0

            bg-cover
            bg-center

            opacity-[0.04]

            mix-blend-multiply
          "
          style={{
            backgroundImage: `url(${content.background_image_url || bgImage})`,
          }}
        />

        {/* FULL LIGHT LEAF BACKGROUND */}

        <img
          src={leafBg}
          alt=""
          className="
            absolute
            inset-0

            h-full
            w-full

            object-cover
            object-center

            opacity-[0.08]

            mix-blend-multiply
          "
        />

        {/* ==============================================
            LEFT DECORATIVE LEAF
        =============================================== */}

        <img
          src={l1}
          alt=""
          className="
            absolute

            left-[-75px]
            top-[60px]

            z-[1]

            w-[240px]

            object-contain

            opacity-30

            mix-blend-multiply

            sm:w-[280px]

            md:left-[-55px]
            md:w-[320px]

            lg:left-[-4%]
            lg:top-[70px]
            lg:w-[390px]
          "
          style={{
            animation: reducedMotion
              ? "none"
              : "testimonialLeafIn 1.5s cubic-bezier(.22,.8,.25,1) both",

            transform: reducedMotion ? "rotate(130deg)" : undefined,
          }}
        />

        {/* LEFT GLOW */}

        <div
          className="
            absolute

            -left-28
            top-24

            h-[360px]
            w-[360px]

            rounded-full

            bg-[#DDE9E1]/55

            blur-[80px]
          "
        />

        {/* RIGHT GLOW */}

        <div
          className="
            absolute

            -right-28
            bottom-10

            h-[420px]
            w-[420px]

            rounded-full

            bg-[#E8DCC7]/40

            blur-[100px]
          "
        />

        {/* FLOATING GLASS */}

        <div
          className="
            absolute

            right-[7%]
            top-[18%]

            hidden

            h-24
            w-24

            rounded-[32px]

            border
            border-[#BFCFC5]/50

            bg-white/30

            backdrop-blur-md

            lg:block
          "
          style={{
            animation: reducedMotion
              ? "none"
              : "testimonialFloat 6s ease-in-out infinite",
          }}
        />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          container

          relative
          z-10
        "
      >
        {/* =================================================
            STATISTICS
        ================================================== */}

        <div
          className="
            relative

            z-40

            -translate-y-1/2

            -mb-[110px]

            sm:-mb-[100px]

            md:-mb-[90px]

            lg:-mb-[74px]
          "
        >
          <div
            ref={statsRef}
            className={`
              ${revealClass(statsVisible)}

              relative

              overflow-hidden

              rounded-[24px]

              bg-primary

              px-4
              py-5

              shadow-[0_28px_80px_rgba(21,61,46,0.20)]

              sm:rounded-[26px]
              sm:px-5
              sm:py-6

              md:rounded-[30px]
              md:px-8
              md:py-8
            `}
          >
            {/* STAT BACKGROUND */}

            <div
              className="
                pointer-events-none

                absolute
                inset-0

                opacity-50
              "
              style={{
                background:
                  "radial-gradient(circle at 15% 20%, rgba(214,179,117,.20), transparent 32%), radial-gradient(circle at 90% 90%, rgba(117,167,139,.24), transparent 34%)",
              }}
            />

            {/* STAT GRID */}

            <div
              className="
                relative

                grid
                grid-cols-2

                gap-2

                sm:gap-3

                lg:grid-cols-4
                lg:gap-0
              "
            >
              {stats.map((stat, i) => (
                <div
                  key={`${stat?.label}-${i}`}
                  className={`
                      relative

                      flex
                      min-w-0
                      items-center

                      gap-2

                      px-1
                      py-3

                      sm:gap-4
                      sm:px-3
                      sm:py-4

                      lg:px-7
                      lg:py-3

                      ${
                        i !== stats.length - 1
                          ? `
                            lg:border-r
                            lg:border-white/[0.12]
                          `
                          : ""
                      }
                    `}
                  style={{
                    transitionDelay:
                      statsVisible && !reducedMotion ? `${i * 90}ms` : "0ms",
                  }}
                >
                  {/* ICON */}

                  <div
                    className="
                        flex

                        h-[46px]
                        w-[46px]

                        flex-none

                        items-center
                        justify-center

                        rounded-xl

                        bg-white

                        shadow-[0_8px_30px_rgba(0,0,0,0.12)]

                        sm:h-[60px]
                        sm:w-[60px]
                        sm:rounded-2xl
                      "
                  >
                    {STAT_ICONS[i]}
                  </div>

                  {/* DATA */}

                  <div
                    className="
                        min-w-0
                      "
                  >
                    <p
                      className="
                          m-0

                          font-heading

                          text-[21px]
                          leading-none
                          font-bold

                          text-white

                          sm:text-[29px]

                          md:text-[32px]
                        "
                    >
                      {formatCount(stat?.value, countProgress)}
                    </p>

                    <p
                      className="
                          mt-2
                          mb-0

                          font-heading

                          text-[9px]
                          leading-[1.3]

                          text-white/70

                          sm:text-[12px]

                          md:text-[13px]
                        "
                    >
                      {stat?.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =================================================
            HEADER
        ================================================== */}

        <div
          ref={contentRef}
          className={`
            mx-auto

            max-w-[820px]

            pt-8

            text-center

            sm:pt-10

            md:pt-14

            lg:pt-16

            ${revealClass(contentVisible)}
          `}
        >
          <h2
            className="
              m-0

              font-heading

              text-[31px]
              leading-[1.15]
              font-bold

              tracking-[-0.025em]

              text-[#173F30]

              sm:text-[40px]

              md:text-[46px]

              lg:text-[54px]
            "
          >
            {content.title}
          </h2>

          <p
            className="
              mx-auto

              mt-4
              mb-0

              max-w-[820px]

              px-3

              font-heading

              text-[14px]
              leading-[1.75]

              text-[#607368]

              sm:text-[15px]

              md:text-[17px]

              lg:text-[18px]
            "
          >
            {content.intro_text}
          </p>
        </div>

        {/* =================================================
            OVERLAPPING TESTIMONIAL CAROUSEL
        ================================================== */}

        <div
          className={`
            relative

            mt-10

            sm:mt-12

            md:mt-14

            lg:mt-16

            ${revealClass(contentVisible)}
          `}
          style={{
            transitionDelay: contentVisible && !reducedMotion ? "150ms" : "0ms",
          }}
          onMouseEnter={() => {
            setIsInteracting(true);
          }}
          onMouseLeave={() => {
            setIsInteracting(false);
          }}
          onFocusCapture={() => {
            setIsInteracting(true);
          }}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsInteracting(false);
            }
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* =============================================
              CARDS STAGE
          ============================================== */}

          <div
            className="
              kr-testimonial-stage
            "
          >
            {testimonialList.map((testimonial, index) => {
              const position = getSlidePosition(index);

              const active = position === "center";

              let positionClass = "";

              if (position === "left") {
                positionClass = "kr-testimonial-left";
              }

              if (position === "center") {
                positionClass = "kr-testimonial-center";
              }

              if (position === "right") {
                positionClass = "kr-testimonial-right";
              }

              if (position === "hidden-left") {
                positionClass = "kr-testimonial-hidden-left";
              }

              if (position === "hidden-right") {
                positionClass = "kr-testimonial-hidden-right";
              }

              return (
                <div
                  key={
                    testimonial?.id ||
                    testimonial?.name ||
                    testimonial?.patient_name ||
                    index
                  }
                  className={`
                      kr-testimonial-slide

                      ${positionClass}
                    `}
                  aria-hidden={
                    position.startsWith("hidden") ? "true" : undefined
                  }
                >
                  <TestimonialCard testimonial={testimonial} active={active} />
                </div>
              );
            })}
          </div>

          {/* =============================================
              ONLY DOTS

              NO ARROWS INSIDE CARDS
              NO NEXT/PREVIOUS BUTTONS BELOW CARDS
          ============================================== */}

          {hasMultiple && (
            <div
              className="
                mt-3

                flex
                items-center
                justify-center

                gap-2.5

                sm:mt-5
                md:mt-6
              "
            >
              {testimonialList.map((_, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Show testimonial ${index + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`
                        relative

                        h-[5px]

                        overflow-hidden

                        rounded-full

                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              w-9

                              bg-[#DF2759]
                            `
                            : `
                              w-3

                              bg-[#9DB8C1]

                              hover:bg-[#7898A3]
                            `
                        }
                      `}
                  >
                    {isActive && !reducedMotion && (
                      <span
                        key={`progress-${activeIndex}`}
                        className="
                              absolute
                              inset-0

                              origin-left

                              bg-[#DF2759]
                            "
                        style={{
                          animation: `testimonialProgress ${SLIDE_INTERVAL}ms linear forwards`,

                          animationPlayState: isInteracting
                            ? "paused"
                            : "running",
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* =============================================
              MOBILE HINT
          ============================================== */}

          {hasMultiple && (
            <p
              className="
                mt-4
                mb-0

                text-center

                font-heading

                text-[11px]

                text-[#7C9085]

                md:hidden
              "
            >
              Swipe to view more patient stories
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
