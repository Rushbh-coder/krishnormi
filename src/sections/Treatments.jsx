import bgImage from "../assets/treatments/bg-1.png";
import heroTreatment from "../assets/treatments/hero-treatment.png";
import iconDermatology from "../assets/treatments/icon-dermatology.svg";
import iconFacials from "../assets/treatments/icon-facials.svg";
import iconAcne from "../assets/treatments/icon-acne.svg";
import cornerWhite from "../assets/treatments/icon-bg-1.svg";
import cornerAccent from "../assets/treatments/icon-bg-3.svg";
import arrow from "../assets/treatments/arrow.svg";
import arrowAccent from "../assets/treatments/arrow-accent.svg";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import ExpandableText from "../components/ExpandableText";

// Fallback icon per card slot (position matches the DB `cards` array).
const TEMPLATE = [
  { icon: iconDermatology },
  { icon: iconFacials },
  { icon: iconAcne },
  { icon: iconAcne },
];

export default function Treatments() {
  const { row, loading } = useSection('treatments');
  const content = row?.content ?? DEFAULT_CONTENT.treatments;
  const visible = row?.visible ?? true;
  const cards = content.cards ?? DEFAULT_CONTENT.treatments.cards;

  if (!loading && !visible) return null;

  return (
    <section
      className="relative overflow-hidden bg-[#15350e] bg-cover bg-center py-[100px] max-[560px]:py-16"
      style={{ backgroundImage: `url(${content.background_image_url || bgImage})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(36,71,17,0.75),#15350e_75%)]" />
      <div className="container relative grid grid-cols-[minmax(280px,460px)_1fr] items-start gap-10 max-[1000px]:grid-cols-1">
        <div className="relative">
          <h2 className="m-0 font-heading text-[44px] leading-[1.25] font-bold text-white">{content.title}</h2>
          <hr className="section-divider mb-6" />
          <div className="mb-8">
            <ExpandableText
              text={content.body_text}
              lines={3}
              className="font-heading text-[17px] leading-[1.7] text-white/90"
              toggleClassName="mt-1.5 font-heading text-sm font-semibold text-accent hover:underline"
            />
          </div>
          <button type="button" className="btn-primary">
            {content.button_label}
          </button>
          <img
            className="mix-blend-screen mt-5 h-auto w-full max-w-[760px]"
            src={content.hero_image_url || heroTreatment}
            width={1536}
            height={1200}
            alt="Dermatology treatment illustration"
          />
        </div>
        <div className="flex max-w-[700px] gap-5 max-[600px]:max-w-full max-[600px]:flex-col">
          {[0, 1].map((col) => (
            <div key={col} className={`flex flex-1 flex-col gap-5 ${col === 1 ? 'mt-6 max-[600px]:mt-0' : ''}`}>
              {[col, col + 2].map((i) => {
                const card = cards[i];
                if (!card) return null;
                const template = TEMPLATE[i] ?? {};
                return (
                  <div
                    key={i}
                    className={`relative min-h-[14px] overflow-hidden rounded p-[28px_24px_60px] max-[400px]:p-[22px_18px_50px] ${
                      card.featured ? "bg-[#132106]" : "bg-white/10"
                    }`}
                  >
                    <img
                      className="pointer-events-none absolute top-0 left-0 h-[110px] w-[110px] max-[400px]:h-[80px] max-[400px]:w-[80px]"
                      src={card.featured ? cornerAccent : cornerWhite}
                      alt=""
                      aria-hidden="true"
                    />
                    <div className="relative mb-6 flex h-16 w-14 items-center justify-center">
                      <img className="relative h-auto w-[34px]" src={template.icon} alt="" aria-hidden="true" />
                    </div>
                    <h5 className="m-0 mb-3 line-clamp-2 font-heading text-[18px] font-semibold text-white">{card.title}</h5>
                    <p className="m-0 line-clamp-4 font-heading text-base leading-[1.7] text-white/85">{card.text}</p>
                    <img
                      className="absolute right-5 bottom-5 h-9 w-9 rounded"
                      src={card.featured ? arrowAccent : arrow}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
