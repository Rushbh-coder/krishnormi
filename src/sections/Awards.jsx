import bgImage from '../assets/awards/awards-bg.png';
import doctorPhoto from '../assets/awards/doctor-award-photo.png';
import iconExperience from '../assets/awards/icon-experience.svg';
import iconAcademic from '../assets/awards/icon-academic.svg';
import iconTeaching from '../assets/awards/icon-teaching.svg';
import iconParticipation from '../assets/awards/icon-participation.svg';
import { useSection } from '../context/HomepageContentContext';
import { DEFAULT_CONTENT } from '../data/homepageDefaults';

// Fallback icon per card slot (position matches the DB `cards` array).
const TEMPLATE = [
  { icon: iconExperience, width: 46, height: 46 },
  { icon: iconAcademic, width: 47, height: 47 },
  { icon: iconTeaching, width: 45, height: 48 },
  { icon: iconParticipation, width: 48, height: 48 },
];

export default function Awards() {
  const { row, loading } = useSection('awards');
  const content = row?.content ?? DEFAULT_CONTENT.awards;
  const visible = row?.visible ?? true;
  const cards = content.cards ?? DEFAULT_CONTENT.awards.cards;

  if (!loading && !visible) return null;

  return (
    <section className="relative overflow-hidden bg-[#f3f1e9] pt-[100px] pb-[90px] max-[560px]:pt-16 max-[560px]:pb-14">
      <img className="absolute inset-0 z-0 h-full w-full object-cover object-center" src={bgImage} alt="" aria-hidden="true" />

      <div className="container relative z-[1] flex flex-wrap items-start gap-[58px] max-[960px]:flex-col max-[960px]:items-center">
        <div className="aspect-[509/866] w-full max-w-[490px] flex-1 basis-[420px] max-[960px]:max-w-[420px]">
          <img
            className="h-full w-full object-cover"
            src={content.photo_url || doctorPhoto}
            width={509}
            height={866}
            alt="Dr. Deepa K. Bhatt receiving a professional recognition award"
          />
        </div>

        <div className="max-w-[876px] flex-1 basis-[520px] max-[960px]:max-w-full">
          <h2 className="section-title text-[45px] leading-[1.3] text-navy max-[560px]:text-[32px]">{content.title}</h2>
          <hr className="section-divider w-[205px]" />

          <h3 className="mt-7 font-heading text-[23px] leading-[1.55] font-semibold text-text-dark">{content.subtitle}</h3>

          <p className="mt-4 font-body text-lg leading-[1.65] text-text">{content.body_text_1}</p>

          <p className="mt-4 font-body text-lg leading-[1.65] text-text">{content.body_text_2}</p>

          <h4 className="mt-[26px] mb-1 font-heading text-xl font-semibold text-text-dark">{content.highlights_title}</h4>

          <p className="mt-4 font-body text-lg leading-[1.65] text-text">{content.highlights_text}</p>

          <div className="mt-7 grid grid-cols-2 gap-6 max-[560px]:grid-cols-1">
            {cards.map((card, i) => {
              const template = TEMPLATE[i] ?? {};
              return (
                <div className="flex items-start gap-[18px] border border-[#d4d4d4] bg-white/75 p-[24px_22px] backdrop-blur-[5px]" key={i}>
                  <img
                    className="mt-0.5 block flex-none object-contain"
                    src={template.icon}
                    width={template.width}
                    height={template.height}
                    alt=""
                    aria-hidden="true"
                  />
                  <div>
                    <h5 className="mb-2 font-heading text-xl font-semibold text-navy">{card.title}</h5>
                    <p className="font-body text-base leading-[1.5] text-text">{card.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
