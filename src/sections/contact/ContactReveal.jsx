import { useEffect, useRef, useState } from "react";

export default function ContactReveal({
  children,
  className = "",
  variant = "up",
  delay = 700,
}) {
  const elementRef = useRef(null);

  const [revealed, setRevealed] = useState(
    () =>
      typeof window === "undefined" ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (revealed) return;

    const element = elementRef.current;
    if (!element) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const show = () => setRevealed(true);

    if (media.matches || !("IntersectionObserver" in window)) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -32px 0px",
      },
    );

    const onMotionChange = (event) => {
      if (event.matches) show();
    };

    observer.observe(element);
    media.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", onMotionChange);
    };
  }, [revealed]);

  return (
    <div
      ref={elementRef}
      className={`contact-reveal ${revealed ? "is-visible" : ""} ${className}`}
      data-reveal={variant}
      style={{
        "--contact-delay": `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
