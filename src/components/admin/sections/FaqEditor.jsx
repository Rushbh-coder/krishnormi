import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField, ListEditor } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';
import photo from '../../../assets/faq/photo.png';

export default function FaqEditor({ initialContent, initialVisible }) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const { save, saving, lastSaved, error } = useSaveSection('faq');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel title="FAQ" description="Frequently asked questions accordion" visible={visible} onVisibleChange={setVisible} lastSaved={lastSaved}>
      <Field label="Intro text">
        <TextArea value={content.intro_text} onChange={set('intro_text')} rows={2} />
      </Field>

      <ImageUploadField label="Photo" value={content.photo_url} onChange={set('photo_url')} folder="faq" fallback={photo} />

      <Field label="Questions">
        <ListEditor
          items={content.items}
          onChange={set('items')}
          addLabel="Add question"
          newItem={() => ({ question: '', answer: '' })}
          renderItem={(item, update) => (
            <>
              <TextInput value={item.question} onChange={(v) => update({ question: v })} placeholder="Question" />
              <TextArea value={item.answer} onChange={(v) => update({ answer: v })} rows={2} placeholder="Answer (leave blank to hide the answer on the public site)" />
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
