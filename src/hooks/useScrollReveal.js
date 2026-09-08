import { useEffect, useRef, useState } from 'react';

/** Tracks the user's OS-level "reduce motion" preference so animations can be skipped for them. */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

/** Fades an element in once, the first time it scrolls into view. Attach `ref` to the element
 * being observed, and use `visible` to drive a transition (see `revealClass` below). */
export function useRevealOnce(reducedMotion) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const element = ref.current;
    if (!element) return;

    if (reducedMotion || typeof IntersectionObserver === 'undefined') {
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
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [visible, reducedMotion]);

  return [ref, visible];
}

/** Shared fade-up transition classes — pass the `visible` flag from useRevealOnce. */
export function revealClass(isVisible, extra = '') {
  return `transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
  } ${extra}`;
}
