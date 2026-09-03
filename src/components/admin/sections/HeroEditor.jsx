import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';
import heroBackground from '../../../assets/hero/hero-background.png';

export default function HeroEditor({ initialContent, initialVisible }) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const { save, saving, lastSaved, error } = useSaveSection('hero');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel title="Hero banner" description="Primary message visitors see first" visible={visible} onVisibleChange={setVisible} lastSaved={lastSaved}>
      <Field label="Heading" hint="Recommended: up to 65 characters">
        <TextInput value={content.heading} onChange={set('heading')} maxLength={65} />
      </Field>

      <Field label="Supporting text">
        <TextArea value={content.supporting_text} onChange={set('supporting_text')} rows={2} />
      </Field>

      <Field label="Body paragraph 1">
        <TextArea value={content.body_text_1} onChange={set('body_text_1')} rows={3} />
      </Field>

      <Field label="Body paragraph 2">
        <TextArea value={content.body_text_2} onChange={set('body_text_2')} rows={3} />
      </Field>

      <ImageUploadField label="Background image" value={content.image_url} onChange={set('image_url')} folder="hero" fallback={heroBackground} />

      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Button label">
          <TextInput value={content.button_label} onChange={set('button_label')} />
        </Field>
        <Field label="Button link">
          <TextInput value={content.button_link} onChange={set('button_link')} />
        </Field>
      </div>

      {error && <p className="font-body text-sm text-[#df2759]">{error}</p>}

      <button
        type="button"
        onClick={() => save(content, visible)}
        disabled={saving}
        className="self-start rounded-[10px] bg-[#df2759] px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-[0_6px_14px_-4px_rgba(224,38,89,0.16)] disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </SectionPanel>
  );
}
