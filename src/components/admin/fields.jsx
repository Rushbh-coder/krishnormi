import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ExpandableText from '../ExpandableText';
import ImageReplaceModal from './ImageReplaceModal';

const LABEL = 'font-heading text-[13px] font-semibold text-[#344054]';
const HINT = 'font-body text-[11px] text-[#98a2b3]';
const INPUT_WRAP = 'rounded-[10px] border border-[#dce4e0] bg-white shadow-[0_2px_5px_0_rgba(15,33,28,0.03)]';
const INPUT =
  'h-[46px] w-full rounded-[10px] border-none bg-transparent px-3.5 font-body text-sm text-[#344054] focus:outline-2 focus:-outline-offset-1 focus:outline-primary';

export function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-[7px]">
      {label && <label className={LABEL}>{label}</label>}
      {children}
      {hint && <p className={HINT}>{hint}</p>}
    </div>
  );
}

export function TextInput({ value, onChange, ...props }) {
  return (
    <div className={INPUT_WRAP}>
      <input
        className={INPUT}
        type="text"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </div>
  );
}

export function TextArea({ value, onChange, rows = 3, maxLength = 500, previewLines = 3, ...props }) {
  const text = value ?? '';
  const charCount = text.length;
  const overLimit = charCount >= maxLength;

  const handleChange = (event) => {
    onChange(event.target.value.slice(0, maxLength));
  };

  return (
    <div className="flex flex-col gap-1">
      <div className={INPUT_WRAP}>
        <textarea
          className={`${INPUT} h-auto resize-none py-3`}
          rows={rows}
          maxLength={maxLength}
          value={text}
          onChange={handleChange}
          {...props}
        />
      </div>
      <p className={`self-end font-body text-[11px] ${overLimit ? 'text-[#df2759]' : 'text-[#98a2b3]'}`}>
        {charCount}/{maxLength}
      </p>
      {text && previewLines > 0 && (
        <div className="rounded-[8px] border border-dashed border-[#dce4e0] bg-[#fafcfb] px-3 py-2">
          <p className="mb-1 font-body text-[10px] font-semibold tracking-[0.04em] text-[#98a2b3] uppercase">
            Live page preview
          </p>
          <ExpandableText
            text={text}
            lines={previewLines}
            className="font-body text-[13px] leading-[1.5] text-[#344054]"
            toggleClassName="mt-0.5 block font-heading text-xs font-semibold text-[#14733e] hover:underline"
          />
        </div>
      )}
    </div>
  );
}

