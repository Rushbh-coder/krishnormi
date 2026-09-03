import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoIcon from '../../assets/header/logo-icon.png';
import logoWordmark from '../../assets/header/logo-wordmark.png';
import iconDashboard from '../../assets/admin/icon-dashboard.svg';
import iconHomePage from '../../assets/admin/icon-home-page.svg';
import iconAboutUs from '../../assets/admin/icon-about-us.svg';
import iconOurDoctor from '../../assets/admin/icon-our-doctor.svg';
import iconAreasOfCare from '../../assets/admin/icon-areas-of-care.svg';
import iconTreatments from '../../assets/admin/icon-treatments.svg';
import iconGallery from '../../assets/admin/icon-gallery.svg';
import iconContactUs from '../../assets/admin/icon-contact-us.svg';
import iconAppointments from '../../assets/admin/icon-appointments.svg';
import iconSettings from '../../assets/admin/icon-settings.svg';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: iconDashboard, to: '/admin/dashboard' },
  { key: 'home-page', label: 'Home Page', icon: iconHomePage, to: '/admin/home-page' },
  { key: 'about-us', label: 'About Us', icon: iconAboutUs },
  { key: 'our-doctor', label: 'Our Doctor', icon: iconOurDoctor },
  { key: 'areas-of-care', label: 'Areas of Care', icon: iconAreasOfCare },
  { key: 'treatments', label: 'Treatments', icon: iconTreatments },
  { key: 'gallery', label: 'Gallery', icon: iconGallery },
  { key: 'contact-us', label: 'Contact Us', icon: iconContactUs },
  { key: 'appointments', label: 'Appointments', icon: iconAppointments },
];

function initialsFromEmail(email) {
  if (!email) return 'A';
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/).filter(Boolean);
  const initials = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return initials.toUpperCase();
}

const NAV_ITEM_BASE =
  'flex h-11 items-center gap-[11px] rounded-[10px] border border-transparent px-3.5 text-left font-body text-sm text-[#4e625c] [&_img]:h-[18px] [&_img]:w-[18px] [&_img]:flex-none';
const NAV_ITEM_ACTIVE = 'cursor-default border-[#d5eae1] bg-[#eaf5f0] font-heading font-semibold text-[#102a2a]';

export default function AdminLayout({ activeNav, pageTitle, children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f9f8]">
      <aside className="flex h-full flex-none basis-[270px] flex-col items-stretch gap-3.5 overflow-y-auto border-r border-[#e4eae7] bg-[#fbfcfb] px-5 pt-7 pb-6 max-[1080px]:basis-[220px] max-[1080px]:px-3.5 max-[1080px]:pt-6 max-[1080px]:pb-5 max-[820px]:basis-auto max-[820px]:flex-row max-[820px]:flex-wrap max-[820px]:items-center max-[820px]:border-r-0 max-[820px]:border-b">
        <a href="/" className="mb-1 flex items-center gap-3">
          <img className="h-auto w-10" src={logoIcon} width={40} height={44} alt="" aria-hidden="true" />
          <img
            className="h-auto w-[170px] max-[1080px]:w-[130px]"
            src={logoWordmark}
            width={170}
            height={23}
            alt="Krishnormi"
          />
        </a>

        <p className="font-heading text-[11px] font-semibold tracking-[0.06em] text-[#7a8d87] max-[820px]:hidden">
          WEBSITE MANAGEMENT
        </p>

        <nav className="flex flex-col gap-1.5 max-[820px]:flex-row max-[820px]:flex-wrap" aria-label="Admin sections">
          {NAV_ITEMS.map((item) =>
            item.to ? (
              <Link
                key={item.key}
                to={item.to}
                className={`${NAV_ITEM_BASE} ${item.key === activeNav ? NAV_ITEM_ACTIVE : ''} max-[820px]:h-[38px]`}
              >
                <img src={item.icon} alt="" aria-hidden="true" />
                {item.label}
              </Link>
            ) : (
              <button
                key={item.key}
                type="button"
                className={`${NAV_ITEM_BASE} cursor-not-allowed ${item.key === activeNav ? NAV_ITEM_ACTIVE : ''} max-[820px]:h-[38px]`}
                disabled={item.key !== activeNav}
                title={item.key === activeNav ? undefined : 'Coming soon'}
              >
                <img src={item.icon} alt="" aria-hidden="true" />
                {item.label}
              </button>
            )
          )}
        </nav>

        <div className="my-1.5 h-px bg-[#e4eae7] max-[820px]:hidden" />

        <Link
          to="/admin/settings"
          className={`${NAV_ITEM_BASE} mt-auto max-[820px]:mt-0 max-[820px]:h-[38px] ${
            activeNav === 'settings' ? NAV_ITEM_ACTIVE : ''
          }`}
        >
          <img src={iconSettings} alt="" aria-hidden="true" />
          Settings
        </Link>
      </aside>

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-20 flex-none items-center justify-between border-b border-[#e7ece9] bg-white px-8 max-[820px]:px-5">
          <p className="font-heading text-xl font-semibold text-[#101828]">{pageTitle}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[19px] border border-[#f7c8d5] bg-[#fce8ee] font-heading text-xs font-bold text-[#e02859]">
                {initialsFromEmail(user?.email)}
              </div>
              <div className="flex flex-col gap-px">
                <p className="font-heading text-[13px] font-semibold text-[#344054]">{user?.email}</p>
                <p className="font-body text-[11px] text-[#98a2b3]">Administrator</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-[8px] border border-[#dce4e0] bg-white px-3 py-2 font-heading text-xs font-semibold text-[#344054] hover:bg-[#f7f9f8]"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pt-7 pb-8 max-[1080px]:px-5 max-[1080px]:pt-6 max-[1080px]:pb-7 max-[820px]:px-5 max-[820px]:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
