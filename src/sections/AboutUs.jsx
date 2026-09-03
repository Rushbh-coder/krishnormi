import photoTop from '../assets/about/photo-2.png';
import photoBottom from '../assets/about/photo-4.png';
import ringDecor from '../assets/about/ellipse-decor.svg';
import dottedFace from '../assets/about/dotted-face-decor.svg';
import playRing from '../assets/about/ellipse-play-ring.svg';
import playTriangle from '../assets/about/play-triangle.svg';
import eyebrowIcon from '../assets/about/eyebrow-icon.svg';
import signatureBar from '../assets/about/signature-bar.svg';

import iconClinical from '../assets/about/icon-clinical-dermatology.svg';
import iconHairScalp from '../assets/about/icon-hair-scalp.svg';
import iconLaser from '../assets/about/icon-laser-dermatology.svg';
import iconAesthetic from '../assets/about/icon-aesthetic-dermatology.svg';
import { useSection } from '../context/HomepageContentContext';
import { DEFAULT_CONTENT } from '../data/homepageDefaults';

const FOCUS_TEMPLATE = [
  { icon: iconClinical, width: 52, height: 58 },
  { icon: iconHairScalp, width: 54, height: 58, opacity: 0.58 },
  { icon: iconLaser, width: 60, height: 60 },
  { icon: iconAesthetic, width: 38, height: 58 },
];

function HighlightBrand({ text }) {
  const index = text.indexOf('KRISHNORMI');
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-primary">KRISHNORMI</span>
      {text.slice(index + 'KRISHNORMI'.length)}
    </>
  );
}

export default function AboutUs() {
  const { row, loading } = useSection('about');
  const content = row?.content ?? DEFAULT_CONTENT.about;
  const visible = row?.visible ?? true;
  const focusItems = content.focus_items ?? DEFAULT_CONTENT.about.focus_items;

  if (!loading && !visible) return null;

  return (
    <section className="overflow-hidden bg-white pt-[100px] pb-20 max-[560px]:pt-16 max-[560px]:pb-14">
      <div className="container flex flex-wrap items-start gap-[60px]">
        <div className="relative aspect-[738/864] w-full max-w-[738px] flex-1 basis-[460px] max-[960px]:mx-auto max-[960px]:max-w-[520px]">
          <span
            className="absolute top-[6%] left-0 z-[1] aspect-square w-[29.3%] bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${ringDecor})` }}
            aria-hidden="true"
          />

          <img
            className="absolute top-0 left-[9.6%] z-[2] h-[67.5%] w-[63.3%] rounded-[20px] object-cover shadow-[0_20px_40px_rgba(0,34,97,0.12)]"
            src={content.photo_top_url || photoTop}
            width={467}
            height={583}
            alt="Dermatology treatment being performed at Krishnormi clinic"
          />

          <img
            className="absolute top-[54%] left-[35%] z-[3] h-[46%] w-[65%] rounded-[20px] object-cover shadow-[0_20px_40px_rgba(0,34,97,0.12)]"
            src={content.photo_bottom_url || photoBottom}
            width={480}
            height={398}
            alt="Patient consultation at Krishnormi clinic"
          />

          <div className="absolute top-[51%] left-[19%] z-[4] flex aspect-square w-[31%] flex-col items-center justify-center rounded-full border-[11px] border-white bg-navy text-center text-white shadow-[0_12px_24px_rgba(0,34,97,0.25)]">
            <span className="font-heading text-[clamp(24px,4.2vw,40px)] leading-[1.1] font-bold">{content.badge_number}</span>
            <span className="font-heading text-[clamp(13px,2vw,20px)] font-medium">{content.badge_label}</span>
          </div>

          <img className="absolute bottom-0 left-0 z-[1] w-[26%] opacity-90" src={dottedFace} alt="" aria-hidden="true" />

          <div className="absolute top-[30%] right-[6%] z-[4] aspect-square w-[13%]">
            <img className="absolute inset-0 h-full w-full" src={playRing} alt="" aria-hidden="true" />
            <img className="absolute top-[34%] left-[34%] h-[32%] w-[32%]" src={playTriangle} alt="" aria-hidden="true" />
          </div>

          <span className="absolute top-[10%] right-[1.5%] z-[4] origin-top-right whitespace-nowrap font-heading text-[20px] font-semibold text-navy [transform:rotate(-90deg)_translate(-100%,0)]">
            How We Work
          </span>
        </div>

        <div className="max-w-[711px] flex-1 basis-[420px] max-[960px]:max-w-full">
          <p className="section-eyebrow">
            <img src={eyebrowIcon} width={24} height={24} alt="" aria-hidden="true" />
            {content.eyebrow_text}
          </p>

          <h2 className="section-title">
            <HighlightBrand text={content.heading} />
          </h2>

          <hr className="section-divider" />

          <p className="mt-6 font-heading text-xl leading-[1.5] font-semibold text-text-dark">{content.lead_text}</p>

          <p className="mt-[18px] font-body text-lg leading-[1.7] text-text">{content.body_text_1}</p>

          <p className="mt-[18px] font-body text-lg leading-[1.7] text-text">{content.body_text_2}</p>

          <p className="mt-[18px] font-body text-lg leading-[1.7] text-text">{content.body_text_3}</p>

          <a href={content.cta_link || '#contact'} className="btn-primary mt-8">
            {content.cta_label}
          </a>

          <div className="mt-10 flex gap-4">
            <img className="h-auto w-[13px] flex-none" src={signatureBar} alt="" aria-hidden="true" />
            <div>
              <p className="mb-2 font-heading text-lg font-semibold text-[#293253]">{content.signature_role}</p>
              <p className="mb-2 font-heading text-[15px] leading-[1.5] text-[#636363] italic">{content.signature_note}</p>
              <p className="font-heading text-base font-bold text-[#636363]">{content.signature_name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="mt-[90px] grid grid-cols-4 overflow-hidden rounded-xl border border-[#e9e9e9] max-[960px]:grid-cols-2 max-[560px]:grid-cols-1">
          {FOCUS_TEMPLATE.map((template, i) => {
            const item = focusItems[i] ?? {};
            return (
              <div
                className="border-l border-[#e9e9e9] px-7 py-8 first:border-l-0 max-[960px]:[&:nth-child(-n+2)]:border-b max-[960px]:[&:nth-child(-n+2)]:border-[#e9e9e9] max-[960px]:[&:nth-child(3)]:border-l-0 max-[560px]:border-t max-[560px]:border-l-0 max-[560px]:border-[#e9e9e9] max-[560px]:first:border-t-0"
                key={i}
              >
                <img
                  className="mb-[26px] block object-contain"
                  src={template.icon}
                  width={template.width}
                  height={template.height}
                  style={template.opacity ? { opacity: template.opacity } : undefined}
                  alt=""
                  aria-hidden="true"
                />
                <h3 className="mb-3.5 font-heading text-xl font-semibold text-navy">{item.title}</h3>
                <p className="font-body text-[15px] leading-[1.6] text-text">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
