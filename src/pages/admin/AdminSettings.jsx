import AdminLayout from './AdminLayout';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { DEFAULT_CONTENT } from '../../data/homepageDefaults';
import FooterEditor from '../../components/admin/sections/FooterEditor';

export default function AdminSettings() {
  const { sections, loading } = useHomepageContent();
  const initialContent = sections.footer?.content ?? DEFAULT_CONTENT.footer;

  return (
    <AdminLayout activeNav="settings" pageTitle="Settings">
      <div className="flex flex-col gap-[22px]">
        <div>
          <h1 className="font-heading text-[28px] font-bold text-[#101828]">Sitewide Settings</h1>
          <p className="mt-1 font-body text-sm text-[#667085]">Contact details and social links shown in the footer on every page.</p>
        </div>

        {loading ? (
          <p className="font-body text-sm text-[#667085]">Loading…</p>
        ) : (
          <div className="max-w-[776px]">
            <FooterEditor key={loading} initialContent={initialContent} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
