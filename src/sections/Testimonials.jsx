import { useEffect, useRef, useState } from "react";

import bgImage from "../assets/testimonials/bg.png";
import patientPhoto from "../assets/testimonials/patient-photo.png";
import stars from "../assets/testimonials/stars.svg";
import iconyear from "../assets/testimonials/icon-years.svg";
import iconSkin from "../assets/testimonials/icon-skin.svg";
import iconPatients1 from "../assets/testimonials/icon-patients-1.svg";
import iconPatients2 from "../assets/testimonials/icon-patients-2.svg";
import iconSatisfaction from "../assets/testimonials/icon-satisfaction.svg";

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
        border-white/60
        bg-transparent
        text-white
        transition-colors
        duration-200
        hover:bg-accent
        hover:text-white
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
   DYNAMIC CARD SIZING
   Cards are sized so exactly 3 of them (left + center +
   right) fill the full measured width of the viewport —
   nothing is ever permanently cropped. The centre slot is
   a genuinely bigger box (not a CSS scale trick).
===================================================== */

const SIDE_TO_CENTER_RATIO = 0.84; // side card width as a fraction of the centre card's width
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getGap(containerWidth) {
  if (containerWidth <= 520) return 10;
  if (containerWidth <= 900) return 16;
  if (containerWidth <= 1100) return 20;
  return 28;
}

function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof ResizeObserver === "undefined") {
      setWidth(el.clientWidth);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });

    observer.observe(el);
    setWidth(el.clientWidth);

    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

function useCardMetrics(containerWidth) {
  const gap = getGap(containerWidth);

  // side*2 + center + gap*2 = containerWidth, with side = center * RATIO
  const denom = 2 * SIDE_TO_CENTER_RATIO + 1;
  const rawCenterW = (containerWidth - gap * 2) / denom;
  const centerW = containerWidth > 0 ? Math.max(rawCenterW, 0) : 0;
  const sideW = centerW * SIDE_TO_CENTER_RATIO;

  const centerH = clamp(centerW * 1.0, 260, 420);
  const sideH = clamp(sideW * 1.0625, 240, 400);

  return {
    gap,
    center: { w: centerW, h: centerH },
    side: { w: sideW, h: sideH },
  };
}

/* =====================================================
   TESTIMONIAL CARD — the existing section background
   and statistics are intentionally not changed.
===================================================== */

