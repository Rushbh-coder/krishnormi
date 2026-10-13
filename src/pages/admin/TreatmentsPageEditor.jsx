import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { useTreatmentCatalog } from '../../hooks/useTreatmentCatalog';
import { reorderCategories } from '../../lib/treatmentCatalog';
import { DEFAULT_CONTENT } from '../../data/homepageDefaults';
import TreatmentsPageContentEditor from '../../components/admin/sections/TreatmentsPageContentEditor';
import TreatmentCategoryEditor from '../../components/admin/sections/TreatmentCategoryEditor';

const CONTENT_PANELS = [
  { key: 'hero', label: 'Hero banner' },
  { key: 'extras', label: 'Sidebar banner & disclaimer' },
];

const NEW_CATEGORY = 'new';

const NAV_BUTTON =
  'flex min-h-[42px] flex-none items-center justify-between gap-2 rounded-[9px] border border-transparent pr-2.5 pl-3 text-left font-body text-[13px] text-[#536660]';
const NAV_BUTTON_ACTIVE = 'border-[#d6ebe1] bg-[#edf7f2] font-heading font-semibold text-[#14733e]';
const MOVE_BUTTON =
  'flex h-6 w-6 flex-none items-center justify-center rounded-full border border-[#dce4e0] bg-white p-0 text-[#536660] hover:bg-[#f7f9f8] disabled:cursor-not-allowed disabled:opacity-40';

