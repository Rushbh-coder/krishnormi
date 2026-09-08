import { useEffect, useRef, useState } from "react";

import bgImage from "../assets/testimonials/bg.png";
import patientPhoto from "../assets/testimonials/patient-photo.png";
import stars from "../assets/testimonials/stars.svg";
import iconyear from "../assets/testimonials/icon-years.svg";
import iconSkin from "../assets/testimonials/icon-skin.svg";
import iconPatients1 from "../assets/testimonials/icon-patients-1.svg";
import iconPatients2 from "../assets/testimonials/icon-patients-2.svg";
import iconSatisfaction from "../assets/testimonials/icon-satisfaction.svg";
import iconQuote from "../assets/testimonials/icon-quote.png";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

/* =====================================================
   STAT ICONS
===================================================== */

const STAT_ICONS = [
  <img
    key="years"
    src={iconyear}
    alt=""
    aria-hidden="true"
    className="h-[52px] w-[52px] object-contain"
  />,

  <span key="patients" className="relative block h-[56px] w-[56px] flex-none">
    <img
      className="absolute inset-[24.76%_0_8.74%_0] h-auto w-full object-contain"
      src={iconPatients1}
      alt=""
      aria-hidden="true"
    />
    <img
      className="absolute inset-[8.74%_29.47%_76.26%_55.54%] h-auto w-auto object-contain"
      src={iconPatients2}
      alt=""
      aria-hidden="true"
    />
  </span>,

  <img
    key="skin"
    src={iconSkin}
    alt=""
    aria-hidden="true"
    className="h-[52px] w-[52px] object-contain"
  />,

  <img
    key="satisfaction"
    src={iconSatisfaction}
    alt=""
    aria-hidden="true"
    className="h-[52px] w-[52px] object-contain"
  />,
];

/* =====================================================
   REDUCED MOTION
===================================================== */

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

/* =====================================================
   REVEAL ONCE WHEN SCROLLED INTO VIEW
===================================================== */

function useRevealOnce(reducedMotion) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;

    const element = ref.current;
    if (!element) return;

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
        threshold: 0.15,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [visible, reducedMotion]);

  return [ref, visible];
}

/* =====================================================
   FORMAT COUNTING NUMBERS

   Examples:
   20+      → 0+ ... 20+
   10K+     → 0K+ ... 10K+
   50,000+  → 0+ ... 50,000+
   98%      → 0% ... 98%
===================================================== */

