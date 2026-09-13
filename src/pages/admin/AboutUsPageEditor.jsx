import AdminLayout from "./AdminLayout";
import { useHomepageContent } from "../../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../../data/homepageDefaults";
import AboutUsContentEditor from "../../components/admin/sections/AboutUsContentEditor";

export default function AboutUsPageEditor() {
  const { sections, loading } = useHomepageContent();

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

  return (
    <AdminLayout activeNav="about-us" pageTitle="About Us Page">
      <div className="flex w-[1100px] flex-col gap-[22px]">
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
          <div className="max-w-[1100px]">
            <AboutUsContentEditor
              key={loading}
              initialContent={initialContent}
              initialVisible={initialVisible}
              onPreview={handlePreview}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
