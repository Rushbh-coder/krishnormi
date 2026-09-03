import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';

export default function FooterEditor({ initialContent }) {
  const [content, setContent] = useState(initialContent);
  const { save, saving, lastSaved, error } = useSaveSection('footer');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel title="Footer" description="Sitewide contact details and social links" lastSaved={lastSaved}>
      <Field label="Tagline">
        <TextInput value={content.tagline} onChange={set('tagline')} />
      </Field>
      <Field label="Description">
        <TextArea value={content.description} onChange={set('description')} rows={2} />
      </Field>
      <Field label="Address">
        <TextArea value={content.address} onChange={set('address')} rows={2} />
      </Field>
      <div className="flex gap-4 max-[900px]:flex-col">
        <Field label="Email">
          <TextInput value={content.email} onChange={set('email')} type="email" />
        </Field>
        <Field label="Phone">
          <TextInput value={content.phone} onChange={set('phone')} />
        </Field>
      </div>

      <Field label="Social links">
        <div className="flex flex-col gap-3">
          <TextInput value={content.facebook_url} onChange={set('facebook_url')} placeholder="Facebook URL" />
          <TextInput value={content.linkedin_url} onChange={set('linkedin_url')} placeholder="LinkedIn URL" />
          <TextInput value={content.google_url} onChange={set('google_url')} placeholder="Google URL" />
          <TextInput value={content.twitter_url} onChange={set('twitter_url')} placeholder="Twitter / X URL" />
        </div>
      </Field>

      {error && <p className="font-body text-sm text-[#df2759]">{error}</p>}

      <button
        type="button"
        onClick={() => save(content, true)}
        disabled={saving}
        className="self-start rounded-[10px] bg-[#df2759] px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-[0_6px_14px_-4px_rgba(224,38,89,0.16)] disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </SectionPanel>
  );
}