function formatCount(value, progress) {
  const text = String(value ?? "");

  // Always return the exact CMS value at the end.
  if (progress >= 1) return text;

  const match = text.match(/^(\s*[^0-9+-]*)([+-]?\d[\d,]*(?:\.\d+)?)(.*)$/);

  if (!match) return text;

  const [, prefix, numericText, suffix] = match;
  const target = Number(numericText.replace(/,/g, ""));

  if (!Number.isFinite(target)) return text;

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

/* =====================================================
   ARROW BUTTON
===================================================== */

function ArrowButton({ direction, onClick, className = "" }) {
  const isPrevious = direction === "previous";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrevious ? "Previous testimonial" : "Next testimonial"}
      className={`
        flex
        h-11
        w-11
        flex-none
        items-center
        justify-center
        rounded-full
        border
        border-[#eab308]
        bg-[#15350e]
        text-[#eab308]
        transition-colors
        duration-200
        hover:bg-[#eab308]
        hover:text-[#15350e]
        ${className}
      `}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={isPrevious ? "M15 19 8 12l7-7" : "m9 5 7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/* =====================================================
   TESTIMONIALS
===================================================== */

export default function Testimonials() {
  const { row, loading } = useSection("testimonials");

  const content = row?.content ?? DEFAULT_CONTENT.testimonials;
  const visible = row?.visible ?? true;

  const stats = content.stats ?? DEFAULT_CONTENT.testimonials.stats;

  const testimonialList =
    content.testimonials ?? DEFAULT_CONTENT.testimonials.testimonials;

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const reducedMotion = useReducedMotion();

  const [statsRef, statsVisible] = useRevealOnce(reducedMotion);
  const [contentRef, contentVisible] = useRevealOnce(reducedMotion);

  /* ===================================================
     COUNT-UP ANIMATION — RUNS ONLY ONCE
  ==================================================== */

  const [countProgress, setCountProgress] = useState(0);
  const countCompleted = useRef(false);

  useEffect(() => {
    if (!statsVisible || countCompleted.current) return;

    if (reducedMotion) {
      setCountProgress(1);
      countCompleted.current = true;
      return;
    }

    let frameId;
    let startTime = null;

    const duration = 1800;

    const animate = (time) => {
      if (startTime === null) startTime = time;

      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out: fast at first, slower near the final value.
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

    return () => cancelAnimationFrame(frameId);
  }, [statsVisible, reducedMotion]);

  /* ===================================================
     CAROUSEL
  ==================================================== */

  const hasMultiple = testimonialList.length > 1;

  useEffect(() => {
    if (
      !hasMultiple ||
      !contentVisible ||
      isPaused ||
      isInteracting ||
      reducedMotion
    ) {
      return;
    }

    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % testimonialList.length);
    }, 6000);

    return () => clearInterval(id);
  }, [
    current,
    hasMultiple,
    testimonialList.length,
    contentVisible,
    isPaused,
    isInteracting,
    reducedMotion,
  ]);

  if (!loading && !visible) return null;
  if (!testimonialList.length) return null;

  const activeIndex = current % testimonialList.length;
  const activeTestimonial = testimonialList[activeIndex];

  const goPrev = () =>
    setCurrent(
      (i) => (i - 1 + testimonialList.length) % testimonialList.length,
    );

  const goNext = () => setCurrent((i) => (i + 1) % testimonialList.length);

  const revealClass = (isVisible) =>
    `
      transition-[opacity,transform]
      duration-700
      ease-out
      motion-reduce:transition-none
      ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
    `;

  return (
    <section
      id="testimonials"
      className="
        relative
        isolate
        w-full
        bg-[#15350e]
        bg-cover
        bg-center
        pb-[60px]
      "
      style={{
        backgroundImage: `url(${content.background_image_url || bgImage})`,
      }}
    >
      {/* Small animation used when the patient photo changes */}
      <style>
        {`
          @keyframes testimonialImageIn {
            from {
              opacity: 0;
              transform: scale(0.92);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>

      {/* Background Overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-[rgba(21,53,14,0.82)] backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="container relative z-20">
        {/* Separate wrapper preserves the desktop overlap */}
        <div className="-translate-y-1/2 max-[900px]:mt-5 max-[900px]:translate-y-0">
          <div
            ref={statsRef}
            className={`
              relative
              grid
              grid-cols-4
              items-center
              gap-6

              rounded-[20px]
              bg-white
              p-[32px_40px]

              shadow-[0_14px_45px_rgba(128,128,128,0.28)]

              max-[1100px]:grid-cols-2
              max-[900px]:p-6
              max-[520px]:grid-cols-1
              max-[520px]:gap-0

              ${revealClass(statsVisible)}
            `}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`
                  relative
                  flex
                  min-w-0
                  items-center
                  gap-4

                  max-[520px]:border-b
                  max-[520px]:border-black/10
                  max-[520px]:py-5
                  max-[520px]:first:pt-0
                  max-[520px]:last:border-b-0
                  max-[520px]:last:pb-0

                  ${revealClass(statsVisible)}
                `}
                style={{
                  transitionDelay:
                    statsVisible && !reducedMotion ? `${i * 110}ms` : "0ms",
                }}
              >
                {/* Icon */}
                {STAT_ICONS[i] && (
                  <div
                    className="
                      flex
                      h-[60px]
                      w-[60px]
                      flex-none
                      items-center
                      justify-center
                    "
                  >
                    {STAT_ICONS[i]}
                  </div>
                )}

                {/* Number + Label */}
                <div className="min-w-0">
                  <p className="m-0 font-heading text-[32px] leading-[1.2] font-bold text-primary max-[600px]:text-[28px]">
                    {formatCount(stat.value, countProgress)}
                  </p>

                  <p className="m-0 font-heading text-[15px] leading-[1.5] text-text-dark">
                    {stat.label}
                  </p>
                </div>

                {/* Desktop Divider */}
                {i < stats.length - 1 && (
                  <span
                    className="
                      absolute
                      top-1/2
                      right-[-12px]
                      h-[60px]
                      w-px
                      -translate-y-1/2
                      bg-black/15
                      max-[1100px]:hidden
                    "
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          TITLE + INTRO
      ====================================================== */}

      <div
        ref={contentRef}
        className="container relative z-10 pt-0 text-center max-[900px]:pt-10"
      >
        <div className={revealClass(contentVisible)}>
          <h2 className="m-0 mb-4 font-heading text-[44px] font-bold text-white max-[700px]:text-[32px] max-[420px]:text-[26px]">
            {content.title}
          </h2>

          <div className="mx-auto mb-14 max-w-[780px]">
            <p className="font-heading text-lg leading-[1.8] text-white/90">{content.intro_text}</p>
          </div>
        </div>

        {/* ===================================================
            TESTIMONIAL CAROUSEL
        ==================================================== */}

        <div
          className={`
            relative
            mx-auto
            w-full
            max-w-[960px]

            ${revealClass(contentVisible)}
          `}
          style={{
            transitionDelay: contentVisible && !reducedMotion ? "180ms" : "0ms",
          }}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onFocusCapture={() => setIsInteracting(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsInteracting(false);
            }
          }}
        >
          {/* Space for the patient photo */}
          <div className="relative pt-12">
            {/* Quote Decoration */}
            <img
              className="
                pointer-events-none
                absolute
                top-[-6px]
                left-2
                z-[5]
                h-[150px]
                w-auto

                max-[600px]:h-[65px]
              "
              src={iconQuote}
              alt=""
              aria-hidden="true"
            />

            {/* Patient Photo */}
            <div className="absolute top-12 left-1/2 z-[6] -translate-x-1/2 -translate-y-1/2">
              <img
                key={activeIndex}
                className="
                  h-20
                  w-20
                  rounded-full
                  border-[3px]
                  border-[#eab308]
                  bg-white
                  object-cover
                  object-center

                  animate-[testimonialImageIn_500ms_ease-out_both]
                  motion-reduce:animate-none

                  max-[600px]:h-16
                  max-[600px]:w-16
                "
                src={activeTestimonial.photo_url || patientPhoto}
                alt={activeTestimonial.name}
              />
            </div>

            {/* Sliding Viewport */}
            <div className="overflow-hidden rounded">
              <div
                className="
                  flex
                  w-full
                  items-stretch
                  transition-transform
                  duration-500
                  ease-in-out
                  motion-reduce:transition-none
                "
                style={{
                  transform: `translateX(-${activeIndex * 100}%)`,
                }}
              >
                {testimonialList.map((testimonial, i) => (
                  <div
                    key={i}
                    className="w-full flex-none"
                    aria-hidden={i !== activeIndex}
                    inert={i !== activeIndex ? "" : undefined}
                  >
                    <div
                      className="
                        relative
                        flex
                        h-full
                        min-h-[230px]
                        flex-col
                        items-center
                        justify-center

                        rounded
                        border
                        border-[#eab308]

                        p-[60px_48px_40px]

                        max-[600px]:min-h-0
                        max-[600px]:p-[50px_24px_28px]
                      "
                    >
                      <p className="m-0 mb-4 font-heading text-[23px] font-medium text-white max-[600px]:text-lg">
                        {testimonial.name}
                      </p>

                      <div className="mx-auto mb-5 max-w-[1026px]">
                        <p className="font-heading text-base leading-[2] text-white/90">{testimonial.quote}</p>
                      </div>

                      <img
                        className="mx-auto h-[21px] w-auto"
                        src={stars}
                        alt="5 out of 5 stars"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Previous */}
            {hasMultiple && (
              <ArrowButton
                direction="previous"
                onClick={goPrev}
                className="absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2 max-[860px]:hidden"
              />
            )}

            {/* Desktop Next */}
            {hasMultiple && (
              <ArrowButton
                direction="next"
                onClick={goNext}
                className="absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2 max-[860px]:hidden"
              />
            )}
          </div>

          {/* =================================================
              CAROUSEL CONTROLS
          ================================================== */}

          {hasMultiple && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {/* Mobile Previous */}
              <ArrowButton
                direction="previous"
                onClick={goPrev}
                className="hidden max-[860px]:flex"
              />

              {/* Dots */}
              <div className="flex items-center justify-center gap-2">
                {testimonialList.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrent(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all duration-200 ${
                      i === activeIndex
                        ? "w-6 bg-[#eab308]"
                        : "w-2.5 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Mobile Next */}
              <ArrowButton
                direction="next"
                onClick={goNext}
                className="hidden max-[860px]:flex"
              />

              {/* Pause / Resume automatic carousel */}
              <button
                type="button"
                onClick={() => setIsPaused((paused) => !paused)}
                className="
                  rounded-full
                  border
                  border-white/30
                  px-4
                  py-2
                  font-body
                  text-xs
                  font-medium
                  text-white/80
                  transition-colors
                  hover:border-[#eab308]
                  hover:text-[#eab308]
                "
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
