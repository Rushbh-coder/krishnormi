import { useEffect, useRef, useState } from 'react';

// Tailwind statically scans source text for complete class names — a
// template string like `line-clamp-${lines}` is invisible to that scanner,
// so the CSS for it never gets generated. Every value this component can
// use must appear literally, spelled out, somewhere in this file.
const LINE_CLAMP_CLASSES = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

/**
 * Clamps admin-editable text to a fixed number of lines and shows a
 * "View more" toggle only when the text actually overflows that clamp —
 * so short content renders exactly as before, and long content never
 * stretches or distorts the surrounding layout.
 *
 * The toggle is a sibling directly under the clamped text, not nested inside
 * it: `-webkit-line-clamp` clips anything past its N lines rather than
 * wrapping it, so a button nested inside the clamp can silently disappear
 * whenever the last line doesn't have room for it. Keeping it outside (with
 * no top margin, so it sits flush against the text) guarantees it's always
 * visible while still reading as attached to the text, not a detached line.
 */
export default function ExpandableText({ text, lines = 3, className = '', toggleClassName = '', as: Tag = 'p' }) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    measure();

    // Web fonts (Poppins/Inter) can finish loading after this first measurement,
    // and swapping from the fallback font changes how the text wraps — re-check
    // once they're ready so overflow isn't judged against the wrong metrics.
    if (document.fonts?.ready) {
      document.fonts.ready.then(measure);
    }
    // Only re-check when the content itself changes, not when the user toggles
    // expanded/collapsed (that would remeasure against the wrong clamp state).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, lines]);

  if (!text) return null;

  return (
    <div>
      <Tag ref={ref} className={`${className} ${expanded ? '' : LINE_CLAMP_CLASSES[lines] || LINE_CLAMP_CLASSES[3]}`}>
        {text}
      </Tag>
      {overflowing && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={toggleClassName || 'block font-heading text-sm font-semibold text-accent hover:underline'}
        >
          {expanded ? 'View less' : 'View more'}
        </button>
      )}
    </div>
  );
}
