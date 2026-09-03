import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

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

export function TextArea({ value, onChange, rows = 3, ...props }) {
  return (
    <div className={INPUT_WRAP}>
      <textarea
        className={`${INPUT} h-auto resize-none py-3`}
        rows={rows}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
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
export function ListEditor({ items, onChange, renderItem, addLabel, newItem, fixedLength }) {
  const updateItem = (index, patch) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };
  const removeItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };
  const addItem = () => {
    onChange([...items, newItem()]);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="relative flex flex-col gap-3 rounded-xl border border-[#e4eae7] bg-white p-4">
          {!fixedLength && (
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="absolute top-3 right-3 bg-transparent p-0 font-heading text-xs font-semibold text-[#df2759] hover:underline"
            >
              Remove
            </button>
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

/** Uploads to the `site-media` storage bucket under `folder/` and reports back the public URL. */
export function ImageUploadField({ label, value, onChange, folder, fallback }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    setUploading(true);
    const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    const { error: uploadError } = await supabase.storage.from('site-media').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    setUploading(false);
    if (uploadError) {
      setError(uploadError.message);
      return;
    }
    const { data } = supabase.storage.from('site-media').getPublicUrl(path);
    onChange(data.publicUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className={LABEL}>{label}</label>}
      <div className="flex h-28 items-center gap-4 rounded-xl border border-dashed border-[#cfddd7] bg-[#fafcfb] px-[18px]">
        <div className="h-20 w-20 flex-none overflow-hidden rounded-lg bg-gradient-to-r from-[#e8f7f0] to-[#fce8f0]">
          {(value || fallback) && (
            <img src={value || fallback} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="flex flex-col gap-[5px]">
          <p className="font-body text-[11px] break-all text-[#98a2b3]">{value ? value.split('/').pop() : 'Using default image'}</p>
          <button
            type="button"
            className="self-start bg-transparent p-0 font-heading text-xs font-semibold text-[#0b6b45] hover:underline disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Replace image'}
          </button>
          {error && <p className="font-body text-[11px] text-[#df2759]">{error}</p>}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>
    </div>
  );
}