export function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex h-[62px] items-center justify-between rounded-[11px] border border-[#e4eae7] bg-[#f7faf8] px-3.5">
      <div>
        <p className="font-heading text-[13px] font-semibold text-[#344054]">{label}</p>
        {hint && <p className="mt-[3px] font-body text-[11px] text-[#98a2b3]">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`relative h-6 w-[42px] flex-none rounded-full border-none p-0 transition-colors duration-200 ${
          checked ? 'bg-primary' : 'bg-[#d0d5dd]'
        }`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-transform duration-200 ${
            checked ? 'translate-x-[18px]' : ''
          }`}
        />
      </button>
    </div>
  );
}

/** Editable list of objects. Fixed-length lists (matching a fixed visual template, e.g. 4 feature
 * cards with fixed icons) hide add/remove; variable-length lists (testimonials, FAQ items) show them. */
export function ListEditor({ items, onChange, renderItem, addLabel, newItem, fixedLength, reorderable, moveHint }) {
  const updateItem = (index, patch) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };
  const addItem = () => {
    onChange([...items, newItem()]);
  };
  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {moveHint && !fixedLength && reorderable && (
        <p className="-mt-1 font-body text-[11px] text-[#98a2b3]">{moveHint}</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="relative flex flex-col gap-3 rounded-xl border border-[#e4eae7] bg-white p-4">
          {!fixedLength && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              {reorderable && (
                <>
                  <button
                    type="button"
                    onClick={() => moveItem(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    title="Move up"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dce4e0] bg-white p-0 text-[#536660] transition-colors duration-150 hover:bg-[#f7f9f8] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(i, 1)}
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                    title="Move down"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dce4e0] bg-white p-0 text-[#536660] transition-colors duration-150 hover:bg-[#f7f9f8] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => removeItem(i)}
                aria-label="Remove"
                title="Remove"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[#f7c8d5] bg-[#fce8ee] p-0 text-[#df2759] transition-colors duration-150 hover:bg-[#df2759] hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}
          {renderItem(item, (patch) => updateItem(i, patch), i)}
        </div>
      ))}
      {!fixedLength && (
        <button
          type="button"
          onClick={addItem}
          className="self-start rounded-[10px] border border-dashed border-[#cfddd7] bg-[#fafcfb] px-4 py-2.5 font-heading text-sm font-semibold text-[#14733e]"
        >
          + {addLabel}
        </button>
      )}
    </div>
  );
}

/** Uploads to the `site-media` storage bucket under `folder/` and reports back the public URL.
 * Picking a file opens a crop/zoom/preview modal before anything is actually uploaded. */
export function ImageUploadField({ label, value, onChange, folder, fallback, aspect }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  const modalOpen = !!pendingFile || previewOpen;

  const handlePick = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    setPendingFile(file);
  };

  const closeModal = () => {
    setPendingFile(null);
    setPreviewOpen(false);
  };

  const handleConfirm = async (blob) => {
    setUploading(true);
    const baseName = pendingFile ? pendingFile.name.replace(/\.[^.]+$/, '') : (value || 'image').split('/').pop().replace(/\.[^.]+$/, '');
    const originalName = baseName + (blob.type === 'image/png' ? '.png' : '.jpg');
    const path = `${folder}/${Date.now()}-${originalName.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('site-media').upload(path, blob, {
      cacheControl: '3600',
      upsert: false,
      contentType: blob.type,
    });
    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    const { data } = supabase.storage.from('site-media').getPublicUrl(path);
    onChange(data.publicUrl);
    closeModal();
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className={LABEL}>{label}</label>}
      <div className="flex h-28 items-center gap-4 rounded-xl border border-dashed border-[#cfddd7] bg-[#fafcfb] px-[18px]">
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          disabled={uploading || !(value || fallback)}
          aria-label="Preview image"
          title="Click to preview image"
          className="group relative h-20 w-20 flex-none overflow-hidden rounded-lg border-none bg-gradient-to-r from-[#e8f7f0] to-[#fce8f0] p-0 disabled:cursor-not-allowed"
        >
          {(value || fallback) && (
            <img src={value || fallback} alt="" className="h-full w-full object-cover" />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-150 group-hover:bg-black/40 group-hover:opacity-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 5c-5 0-8.5 4-9.5 7 1 3 4.5 7 9.5 7s8.5-4 9.5-7c-1-3-4.5-7-9.5-7Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="2.5" stroke="white" strokeWidth="1.5" />
            </svg>
          </span>
        </button>
        <div className="flex flex-col gap-[5px]">
          <p className="font-body text-[11px] break-all text-[#98a2b3]">{value ? value.split('/').pop() : 'Using default image'}</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="self-start bg-transparent p-0 font-heading text-xs font-semibold text-[#344054] hover:underline disabled:opacity-50"
              onClick={() => setPreviewOpen(true)}
              disabled={uploading || !(value || fallback)}
            >
              Preview
            </button>
            <button
              type="button"
              className="self-start bg-transparent p-0 font-heading text-xs font-semibold text-[#0b6b45] hover:underline disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Replace image'}
            </button>
          </div>
          {error && <p className="font-body text-[11px] text-[#df2759]">{error}</p>}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePick} />
        </div>
      </div>

      {modalOpen && (
        <ImageReplaceModal
          file={pendingFile}
          currentUrl={value}
          fallbackUrl={fallback}
          recommendedAspect={aspect}
          confirming={uploading}
          onCancel={closeModal}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
