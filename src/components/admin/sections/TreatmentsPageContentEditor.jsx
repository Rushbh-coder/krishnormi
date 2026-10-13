import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';
import heroImage from '../../../assets/treatment-page/hero.jpg';
import bannerImage from '../../../assets/treatment-page/doctors.jpg';

/** Copy for the /treatments page. `panel` picks which group of fields is shown; both groups are
 * stored in the same `treatments_page` row, so saving one never drops the other. */
export default function TreatmentsPageContentEditor({ panel, initialContent }) {
  const [content, setContent] = useState(initialContent);
  const { save, saving, lastSaved, error } = useSaveSection('treatments_page');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  const handleSave = () => save(content, true);

  return (
    <SectionPanel
      title={panel === 'hero' ? 'Hero banner' : 'Sidebar banner & disclaimer'}
      description={
        panel === 'hero'
          ? 'Heading, intro text and button at the top of the page'
          : 'Promotional banner under the category list and the note under the treatment cards'
      }
      lastSaved={lastSaved}
    >
      {panel === 'hero' ? (
        <>
          <div className="flex gap-4 max-[900px]:flex-col">
            <div className="flex-1">
              <Field label="Heading (highlighted part)">
                <TextInput value={content.hero_heading_highlight} onChange={set('hero_heading_highlight')} maxLength={30} />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Heading (rest)">
                <TextInput value={content.hero_heading} onChange={set('hero_heading')} maxLength={30} />
              </Field>
            </div>
          </div>

          <Field label="Sub heading">
            <TextInput value={content.hero_subheading} onChange={set('hero_subheading')} maxLength={90} />
          </Field>

          <Field label="Body text 1">
            <TextArea value={content.hero_body_text_1} onChange={set('hero_body_text_1')} rows={3} maxLength={250} />
          </Field>

          <Field label="Body text 2">
            <TextArea value={content.hero_body_text_2} onChange={set('hero_body_text_2')} rows={3} maxLength={250} />
          </Field>

          <div className="flex gap-4 max-[900px]:flex-col">
            <div className="flex-1">
              <Field label="Button label">
                <TextInput value={content.hero_button_label} onChange={set('hero_button_label')} maxLength={30} />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Button link">
                <TextInput value={content.hero_button_link} onChange={set('hero_button_link')} placeholder="/contact-us" />
              </Field>
            </div>
          </div>

          <ImageUploadField
            label="Hero image"
            value={content.hero_image_url}
            onChange={set('hero_image_url')}
            folder="treatment-page"
            fallback={heroImage}
            aspect={1920 / 766}
          />
        </>
      ) : (
        <>
          <div className="flex gap-4 max-[900px]:flex-col">
            <div className="flex-1">
              <Field label="Banner heading (highlighted part)">
                <TextInput value={content.banner_heading_highlight} onChange={set('banner_heading_highlight')} maxLength={20} />
              </Field>
            </div>
            <div className="flex-1">
              <Field label="Banner heading (rest)">
                <TextInput value={content.banner_heading} onChange={set('banner_heading')} maxLength={40} />
              </Field>
            </div>
          </div>

          <ImageUploadField
            label="Banner image"
            value={content.banner_image_url}
            onChange={set('banner_image_url')}
            folder="treatment-page"
            fallback={bannerImage}
            aspect={466 / 330}
          />

          <Field label="Disclaimer" hint="Shown under the treatment cards. Leave empty to hide it.">
            <TextArea value={content.disclaimer} onChange={set('disclaimer')} rows={2} maxLength={200} />
          </Field>
        </>
      )}

      {error && <p className="font-body text-sm text-[#df2759]">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="self-start rounded-[10px] bg-[#df2759] px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-[0_6px_14px_-4px_rgba(224,38,89,0.16)] disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </SectionPanel>
  );
}
