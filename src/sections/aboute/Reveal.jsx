import {
  useReducedMotion,
  useRevealOnce,
  revealClass,
} from "../../hooks/useScrollReveal";

export default function Reveal({ children, className = "", delay = 0 }) {
  const reducedMotion = useReducedMotion();
  const [ref, visible] = useRevealOnce(reducedMotion);

  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` }}
      className={`${revealClass(visible, className)} kr-reveal ${
        visible ? "kr-reveal-visible" : "kr-reveal-hidden"
      }`}
    >
      {children}
    </div>
  );
}