function TestimonialCard({
  testimonial,
  active = false,
  onSelect,
  width,
  height,
  hidden = false,
}) {
  const CardTag = active ? "article" : "button";

  return (
    <div
      className="relative flex flex-none flex-col pb-[45px] gap-2"
      style={{
        width,
        transition: "width 300ms ease, opacity 300ms ease",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
      }}
      aria-hidden={hidden || undefined}
    >
      <CardTag
        {...(!active
          ? {
              type: "button",
              onClick: onSelect,
              "aria-label": `Show testimonial from ${testimonial.name}`,
            }
          : {})}
        className={`relative flex w-full flex-col items-center overflow-hidden rounded-[22px] border px-2 pt-8 pb-[66px] text-center ${
          active
            ? "border-transparent bg-[#E37383] text-white shadow-[0_20px_45px_rgba(0,34,97,0.18)]"
            : "cursor-pointer border-primary/15 bg-white/30 text-text-dark shadow-[0_5px_20px_rgba(0,0,0,0.05)] hover:border-accent/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        }`}
        style={{ height, transition: "height 300ms ease" }}
      >
        {/* Quote mark with a short line on either side */}
        <div className="mb-5 flex w-full max-w-[260px] items-center justify-center gap-2">
          <span
            className={`h-px min-w-0 flex-1 ${
              active ? "bg-white/90" : "bg-accent/60"
            }`}
            aria-hidden="true"
          />
          <span
            className={`font-serif text-[64px] leading-[0.65] mt-10 ${
              active ? "text-white" : "text-accent"
            }`}
            aria-hidden="true"
          >
            "
          </span>
          <span
            className={`h-px min-w-0 flex-1 ${
              active ? "bg-white/90" : "bg-accent/60"
            }`}
            aria-hidden="true"
          />
        </div>

        {/* Full CMS quote: no truncation or View More */}
        <p
          className={`m-0 font-heading leading-[1.8] ${
            active
              ? "text-[15px] text-white/95 max-[600px]:text-[14px]"
              : "text-[14px] text-text"
          }`}
        >
          {testimonial.quote}
        </p>

        <div className="mt-auto pt-6">
          <img
            className="mx-auto mb-3 h-[21px] w-auto"
            src={stars}
            alt="5 out of 5 stars"
          />
          <p
            className={`m-0 font-heading text-[17px] font-bold ${
              active ? "text-white" : "text-text-dark"
            }`}
          >
            {testimonial.name}
          </p>
        </div>
      </CardTag>

      {/* Circular patient photo overlaps the bottom of the card */}
      <div
        className="  absolute bottom-0 left-1/2 h-[80px] w-[80px] -translate-x-1/2 -translate-y-[-3px] rounded-full border border-accent/60 bg-white p-[4px]"
        aria-hidden="true"
      >
        <img
          className=" h-full w-full rounded-full object-cover object-center"
          src={testimonial.photo_url || patientPhoto}
          alt=""
        />
      </div>
    </div>
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

  const reducedMotion = useReducedMotion();

  const [viewportRef, containerWidth] = useContainerWidth();
  const metrics = useCardMetrics(containerWidth);

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
     CONTINUOUS BELT CAROUSEL
     Cards are cloned at each end so the strip can loop
     forever; when a clone finishes sliding fully into
     view we silently snap back to the matching real card
     with the transition switched off for one frame.
     Card widths are sized (see useCardMetrics) so exactly
     3 cards fill the measured container width — nothing
     is ever permanently cropped.
  ==================================================== */

  const N = testimonialList.length;
  const hasMultiple = N > 1;

  const extendedList = hasMultiple
    ? [testimonialList[N - 1], ...testimonialList, testimonialList[0]]
    : testimonialList;

  // Extended index: 1..N are the real items, 0 and N+1 are clones.
  const [extIndex, setExtIndex] = useState(hasMultiple ? 1 : 0);
  const [noTransition, setNoTransition] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // On first load, no card has been shown to the left yet — hide that slot
  // until the very first navigation happens.
  const [hasStarted, setHasStarted] = useState(false);

  const realIndexOf = (j) => (((j - 1 + N) % N) + N) % N;
  const activeIndex = hasMultiple ? realIndexOf(extIndex) : 0;

  const goNext = () => {
    setHasStarted(true);
    setExtIndex((i) => i + 1);
  };
  const goPrev = () => {
    setHasStarted(true);
    setExtIndex((i) => i - 1);
  };
  const goTo = (targetRealIndex) => {
    setHasStarted(true);
    setExtIndex(targetRealIndex + 1);
  };

  const handleTransitionEnd = () => {
    if (!hasMultiple) return;
    if (extIndex === extendedList.length - 1) {
      // Slid onto the clone of the first item — snap back to the real first item.
      setNoTransition(true);
      setExtIndex(1);
    } else if (extIndex === 0) {
      // Slid onto the clone of the last item — snap back to the real last item.
      setNoTransition(true);
      setExtIndex(N);
    }
  };

  useEffect(() => {
    if (!noTransition) return;
    const id = requestAnimationFrame(() => setNoTransition(false));
    return () => cancelAnimationFrame(id);
  }, [noTransition]);

  // Autoplay — pauses while hovered/focused.
  useEffect(() => {
    if (!hasMultiple || !contentVisible || isInteracting || reducedMotion) {
      return;
    }

    const id = setInterval(goNext, 6000);
    return () => clearInterval(id);
  }, [hasMultiple, contentVisible, isInteracting, reducedMotion, extIndex]);

  if (!loading && !visible) return null;
  if (!testimonialList.length) return null;

  // Track offset: distance from the strip's start to the current card's
  // centre. Every card before the active one is a side-slot, so the sum
  // is just index * (sideWidth + gap), plus half the active card's own width.
  const offset =
    extIndex * (metrics.side.w + metrics.gap) + metrics.center.w / 2;

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
      className="relative isolate w-full bg-[#15350e] bg-cover bg-center pb-[60px]"
      style={{
        backgroundImage: `url(${content.background_image_url || bgImage})`,
      }}
    >
      {/* Background Overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-[rgba(21,53,14,0.82)] backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="container relative z-20">
        <div className="-translate-y-1/2 max-[900px]:mt-5 max-[900px]:translate-y-2">
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
                  max-[520px]:py-6
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
                {STAT_ICONS[i] && (
                  <div className="flex h-[60px] w-[60px] flex-none items-center justify-center">
                    {STAT_ICONS[i]}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="m-0 font-heading text-[32px] leading-[1.2] font-bold text-primary max-[600px]:text-[28px]">
                    {formatCount(stat.value, countProgress)}
                  </p>

                  <p className="m-0 font-heading text-[15px] leading-[1.5] text-text-dark">
                    {stat.label}
                  </p>
                </div>

                {i < stats.length - 1 && (
                  <span
                    className="absolute top-1/2 right-[-12px] h-[60px] w-px -translate-y-1/2 bg-black/15 max-[1100px]:hidden"
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
            <p className="font-heading text-lg leading-[1.8] text-white/90">
              {content.intro_text}
            </p>
          </div>
        </div>

        {/* Continuous belt carousel */}
        <div
          className={`relative mx-auto w-full ${revealClass(contentVisible)}`}
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
          {/* Viewport: full width of the section. Cards are sized (see
              useCardMetrics) so exactly 3 of them fill this width exactly —
              nothing is permanently cropped. overflow-hidden only clips the
              extra clone cards that are sliding in/out during a transition. */}
          <div
            ref={viewportRef}
            className="relative w-full overflow-hidden"
            style={{ height: metrics.center.h + 52 }}
          >
            {/* Track: left:50% anchors its start to the viewport centre;
                translateX(-offset) then pulls the active card's own centre
                back onto that anchor point. */}
            <div
              className="absolute top-0 flex items-start"
              style={{
                left: "50%",
                gap: metrics.gap,
                transform: `translateX(-${offset}px)`,
                transition:
                  reducedMotion || noTransition
                    ? "none"
                    : "transform 300ms ease",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedList.map((testimonial, j) => {
                const isActive = j === extIndex;
                const realIndex = hasMultiple ? realIndexOf(j) : 0;
                const isLeftNeighbor = j === extIndex - 1;
                const hideForNow = !hasStarted && isLeftNeighbor;

                return (
                  <TestimonialCard
                    key={`card-${j}`}
                    testimonial={testimonial}
                    active={isActive}
                    onSelect={() => goTo(realIndex)}
                    width={isActive ? metrics.center.w : metrics.side.w}
                    height={isActive ? metrics.center.h : metrics.side.h}
                    hidden={hideForNow}
                  />
                );
              })}
            </div>
          </div>

          {hasMultiple && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <ArrowButton direction="previous" onClick={goPrev} />

              <div className="flex items-center justify-center gap-2">
                {testimonialList.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show testimonial ${i + 1}`}
                    aria-current={i === activeIndex ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all duration-200 ${
                      i === activeIndex
                        ? "w-6 bg-accent"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <ArrowButton direction="next" onClick={goNext} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
