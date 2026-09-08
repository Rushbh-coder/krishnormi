import AdminLayout from './AdminLayout';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { DEFAULT_CONTENT } from '../../data/homepageDefaults';
import ContactEditor from '../../components/admin/sections/ContactEditor';

export default function ContactPageEditor() {
  const { sections, loading } = useHomepageContent();
  const initialContent = sections.contact?.content ?? DEFAULT_CONTENT.contact;
  const initialVisible = sections.contact?.visible ?? true;

  return (
    <AdminLayout activeNav="contact-us" pageTitle="Contact Us Page">
      <div className="flex flex-col gap-[22px]">
        <div>
          <h1 className="font-heading text-[28px] font-bold text-[#101828]">Contact Us Page</h1>
          <p className="mt-1 font-body text-sm text-[#667085]">Edit the content shown on the public /contact-us page.</p>
        </div>

        {loading ? (
          <p className="font-body text-sm text-[#667085]">Loading…</p>
        ) : (
          <div className="max-w-[776px]">
            <ContactEditor key={loading} initialContent={initialContent} initialVisible={initialVisible} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
