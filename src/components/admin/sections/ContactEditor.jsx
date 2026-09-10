import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';

export default function ContactEditor({ initialContent, initialVisible }) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const { save, saving, lastSaved, error } = useSaveSection('contact');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel
      title="Contact Us page"
      description="Banner, clinic details and enquiry form copy on /contact-us"
      visible={visible}
      onVisibleChange={setVisible}
      lastSaved={lastSaved}
    >
      <Field label="Banner eyebrow">
        <TextInput value={content.banner_eyebrow} onChange={set('banner_eyebrow')} />
      </Field>
      <Field label="Banner heading">
        <TextInput value={content.banner_heading} onChange={set('banner_heading')} />
      </Field>
      <Field label="Banner text">
        <TextArea value={content.banner_text} onChange={set('banner_text')} rows={2} />
      </Field>

      <Field label="Address" hint="Used for the live map, directions link and the contact details list">
        <TextArea value={content.address} onChange={set('address')} rows={2} />
      </Field>

      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Latitude" hint="Optional — pins the map exactly instead of searching the address text">
          <TextInput value={content.latitude} onChange={set('latitude')} placeholder="e.g. 23.024412" />
        </Field>
        <Field label="Longitude">
          <TextInput value={content.longitude} onChange={set('longitude')} placeholder="e.g. 72.528725" />
        </Field>
      </div>

      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Phone">
          <TextInput value={content.phone} onChange={set('phone')} />
        </Field>
        <Field label="Email">
          <TextInput value={content.email} onChange={set('email')} type="email" />
        </Field>
      </div>

      <Field label="Appointment note" hint="Small pink pill shown above the contact details list">
        <TextInput value={content.appointment_note} onChange={set('appointment_note')} />
      </Field>

      <Field label="Map info card" hint="Text shown when the map marker pin is clicked">
        <div className="flex flex-col gap-3">
          <TextInput value={content.map_label_name} onChange={set('map_label_name')} placeholder="Name, e.g. KRISHNORMI" />
          <TextInput value={content.map_label_line1} onChange={set('map_label_line1')} placeholder="Line 1" />
          <TextInput value={content.map_label_line2} onChange={set('map_label_line2')} placeholder="Line 2" />
        </div>
      </Field>

      <Field label="Get in Touch intro text" hint="Paragraph shown under the 'Get in Touch' heading">
        <TextArea value={content.connect_text} onChange={set('connect_text')} rows={2} />
      </Field>

      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Appointment form heading">
          <TextInput value={content.form_title} onChange={set('form_title')} />
        </Field>
        <Field label="Appointment form subtitle">
          <TextInput value={content.form_subtitle} onChange={set('form_subtitle')} />
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
