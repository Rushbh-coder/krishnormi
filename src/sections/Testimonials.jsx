import bgImage from "../assets/testimonials/bg.png";
import patientPhoto from "../assets/testimonials/patient-photo.png";
import stars from "../assets/testimonials/stars.svg";
import iconSkin from "../assets/testimonials/icon-skin.svg";
import iconPatients1 from "../assets/testimonials/icon-patients-1.svg";
import iconPatients2 from "../assets/testimonials/icon-patients-2.svg";
import iconYears from "../assets/testimonials/icon-years.svg";
import iconSatisfaction from "../assets/testimonials/icon-satisfaction.svg";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

const STAT_ICONS = [
  <img key="years" src={iconYears} alt="" aria-hidden="true" />,
  <span key="patients" className="relative block h-[60px] w-[60px]">
    <img className="absolute inset-[24.76%_0_8.74%_0] h-auto w-full" src={iconPatients1} alt="" aria-hidden="true" />
    <img className="absolute inset-[8.74%_29.47%_76.26%_55.54%] h-auto w-auto" src={iconPatients2} alt="" aria-hidden="true" />
  </span>,
  <img key="skin" src={iconSkin} alt="" aria-hidden="true" />,
  <img key="satisfaction" src={iconSatisfaction} alt="" aria-hidden="true" />,
];

export default function Testimonials() {
  const { row, loading } = useSection('testimonials');
  const content = row?.content ?? DEFAULT_CONTENT.testimonials;
  const visible = row?.visible ?? true;
  const stats = content.stats ?? DEFAULT_CONTENT.testimonials.stats;
  const testimonial = (content.testimonials ?? DEFAULT_CONTENT.testimonials.testimonials)[0];

  if (!loading && !visible) return null;
  if (!testimonial) return null;

  return (
    <section
      className="relative bg-[#15350e] bg-cover bg-center pb-[90px]"
      style={{ backgroundImage: `url(${content.background_image_url || bgImage})` }}
    >
      <div className="absolute inset-0 bg-[rgba(21,53,14,0.82)] backdrop-blur-[2px]" />

      <div className="container">
        <div className="relative -mt-px flex translate-y-12 flex-wrap items-center justify-between gap-6 rounded-[20px] bg-white p-[32px_40px] shadow-[0px_2px_80px_0px_rgba(0,0,0,0.1)] max-[900px]:mt-0 max-[900px]:translate-y-0 max-[900px]:justify-center">
          {stats.map((stat, i) => (
            <div className="relative flex flex-1 basis-[200px] items-center gap-4 pr-6 max-[900px]:pr-0" key={i}>
              <div className="flex h-[60px] w-[60px] flex-none items-center justify-center [&_img]:max-h-full [&_img]:max-w-full">
                {STAT_ICONS[i]}
              </div>
              <div>
                <p className="m-0 font-heading text-[32px] leading-[1.2] font-bold text-primary">{stat.value}</p>
                <p className="m-0 font-heading text-[15px] text-text-dark">{stat.label}</p>
              </div>
              {i < stats.length - 1 && (
                <span
                  className="absolute top-1/2 right-0 h-[60px] w-px -translate-y-1/2 bg-black/15 max-[900px]:hidden"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="container relative pt-24 text-center max-[900px]:pt-12">
        <h2 className="m-0 mb-4 font-heading text-[44px] font-bold text-white">{content.title}</h2>
        <p className="mx-auto mb-14 max-w-[880px] font-heading text-lg leading-[1.8] text-white/90">{content.intro_text}</p>

        <div className="relative mx-auto max-w-[1160px] rounded border border-[#eab308] p-[60px_48px_40px]">
          <span className="absolute top-[-6px] left-10 font-heading text-[96px] leading-none font-bold text-[#eab308]" aria-hidden="true">
            &rdquo;
          </span>
          <img
            className="mx-auto mb-5 h-20 w-20 rounded-full border-[3px] border-[#eab308] object-cover"
            src={testimonial.photo_url || patientPhoto}
            alt={testimonial.name}
          />
          <p className="m-0 mb-4 font-heading text-[23px] font-medium text-white">{testimonial.name}</p>
          <p className="mx-auto mb-5 max-w-[1026px] font-heading text-base leading-[2] text-white/90">{testimonial.quote}</p>
          <img className="mx-auto h-[21px]" src={stars} alt="5 out of 5 stars" />
        </div>
      </div>
    </section>
  );
}
