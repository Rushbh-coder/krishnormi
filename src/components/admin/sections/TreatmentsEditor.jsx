import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField, ListEditor } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';
import bgImage from '../../../assets/treatments/bg-1.png';
import heroTreatment from '../../../assets/treatments/hero-treatment.png';

export default function TreatmentsEditor({ initialContent, initialVisible }) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const { save, saving, lastSaved, error } = useSaveSection('treatments');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel title="Treatments & procedures" description="Treatments intro and the 4 procedure cards" visible={visible} onVisibleChange={setVisible} lastSaved={lastSaved}>
      <Field label="Section title">
        <TextInput value={content.title} onChange={set('title')} />
      </Field>

      <Field label="Body text">
        <TextArea value={content.body_text} onChange={set('body_text')} rows={3} />
      </Field>

      <Field label="Button label">
        <TextInput value={content.button_label} onChange={set('button_label')} />
      </Field>

      <div className="flex gap-4 max-[900px]:flex-col">
        <ImageUploadField label="Background image" value={content.background_image_url} onChange={set('background_image_url')} folder="treatments" fallback={bgImage} />
        <ImageUploadField label="Illustration image" value={content.hero_image_url} onChange={set('hero_image_url')} folder="treatments" fallback={heroTreatment} />
      </div>

      <Field label="Procedure cards (4 fixed slots)">
        <ListEditor
          items={content.cards}
          onChange={set('cards')}
          fixedLength
          renderItem={(card, update) => (
            <>
              <label className="flex items-center gap-2 font-body text-xs text-[#536660]">
                <input type="checkbox" checked={!!card.featured} onChange={(e) => update({ featured: e.target.checked })} />
                Featured card
              </label>
              <TextInput value={card.title} onChange={(v) => update({ title: v })} placeholder="Title" />
              <TextArea value={card.text} onChange={(v) => update({ text: v })} rows={2} placeholder="Text" />
            </>
          )}
        />
      </Field>

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
