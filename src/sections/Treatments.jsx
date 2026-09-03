import bgImage from "../assets/treatments/bg-1.png";
import heroTreatment from "../assets/treatments/hero-treatment.png";
import iconDermatology from "../assets/treatments/icon-dermatology.svg";
import iconFacials from "../assets/treatments/icon-facials.svg";
import iconAcne from "../assets/treatments/icon-acne.svg";
import iconBg1 from "../assets/treatments/icon-bg-1.svg";
import iconBg2 from "../assets/treatments/icon-bg-2.svg";
import iconBg3 from "../assets/treatments/icon-bg-3.svg";
import arrow from "../assets/treatments/arrow.svg";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

// Fallback icon per card slot (position matches the DB `cards` array).
const TEMPLATE = [
  { iconBg: iconBg3, icon: iconDermatology },
  { iconBg: iconBg1, icon: iconFacials },
  { iconBg: iconBg1, icon: iconAcne },
  { iconBg: iconBg2, icon: iconAcne },
];

export default function Treatments() {
  const { row, loading } = useSection('treatments');
  const content = row?.content ?? DEFAULT_CONTENT.treatments;
  const visible = row?.visible ?? true;
  const cards = content.cards ?? DEFAULT_CONTENT.treatments.cards;

  if (!loading && !visible) return null;

  return (
    <section
      className="relative overflow-hidden bg-[#15350e] bg-cover bg-center py-[100px]"
      style={{ backgroundImage: `url(${content.background_image_url || bgImage})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(36,71,17,0.75),#15350e_75%)]" />
      <div className="container relative grid grid-cols-[minmax(280px,460px)_1fr] items-start gap-10 max-[1000px]:grid-cols-1">
        <div className="relative">
          <h2 className="m-0 font-heading text-[44px] leading-[1.25] font-bold text-white">{content.title}</h2>
          <hr className="section-divider mb-6" />
          <p className="mb-8 font-heading text-[17px] leading-[1.7] text-white/90">{content.body_text}</p>
          <button type="button" className="btn-primary">
            {content.button_label}
          </button>
          <img
            className="mt-12 h-auto w-full max-w-[420px] max-[1000px]:hidden"
            src={content.hero_image_url || heroTreatment}
            alt="Dermatology treatment illustration"
          />
        </div>
        <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
          {cards.map((card, i) => {
            const template = TEMPLATE[i] ?? {};
            return (
              <div
                key={i}
                className={`relative min-h-[260px] rounded p-[28px_24px_60px] ${
                  card.featured ? "border-l-[3px] border-accent bg-[#132106]" : "bg-white/10"
                }`}
              >
                <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
                  <img className="absolute inset-0 h-full w-full" src={template.iconBg} alt="" aria-hidden="true" />
                  <img className="relative h-auto w-[34px]" src={template.icon} alt="" aria-hidden="true" />
                </div>
                <h3 className="m-0 mb-3 font-heading text-[22px] font-semibold text-white">{card.title}</h3>
                <p className="m-0 font-heading text-base leading-[1.7] text-white/85">{card.text}</p>
                <img className="absolute right-5 bottom-5 h-9 w-9 rounded" src={arrow} alt="" aria-hidden="true" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
