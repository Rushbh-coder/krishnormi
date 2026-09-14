import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { useHomepageContent } from "../../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../../data/homepageDefaults";
import AboutUsContentEditor from "../../components/admin/sections/AboutUsContentEditor";

const ABOUT_PAGE_SECTIONS = [
  { key: "banner", label: "Banner" },
  { key: "modern-practice", label: "Modern Practice" },
  { key: "whatsapp", label: "WhatsApp Helpline" },
  { key: "doctors", label: "Meet Our Doctors" },
  { key: "what-guides-us", label: "What Guides Us" },
];

export default function AboutUsPageEditor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSection = searchParams.get("section");
  const { sections, loading } = useHomepageContent();

  const activeSection = ABOUT_PAGE_SECTIONS.some(
    (section) => section.key === requestedSection,
  )
    ? requestedSection
    : "banner";

  const initialContent = sections.about_page?.content ?? DEFAULT_CONTENT.about_page;
  const initialVisible = sections.about_page?.visible ?? true;

  const handlePreview = ({ content, visible }) => {
    sessionStorage.setItem(
      "about_page_preview",
      JSON.stringify({
        content,
        visible,
        createdAt: Date.now(),
      }),
    );

    window.location.href = "/about-us?preview=true";
  };

  const handleSectionClick = (key) => {
    setSearchParams({ section: key }, { replace: true });
  };

  useEffect(() => {
    if (!activeSection) {
      return;
    }

    const target = document.getElementById(activeSection);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeSection]);

  return (
    <AdminLayout activeNav="about-us" pageTitle="About Us Page">
      <div className="flex w-full flex-col gap-[22px]">
        <div>
          <h1 className="font-heading text-[28px] font-bold text-[#101828]">
            About Us Page
          </h1>

          <p className="mt-1 font-body text-sm text-[#667085]">
            Edit the content shown on the public /about-us page.
          </p>
        </div>

        {loading ? (
          <p className="font-body text-sm text-[#667085]">Loading…</p>
        ) : (
          <div className="flex min-h-0 gap-[22px]">
            <nav
              className="
                flex
                h-[500px]
                w-[260px]
                flex-none
                flex-col
                gap-2
                overflow-y-auto
                rounded-2xl
                border
                border-[#e4eae7]
                bg-white
                p-4
                pt-[18px]
                shadow-[0_8px_24px_-8px_rgba(15,33,28,0.05)]
              "
              aria-label="About Us page sections"
            >
              <p className="font-heading text-base font-semibold text-[#101828]">
                About Us sections
              </p>

              <p className="mb-1 font-body text-xs text-[#98a2b3]">
                Select a section to edit
              </p>

              {ABOUT_PAGE_SECTIONS.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  className={`flex h-[42px] flex-none items-center justify-between rounded-[9px] border border-transparent pr-2.5 pl-3 text-left font-body text-[13px] text-[#536660] ${
                    activeSection === section.key
                      ? "border-[#d6ebe1] bg-[#edf7f2] font-heading font-semibold text-[#14733e]"
                      : ""
                  }`}
                  onClick={() => handleSectionClick(section.key)}
                >
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>

            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-10">
              <div className="max-w-[1100px]">
                <AboutUsContentEditor
                  key={loading}
                  initialContent={initialContent}
                  initialVisible={initialVisible}
                  onPreview={handlePreview}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
