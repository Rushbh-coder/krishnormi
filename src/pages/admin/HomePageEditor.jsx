import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { DEFAULT_CONTENT } from '../../data/homepageDefaults';
import HeroEditor from '../../components/admin/sections/HeroEditor';
import AboutEditor from '../../components/admin/sections/AboutEditor';
import WhyChooseEditor from '../../components/admin/sections/WhyChooseEditor';
import TreatmentsEditor from '../../components/admin/sections/TreatmentsEditor';
import AwardsEditor from '../../components/admin/sections/AwardsEditor';
import TestimonialsEditor from '../../components/admin/sections/TestimonialsEditor';
import FaqEditor from '../../components/admin/sections/FaqEditor';

const SECTIONS = [
  { key: 'hero', label: 'Hero banner', Editor: HeroEditor },
  { key: 'about', label: 'Introduction', Editor: AboutEditor },
  { key: 'why-choose', label: 'Why choose us', Editor: WhyChooseEditor },
  { key: 'treatments', label: 'Treatments', Editor: TreatmentsEditor },
  { key: 'awards', label: 'Awards & recognition', Editor: AwardsEditor },
  { key: 'testimonials', label: 'Testimonials', Editor: TestimonialsEditor },
  { key: 'faq', label: 'FAQ', Editor: FaqEditor },
];

const SECTION_KEYS = SECTIONS.map((s) => s.key);

export default function HomePageEditor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSection = searchParams.get('section');
  const [activeSection, setActiveSection] = useState(
    SECTION_KEYS.includes(requestedSection) ? requestedSection : 'hero'
  );
  const { sections, loading } = useHomepageContent();

  const selectSection = (key) => {
    setActiveSection(key);
    setSearchParams({ section: key }, { replace: true });
  };

  const active = SECTIONS.find((s) => s.key === activeSection);
  const row = sections[activeSection];
  const initialContent = row?.content ?? DEFAULT_CONTENT[activeSection];
  const initialVisible = row?.visible ?? true;

  return (
    <AdminLayout activeNav="home-page" pageTitle="Content Management">
      <div className="flex flex-col gap-[22px]">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-4 bg-[#f7f9f8] max-[520px]:items-start">
          <div>
            <h1 className="font-heading text-[28px] font-bold text-[#101828]">Home Page</h1>
            <p className="mt-1 font-body text-sm text-[#667085]">Edit the content shown on the public homepage.</p>
          </div>
          <a
            className="inline-flex items-center justify-center rounded-[10px] border border-[#dce4e0] bg-white px-[18px] py-[11px] font-heading text-sm font-semibold text-[#344054]"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            Preview
          </a>
        </div>

        {loading ? (
          <p className="font-body text-sm text-[#667085]">Loading…</p>
        ) : (
          <div className="flex items-start gap-[22px] max-[900px]:flex-col">
            <nav
              className="flex flex-none basis-[260px] flex-col gap-2 rounded-2xl border border-[#e4eae7] bg-white p-4 pt-[18px] shadow-[0_8px_24px_-8px_rgba(15,33,28,0.05)] max-[900px]:w-full max-[900px]:basis-auto"
              aria-label="Homepage sections"
            >
              <p className="font-heading text-base font-semibold text-[#101828]">Homepage sections</p>
              <p className="mb-1 font-body text-xs text-[#98a2b3]">Select a section to edit</p>

              {SECTIONS.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  className={`flex h-[42px] items-center justify-between rounded-[9px] border border-transparent pr-2.5 pl-3 text-left font-body text-[13px] text-[#536660] ${
                    section.key === activeSection
                      ? 'border-[#d6ebe1] bg-[#edf7f2] font-heading font-semibold text-[#14733e]'
                      : ''
                  }`}
                  onClick={() => selectSection(section.key)}
                >
                  <span>{section.label}</span>
                  {sections[section.key]?.visible === false && (
                    <span className="font-body text-[10px] text-[#a1aea9]">hidden</span>
                  )}
                </button>
              ))}
            </nav>

            {active && <active.Editor key={activeSection} initialContent={initialContent} initialVisible={initialVisible} />}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
