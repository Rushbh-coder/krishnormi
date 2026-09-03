import { Toggle } from './fields';

export default function SectionPanel({ title, description, visible, onVisibleChange, lastSaved, children }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-[18px] rounded-2xl border border-[#e4eae7] bg-white px-6 py-[22px] shadow-[0_8px_24px_-8px_rgba(15,33,28,0.05)] max-[900px]:w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-heading text-xl font-semibold text-[#101828]">{title}</p>
          {description && <p className="mt-[3px] font-body text-xs text-[#98a2b3]">{description}</p>}
        </div>
        {onVisibleChange && (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-[7px] font-heading text-xs font-semibold ${
              visible ? 'border-[#d6ebe1] bg-[#edf7f2] text-[#0b6b45]' : 'border-[#e4e7e5] bg-[#f5f6f5] text-[#7a8d87]'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${visible ? 'bg-[#0b6b45]' : 'bg-[#a1aea9]'}`} aria-hidden="true" />
            {visible ? 'Visible' : 'Hidden'}
          </span>
        )}
      </div>

      <hr className="m-0 border-none border-t border-t-[#eaecf0]" />

      {children}

      {onVisibleChange && (
        <Toggle
          checked={visible}
          onChange={onVisibleChange}
          label="Show this section"
          hint="Hide it without deleting its content"
        />
      )}

      {lastSaved && (
        <div className="flex items-center justify-between font-body text-[11px] text-[#98a2b3]">
          <p>Last saved {lastSaved}</p>
        </div>
      )}
    </div>
  );
}