export default function TreatmentsPageEditor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { sections, loading: contentLoading } = useHomepageContent();
  const { categories, isFallback, loading: catalogLoading, error: catalogError, refetch } = useTreatmentCatalog();
  const [reordering, setReordering] = useState(false);
  const [reorderError, setReorderError] = useState('');

  // The bundled fallback is read-only: its ids are not real database rows.
  const editableCategories = isFallback ? [] : categories;
  const setupNeeded = !catalogLoading && isFallback && !!catalogError;

  const requested = searchParams.get('section');
  const activeCategory = editableCategories.find((category) => category.id === requested);
  const activeKey =
    activeCategory || requested === NEW_CATEGORY || CONTENT_PANELS.some((panel) => panel.key === requested)
      ? requested
      : 'hero';

  const select = (key) => setSearchParams({ section: key }, { replace: true });

  const initialContent = {
    ...DEFAULT_CONTENT.treatments_page,
    ...sections.treatments_page?.content,
  };

  const moveCategory = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= editableCategories.length) return;

    const ids = editableCategories.map((category) => category.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];

    setReordering(true);
    setReorderError('');

    try {
      await reorderCategories(ids);
      await refetch();
    } catch (err) {
      console.error('Treatment category reorder error:', err);
      setReorderError(err?.message || 'Could not change the order.');
    } finally {
      setReordering(false);
    }
  };

  const handleCategorySaved = async (categoryId) => {
    await refetch();
    select(categoryId);
  };

  const handleCategoryDeleted = async () => {
    await refetch();
    select('hero');
  };

  const isContentPanel = CONTENT_PANELS.some((panel) => panel.key === activeKey);

  return (
    <AdminLayout activeNav="treatments" pageTitle="Treatments Page">
      <div className="flex h-[calc(100vh-90px)] min-h-0 flex-col overflow-hidden bg-[#f7f9f8]">
        <div className="relative z-30 flex min-h-[100px] flex-none items-center justify-between gap-4 border-b border-[#e4eae7] bg-[#f7f9f8] px-1 py-4 max-[520px]:items-start">
          <div>
            <h1 className="font-heading text-[28px] font-bold text-[#101828]">Treatments Page</h1>

            <p className="mt-1 font-body text-sm text-[#667085]">
              Edit the page content, the treatment categories and the treatments inside each category.
            </p>
          </div>

          <a
            className="inline-flex items-center justify-center rounded-[10px] border border-[#dce4e0] bg-white px-[18px] py-[11px] font-heading text-sm font-semibold text-[#344054]"
            href="/treatments"
            target="_blank"
            rel="noreferrer"
          >
            Preview
          </a>
        </div>

        <div className="flex min-h-0 flex-1 gap-[22px] overflow-hidden pt-5">
          <nav
            className="flex w-[280px] flex-none flex-col gap-2 self-start overflow-y-auto rounded-2xl border border-[#e4eae7] bg-white p-4 pt-[18px] shadow-[0_8px_24px_-8px_rgba(15,33,28,0.05)] max-h-full"
            aria-label="Treatments page sections"
          >
            <p className="font-heading text-base font-semibold text-[#101828]">Page content</p>

            {CONTENT_PANELS.map((panel) => (
              <button
                key={panel.key}
                type="button"
                className={`${NAV_BUTTON} ${panel.key === activeKey ? NAV_BUTTON_ACTIVE : ''}`}
                onClick={() => select(panel.key)}
              >
                <span>{panel.label}</span>
              </button>
            ))}

            <div className="my-1.5 h-px flex-none bg-[#e4eae7]" />

            <p className="font-heading text-base font-semibold text-[#101828]">Treatment categories</p>

            <p className="mb-1 font-body text-xs text-[#98a2b3]">Select a category to edit its treatments</p>

            {catalogLoading && <p className="font-body text-xs text-[#98a2b3]">Loading…</p>}

            {editableCategories.map((category, index) => (
              <div key={category.id} className="flex flex-none items-center gap-1">
                <button
                  type="button"
                  className={`${NAV_BUTTON} min-w-0 flex-1 ${category.id === activeKey ? NAV_BUTTON_ACTIVE : ''}`}
                  onClick={() => select(category.id)}
                >
                  <span className="min-w-0 truncate">{category.title}</span>

                  <span className="flex-none font-body text-[10px] font-normal text-[#a1aea9]">
                    {category.visible === false ? 'hidden' : category.treatments.length}
                  </span>
                </button>

                <button
                  type="button"
                  className={MOVE_BUTTON}
                  onClick={() => moveCategory(index, -1)}
                  disabled={reordering || index === 0}
                  aria-label={`Move ${category.title} up`}
                  title="Move up"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={MOVE_BUTTON}
                  onClick={() => moveCategory(index, 1)}
                  disabled={reordering || index === editableCategories.length - 1}
                  aria-label={`Move ${category.title} down`}
                  title="Move down"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}

            {reorderError && <p className="font-body text-[11px] text-[#df2759]">{reorderError}</p>}

            {/* Database not set up yet: list what the website currently shows, read-only. */}
            {setupNeeded &&
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`${NAV_BUTTON} cursor-not-allowed opacity-60`}
                  title="Run the Supabase migration to edit this category"
                >
                  <span className="min-w-0 truncate">{category.title}</span>

                  <span className="flex-none font-body text-[10px] text-[#a1aea9]">{category.treatments.length}</span>
                </div>
              ))}

            {!isFallback && (
              <button
                type="button"
                onClick={() => select(NEW_CATEGORY)}
                className={`flex-none rounded-[10px] border border-dashed border-[#cfddd7] bg-[#fafcfb] px-4 py-2.5 text-left font-heading text-sm font-semibold text-[#14733e] ${
                  activeKey === NEW_CATEGORY ? 'border-solid border-[#d6ebe1] bg-[#edf7f2]' : ''
                }`}
              >
                + Add category
              </button>
            )}
          </nav>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-10">
            {setupNeeded && (
              <div className="mb-[18px] rounded-2xl border border-[#f7c8d5] bg-[#fce8ee] px-6 py-5">
                <p className="font-heading text-base font-semibold text-[#b01e47]">
                  Treatment categories are not set up in Supabase yet
                </p>

                <p className="mt-1.5 font-body text-[13px] leading-[1.6] text-[#7a1232]">
                  The categories on the left are the built-in ones the website is showing now. They become editable
                  after the database tables are created:
                </p>

                <ol className="mt-2 list-decimal pl-5 font-body text-[13px] leading-[1.7] text-[#7a1232]">
                  <li>Open your Supabase project and go to SQL Editor.</li>
                  <li>
                    Paste the full contents of{' '}
                    <code className="font-semibold">supabase/migrations/20261013000000_treatments_page.sql</code> and
                    press Run.
                  </li>
                  <li>Come back here and reload this page.</li>
                </ol>

                <p className="mt-2 font-body text-[11px] text-[#b01e47]">Supabase said: {catalogError.message}</p>
              </div>
            )}

            {isContentPanel &&
              (contentLoading ? (
                <p className="font-body text-sm text-[#667085]">Loading…</p>
              ) : (
                <TreatmentsPageContentEditor key={activeKey} panel={activeKey} initialContent={initialContent} />
              ))}

            {!isContentPanel && !setupNeeded && (
              <TreatmentCategoryEditor
                key={activeKey}
                category={activeCategory ?? null}
                takenSlugs={editableCategories.map((category) => category.slug)}
                nextSortOrder={Math.max(0, ...editableCategories.map((category) => category.sort_order)) + 1}
                onSaved={handleCategorySaved}
                onDeleted={handleCategoryDeleted}
              />
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
