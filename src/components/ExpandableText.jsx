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
 */
export default function ExpandableText({ text, lines = 3, className = '', toggleClassName = '', as: Tag = 'p' }) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
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
          className={toggleClassName || 'mt-1.5 font-heading text-sm font-semibold text-accent hover:underline'}
        >
          {expanded ? 'View less' : 'View more'}
        </button>
      )}
    </div>
  );
}
