import { useState } from 'react';
import SectionPanel from '../SectionPanel';
import { Field, TextInput, TextArea, ImageUploadField, ListEditor, Toggle } from '../fields';
import { saveCategory, deleteCategory } from '../../../lib/treatmentCatalog';
import { DEFAULT_IMAGES } from '../../../sections/treatment/treatmentData';

const EMPTY_CATEGORY = {
  id: null,
  title: '',
  description: '',
  description_2: '',
  image_url: null,
  default_image: null,
  visible: true,
  treatments: [],
};

/** Edits one treatment category and the treatments inside it. `category` is null while creating a
 * new one. Nothing is written until "Save changes"; the category and its treatments save together. */
export default function TreatmentCategoryEditor({ category, takenSlugs, nextSortOrder, onSaved, onDeleted }) {
  const initial = category ?? EMPTY_CATEGORY;
  const isNew = !initial.id;

  const [draft, setDraft] = useState(initial);
  const [treatments, setTreatments] = useState(initial.treatments);
  const [savedVisible, setSavedVisible] = useState(initial.visible);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState('');

  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = async () => {
    if (!draft.title.trim()) {
      setError('Please enter a category title.');
      return;
    }

    if (treatments.some((treatment) => !treatment.title?.trim())) {
      setError('Every treatment needs a title. Fill it in or remove the empty treatment.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const savedId = await saveCategory({
        category: draft,
        treatments,
        existingTreatmentIds: initial.treatments.map((treatment) => treatment.id),
        takenSlugs,
        nextSortOrder,
      });

      setSavedVisible(draft.visible);
      setLastSaved('just now');
      await onSaved(savedId);
    } catch (err) {
      console.error('Treatment category save error:', err);
      setError(err?.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const count = initial.treatments.length;
    const message =
      count > 0
        ? `Delete "${initial.title}" and the ${count} treatment${count === 1 ? '' : 's'} inside it? This cannot be undone.`
        : `Delete "${initial.title}"? This cannot be undone.`;

    if (!window.confirm(message)) return;

    setDeleting(true);
    setError('');

    try {
      await deleteCategory(initial.id);
      await onDeleted();
    } catch (err) {
      console.error('Treatment category delete error:', err);
      setError(err?.message || 'Something went wrong while deleting.');
      setDeleting(false);
    }
  };

  return (
    <SectionPanel
      title={isNew ? 'New category' : initial.title}
      description="Category details and the treatments listed inside it"
      visible={draft.visible}
      savedVisible={savedVisible}
      onVisibleChange={set('visible')}
      lastSaved={lastSaved}
    >
      <Field label="Category title">
        <TextInput value={draft.title} onChange={set('title')} maxLength={40} placeholder="e.g. Facials" />
      </Field>

      <Field label="Short description" hint="Shown in the category list and above the treatment cards.">
        <TextArea value={draft.description} onChange={set('description')} rows={2} maxLength={160} />
      </Field>

      <Field label="Second description (optional)" hint="Extra line shown above the treatment cards only.">
        <TextArea value={draft.description_2} onChange={set('description_2')} rows={2} maxLength={200} />
      </Field>

      <ImageUploadField
        label="Category image"
        value={draft.image_url}
        onChange={set('image_url')}
        folder="treatment-page"
        fallback={DEFAULT_IMAGES[draft.default_image]}
        aspect={1}
      />

      <Field
        label={`Treatments in this category (${treatments.length})`}
        hint="Use the arrows to change the order shown on the website."
      >
        <ListEditor
          items={treatments}
          onChange={setTreatments}
          addLabel="Add treatment"
          reorderable
          newItem={() => ({
            id: crypto.randomUUID(),
            title: '',
            description: '',
            image_url: null,
            default_image: null,
            visible: true,
          })}
          renderItem={(treatment, update, index) => (
            <>
              <p className="pr-28 font-heading text-[13px] font-semibold text-[#344054]">
                Treatment {index + 1}
                {treatment.visible === false && (
                  <span className="ml-2 font-body text-[11px] font-normal text-[#a1aea9]">hidden</span>
                )}
              </p>
              <TextInput
                value={treatment.title}
                onChange={(v) => update({ title: v })}
                maxLength={60}
                placeholder="Treatment name, e.g. Hydra Facial"
              />
              <TextArea
                value={treatment.description}
                onChange={(v) => update({ description: v })}
                rows={3}
                maxLength={220}
                placeholder="Description"
              />
              <ImageUploadField
                value={treatment.image_url}
                onChange={(v) => update({ image_url: v })}
                folder="treatment-page"
                fallback={DEFAULT_IMAGES[treatment.default_image]}
                aspect={16 / 9}
              />
              <Toggle
                checked={treatment.visible !== false}
                onChange={(v) => update({ visible: v })}
                label="Show this treatment"
                hint="Hide it without deleting it"
              />
            </>
          )}
        />
      </Field>

      {error && <p className="font-body text-sm text-[#df2759]">{error}</p>}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || deleting}
          className="self-start rounded-[10px] bg-[#df2759] px-5 py-2.5 font-heading text-sm font-semibold text-white shadow-[0_6px_14px_-4px_rgba(224,38,89,0.16)] disabled:opacity-60"
        >
          {saving ? 'Saving…' : isNew ? 'Create category' : 'Save changes'}
        </button>

        {!isNew && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || deleting}
            className="rounded-[10px] border border-[#f7c8d5] bg-white px-4 py-2.5 font-heading text-sm font-semibold text-[#df2759] hover:bg-[#fce8ee] disabled:opacity-60"
          >
            {deleting ? 'Deleting…' : 'Delete category'}
          </button>
        )}
      </div>
    </SectionPanel>
  );
}
