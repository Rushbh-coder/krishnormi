import heroBackground from '../assets/hero/hero-background.png';
import drDeepa from '../assets/hero/dr-deepa.png';
import drKhevana from '../assets/hero/dr-khevana.png';
import { useSection } from '../context/HomepageContentContext';
import { DEFAULT_CONTENT } from '../data/homepageDefaults';

export default function Hero() {
  const { row, loading } = useSection('hero');
  const content = row?.content ?? DEFAULT_CONTENT.hero;
  const visible = row?.visible ?? true;

  if (!loading && !visible) return null;

  return (
    <section className="relative overflow-hidden bg-white pt-14 pb-[72px] min-h-[clamp(520px,44vw,760px)] max-[960px]:flex max-[960px]:min-h-0 max-[960px]:flex-col max-[960px]:pt-10 max-[960px]:pb-12">
      <div className="absolute inset-0 z-[1] overflow-hidden max-[960px]:relative max-[960px]:order-2 max-[960px]:inset-auto max-[960px]:mt-10 max-[960px]:aspect-[1920/842] max-[960px]:w-full max-[960px]:rounded-[20px] max-[560px]:aspect-[4/5]" aria-hidden="true">
        <img
          className="absolute inset-0 h-full w-full object-cover object-[68%_center] [mask-image:linear-gradient(to_right,transparent_0%,transparent_18%,#000_46%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,transparent_18%,#000_46%)]"
          src={content.image_url || heroBackground}
          alt=""
        />

        <img
          className="absolute bottom-0 left-[43.3%] z-[2] h-[95%] w-[29.5%] object-contain object-bottom max-[560px]:h-[92%]"
          src={drDeepa}
          width={1165}
          height={1350}
          alt=""
        />
        <img
          className="absolute bottom-0 left-[58.5%] z-[3] h-[95%] w-[36.25%] object-contain object-bottom max-[560px]:h-[92%]"
          src={drKhevana}
          width={1086}
          height={1448}
          alt=""
        />

        <span className="absolute top-[92.4%] left-[51.9%] z-[4] inline-flex items-center justify-center whitespace-nowrap rounded-[6px] bg-white/75 px-5 py-3 font-heading text-[clamp(13px,1.1vw,20px)] font-bold text-text-dark shadow-[0_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[6px] max-[560px]:px-3.5 max-[560px]:py-2">
          Dr. Deepa Bhatt
        </span>
        <span className="absolute top-[92.4%] left-[69.7%] z-[4] inline-flex items-center justify-center whitespace-nowrap rounded-[6px] bg-white/75 px-5 py-3 font-heading text-[clamp(13px,1.1vw,20px)] font-bold text-text-dark shadow-[0_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[6px] max-[560px]:px-3.5 max-[560px]:py-2">
          Dr. Khevana Bhatt
        </span>
      </div>

      <div className="container relative z-[2] h-full max-[960px]:order-1">
        <div className="max-w-[620px] pt-6 max-[960px]:max-w-full">
          <h1 className="font-heading text-[clamp(32px,3.6vw,55px)] leading-[1.4] font-bold text-text-dark">
            {content.heading}
          </h1>

          <hr className="mt-5 h-[3px] w-[205px] border-none bg-accent max-[560px]:w-[140px]" />

          <p className="mt-[22px] font-heading text-[clamp(18px,1.6vw,25px)] leading-[1.6] font-semibold text-text-dark">
            {content.supporting_text}
          </p>

          <p className="mt-5 font-heading text-[19px] leading-[1.58] text-text max-[560px]:text-base">
            {content.body_text_1}
          </p>

          <p className="mt-5 font-heading text-[19px] leading-[1.58] text-text max-[560px]:text-base">
            {content.body_text_2}
          </p>

          <a href={content.button_link || '#contact'} className="btn-primary mt-8">
            {content.button_label}
          </a>
        </div>
      </div>
    </section>
  );
}
