import iconWhatsapp from '../assets/footer/icon-whatsapp.svg';
import { useSection } from '../context/HomepageContentContext';
import { DEFAULT_CONTENT } from '../data/homepageDefaults';

export default function WhatsAppButton() {
  const { row } = useSection('footer');
  const content = row?.content ?? DEFAULT_CONTENT.footer;
  const number = (content.whatsapp_number || DEFAULT_CONTENT.footer.whatsapp_number || '').replace(/[^\d]/g, '');

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-[300] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform duration-200 hover:scale-110 max-[560px]:right-4 max-[560px]:bottom-4 max-[560px]:h-12 max-[560px]:w-12"
    >
      <img src={iconWhatsapp} alt="" aria-hidden="true" className="h-7 w-7 brightness-0 invert max-[560px]:h-6 max-[560px]:w-6" />
    </a>
  );
}
