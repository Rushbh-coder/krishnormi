import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField, ListEditor } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';
import photoTop from '../../../assets/about/photo-2.png';
import photoBottom from '../../../assets/about/photo-4.png';

export default function AboutEditor({ initialContent, initialVisible }) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const { save, saving, lastSaved, error } = useSaveSection('about');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel title="Introduction" description="The “Welcome to KRISHNORMI” about block" visible={visible} onVisibleChange={setVisible} lastSaved={lastSaved}>
      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Eyebrow text">
          <TextInput value={content.eyebrow_text} onChange={set('eyebrow_text')} />
        </Field>
        <Field label="Heading">
          <TextInput value={content.heading} onChange={set('heading')} />
        </Field>
      </div>

      <Field label="Lead text">
        <TextArea value={content.lead_text} onChange={set('lead_text')} rows={2} />
      </Field>

      <Field label="Body paragraph 1">
        <TextArea value={content.body_text_1} onChange={set('body_text_1')} rows={3} />
      </Field>
      <Field label="Body paragraph 2">
        <TextArea value={content.body_text_2} onChange={set('body_text_2')} rows={2} />
      </Field>
      <Field label="Body paragraph 3">
        <TextArea value={content.body_text_3} onChange={set('body_text_3')} rows={3} />
      </Field>

      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Button label">
          <TextInput value={content.cta_label} onChange={set('cta_label')} />
        </Field>
        <Field label="Button link">
          <TextInput value={content.cta_link} onChange={set('cta_link')} />
        </Field>
      </div>

      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Badge number">
          <TextInput value={content.badge_number} onChange={set('badge_number')} />
        </Field>
        <Field label="Badge label">
          <TextInput value={content.badge_label} onChange={set('badge_label')} />
        </Field>
      </div>

      <div className="flex gap-4 max-[900px]:flex-col">
        <ImageUploadField label="Top photo" value={content.photo_top_url} onChange={set('photo_top_url')} folder="about" fallback={photoTop} />
        <ImageUploadField label="Bottom photo" value={content.photo_bottom_url} onChange={set('photo_bottom_url')} folder="about" fallback={photoBottom} />
      </div>

      <Field label="Signature block">
        <div className="flex flex-col gap-3">
          <TextInput value={content.signature_role} onChange={set('signature_role')} placeholder="Role" />
          <TextArea value={content.signature_note} onChange={set('signature_note')} rows={2} placeholder="Note" />
          <TextInput value={content.signature_name} onChange={set('signature_name')} placeholder="Name" />
        </div>
      </Field>

      <Field label="“Our focus” cards (4 fixed slots)">
        <ListEditor
          items={content.focus_items}
          onChange={set('focus_items')}
          fixedLength
          renderItem={(item, update) => (
            <>
              <TextInput value={item.title} onChange={(v) => update({ title: v })} placeholder="Title" />
              <TextArea value={item.description} onChange={(v) => update({ description: v })} rows={2} placeholder="Description" />
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
