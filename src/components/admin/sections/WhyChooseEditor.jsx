import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField, ListEditor } from '../fields';
import { useSaveSection } from '../../../hooks/useSaveSection';
import photo1 from '../../../assets/why-choose/photo-1.png';
import photo2 from '../../../assets/why-choose/photo-2.png';
import photo3 from '../../../assets/why-choose/photo-3.png';
import photo4 from '../../../assets/why-choose/photo-4.png';

const IMAGE_FALLBACKS = [null, photo1, null, photo2, photo3, null, photo4, null];

export default function WhyChooseEditor({ initialContent, initialVisible }) {
  const [content, setContent] = useState(initialContent);
  const [visible, setVisible] = useState(initialVisible);
  const { save, saving, lastSaved, error } = useSaveSection('why-choose');

  const set = (key) => (value) => setContent((c) => ({ ...c, [key]: value }));

  return (
    <SectionPanel title="Why choose us" description="The 8-tile grid" visible={visible} onVisibleChange={setVisible} lastSaved={lastSaved}>
      <Field label="Section title">
        <TextInput value={content.title} onChange={set('title')} />
      </Field>

      <Field label="Tiles (8 fixed slots — 4 photo, 4 text)">
        <ListEditor
          items={content.cards}
          onChange={set('cards')}
          fixedLength
          renderItem={(card, update, i) =>
            card.type === 'image' ? (
              <ImageUploadField value={card.image_url} onChange={(v) => update({ image_url: v })} folder="why-choose" fallback={IMAGE_FALLBACKS[i]} />
            ) : (
              <>
                <label className="flex items-center gap-2 font-body text-xs text-[#536660]">
                  <input type="checkbox" checked={!!card.dark} onChange={(e) => update({ dark: e.target.checked })} />
                  Dark tile
                </label>
                <TextInput value={card.title} onChange={(v) => update({ title: v })} placeholder="Title" />
                <TextArea value={card.text} onChange={(v) => update({ text: v })} rows={3} placeholder="Text" />
              </>
            )
          }
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
