import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField, ListEditor } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';
import doctorPhoto from '../../../assets/awards/doctor-award-photo.png';

export default function AwardsEditor({ initialContent, initialVisible }) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const { save, saving, lastSaved, error } = useSaveSection('awards');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel title="Awards & recognition" description="Awards intro and the 4 recognition cards" visible={visible} onVisibleChange={setVisible} lastSaved={lastSaved}>
      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Section title">
          <TextInput value={content.title} onChange={set('title')} />
        </Field>
        <Field label="Subtitle">
          <TextInput value={content.subtitle} onChange={set('subtitle')} />
        </Field>
      </div>

      <Field label="Body paragraph 1">
        <TextArea value={content.body_text_1} onChange={set('body_text_1')} rows={3} />
      </Field>
      <Field label="Body paragraph 2">
        <TextArea value={content.body_text_2} onChange={set('body_text_2')} rows={2} />
      </Field>

      <Field label="Highlights title">
        <TextInput value={content.highlights_title} onChange={set('highlights_title')} />
      </Field>
      <Field label="Highlights text">
        <TextArea value={content.highlights_text} onChange={set('highlights_text')} rows={3} />
      </Field>

      <ImageUploadField label="Photo" value={content.photo_url} onChange={set('photo_url')} folder="awards" fallback={doctorPhoto} />

      <Field label="Recognition cards (4 fixed slots)">
        <ListEditor
          items={content.cards}
          onChange={set('cards')}
          fixedLength
          renderItem={(card, update) => (
            <>
              <TextInput value={card.title} onChange={(v) => update({ title: v })} placeholder="Title" />
              <TextArea value={card.description} onChange={(v) => update({ description: v })} rows={2} placeholder="Description" />
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
