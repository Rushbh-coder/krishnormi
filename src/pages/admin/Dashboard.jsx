import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useHomepageContent } from '../../context/HomepageContentContext';
import { formatRelativeTime } from '../../lib/formatRelativeTime';

const PAGE_SECTIONS = [
  { key: 'hero', label: 'Hero banner' },
  { key: 'about', label: 'Introduction' },
  { key: 'why-choose', label: 'Why choose us' },
  { key: 'treatments', label: 'Treatments' },
  { key: 'awards', label: 'Awards & recognition' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'faq', label: 'FAQ' },
];

function StatCard({ label, value, hint }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-[#e4eae7] bg-white px-5 py-[18px] shadow-[0_8px_24px_-8px_rgba(15,33,28,0.05)]">
      <p className="font-body text-xs font-medium tracking-[0.02em] text-[#7a8d87] uppercase">{label}</p>
      <p className="font-heading text-[32px] leading-[1.1] font-bold text-[#101828]">{value}</p>
      {hint && <p className="font-body text-xs text-[#98a2b3]">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { sections, loading } = useHomepageContent();

  const rows = Object.values(sections);
  const visibleCount = rows.filter((r) => r.visible).length;
  const hiddenCount = rows.length - visibleCount;
  const testimonialsCount = sections.testimonials?.content?.testimonials?.length ?? 0;
  const faqCount = sections.faq?.content?.items?.length ?? 0;
  const mostRecent = rows.reduce((latest, r) => (!latest || r.updated_at > latest ? r.updated_at : latest), null);

  return (
    <AdminLayout activeNav="dashboard" pageTitle="Dashboard">
      <div className="flex flex-col gap-[22px]">
        <div>
          <h1 className="font-heading text-[28px] font-bold text-[#101828]">Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}</h1>
          <p className="mt-1 font-body text-sm text-[#667085]">Here's what's happening with the Krishnormi website.</p>
        </div>

        {loading ? (
          <p className="font-body text-sm text-[#667085]">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 max-[1080px]:grid-cols-2 max-[520px]:grid-cols-1">
              <StatCard label="Homepage sections" value={rows.length} hint={`Last change ${formatRelativeTime(mostRecent)}`} />
              <StatCard label="Visible" value={visibleCount} hint={`${hiddenCount} hidden`} />
              <StatCard label="Testimonials" value={testimonialsCount} hint="Shown on public site" />
              <StatCard label="FAQ entries" value={faqCount} />
            </div>

            <div className="flex items-start gap-[22px] max-[900px]:flex-col">
              <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-2xl border border-[#e4eae7] bg-white p-5 shadow-[0_8px_24px_-8px_rgba(15,33,28,0.05)] max-[900px]:w-full">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-heading text-base font-semibold text-[#101828]">Homepage sections</p>
                  <Link to="/admin/home-page" className="font-heading text-xs font-semibold text-[#14733e] hover:underline">
                    Open editor
                  </Link>
                </div>

                {PAGE_SECTIONS.map((section) => {
                  const row = sections[section.key];
                  return (
                    <Link
                      key={section.key}
                      to={`/admin/home-page?section=${section.key}`}
                      className="flex items-center justify-between gap-3 rounded-[10px] px-3 py-3 hover:bg-[#f7f9f8]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-1.5 w-1.5 flex-none rounded-full ${row?.visible ? 'bg-[#0b6b45]' : 'bg-[#a1aea9]'}`}
                          aria-hidden="true"
                        />
                        <span className="font-body text-sm text-[#344054]">{section.label}</span>
                      </div>
                      <span className="font-body text-xs text-[#98a2b3]">{formatRelativeTime(row?.updated_at)}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="flex w-full flex-none flex-col gap-3 max-[900px]:w-full min-[901px]:basis-[300px]">
                <div className="flex flex-col gap-3 rounded-2xl border border-[#e4eae7] bg-white p-5 shadow-[0_8px_24px_-8px_rgba(15,33,28,0.05)]">
                  <p className="font-heading text-base font-semibold text-[#101828]">Quick links</p>
                  <Link
                    to="/admin/home-page"
                    className="rounded-[10px] border border-[#dce4e0] px-4 py-3 font-heading text-sm font-semibold text-[#344054] hover:bg-[#f7f9f8]"
                  >
                    Edit Home Page content
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="rounded-[10px] border border-[#dce4e0] px-4 py-3 font-heading text-sm font-semibold text-[#344054] hover:bg-[#f7f9f8]"
                  >
                    Footer & contact settings
                  </Link>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[10px] bg-[#df2759] px-4 py-3 text-center font-heading text-sm font-semibold text-white shadow-[0_6px_14px_-4px_rgba(224,38,89,0.16)] hover:bg-[#c81f4a]"
                  >
                    View live site
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
