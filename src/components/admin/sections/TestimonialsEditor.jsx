import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField, ListEditor } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';
import bgImage from '../../../assets/testimonials/bg.png';
import patientPhoto from '../../../assets/testimonials/patient-photo.png';

export default function TestimonialsEditor({ initialContent, initialVisible }) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const { save, saving, lastSaved, error } = useSaveSection('testimonials');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel title="Testimonials" description="Stat bar and patient testimonials" visible={visible} onVisibleChange={setVisible} lastSaved={lastSaved}>
      <Field label="Section title">
        <TextInput value={content.title} onChange={set('title')} />
      </Field>
      <Field label="Intro text">
        <TextArea value={content.intro_text} onChange={set('intro_text')} rows={2} />
      </Field>

      <ImageUploadField label="Background image" value={content.background_image_url} onChange={set('background_image_url')} folder="testimonials" fallback={bgImage} />

      <Field label="Stats (4 fixed slots)">
        <ListEditor
          items={content.stats}
          onChange={set('stats')}
          fixedLength
          renderItem={(stat, update) => (
            <div className="flex gap-3">
              <TextInput value={stat.value} onChange={(v) => update({ value: v })} placeholder="Value, e.g. 20+" />
              <TextInput value={stat.label} onChange={(v) => update({ label: v })} placeholder="Label" />
            </div>
          )}
        />
      </Field>

      <Field label="Patient testimonials" hint="The first one is shown on the public site.">
        <ListEditor
          items={content.testimonials}
          onChange={set('testimonials')}
          addLabel="Add testimonial"
          newItem={() => ({ name: '', photo_url: null, quote: '' })}
          renderItem={(item, update) => (
            <>
              <TextInput value={item.name} onChange={(v) => update({ name: v })} placeholder="Patient name" />
              <ImageUploadField value={item.photo_url} onChange={(v) => update({ photo_url: v })} folder="testimonials" fallback={patientPhoto} />
              <TextArea value={item.quote} onChange={(v) => update({ quote: v })} rows={3} placeholder="Quote" />
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
