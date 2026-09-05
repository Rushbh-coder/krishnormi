import bgImage from "../assets/testimonials/bg.png";
import patientPhoto from "../assets/testimonials/patient-photo.png";
import stars from "../assets/testimonials/stars.svg";
import iconyear from "../assets/testimonials/icon-years.svg";
import iconSkin from "../assets/testimonials/icon-skin.svg";
import iconPatients1 from "../assets/testimonials/icon-patients-1.svg";
import iconPatients2 from "../assets/testimonials/icon-patients-2.svg";
import iconSatisfaction from "../assets/testimonials/icon-satisfaction.svg";
import iconQuote from "../assets/testimonials/icon-quote.png";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import ExpandableText from "../components/ExpandableText";

const STAT_ICONS = [
  // Years
  <img
    key="years"
    src={iconyear}
    alt=""
    aria-hidden="true"
    className="h-[52px] w-[52px] object-contain"
  />,

  // Patients
  <span key="patients" className="relative block h-[56px] w-[56px] flex-none">
    <img
      className="absolute inset-[24.76%_0_8.74%_0] h-auto w-full object-contain"
      src={iconPatients1}
      alt=""
      aria-hidden="true"
    />

    <img
      className="absolute inset-[8.74%_29.47%_76.26%_55.54%] h-auto w-auto object-contain"
      src={iconPatients2}
      alt=""
      aria-hidden="true"
    />
  </span>,

  // Skin Treatments
  <img
    key="skin"
    src={iconSkin}
    alt=""
    aria-hidden="true"
    className="h-[52px] w-[52px] object-contain"
  />,

  // Satisfaction
  <img
    key="satisfaction"
    src={iconSatisfaction}
    alt=""
    aria-hidden="true"
    className="h-[52px] w-[52px] object-contain"
  />,
];

export default function Testimonials() {
  const { row, loading } = useSection("testimonials");
  const content = row?.content ?? DEFAULT_CONTENT.testimonials;
  const visible = row?.visible ?? true;
  const stats = content.stats ?? DEFAULT_CONTENT.testimonials.stats;
  const testimonialList =
    content.testimonials ?? DEFAULT_CONTENT.testimonials.testimonials;

  if (!loading && !visible) return null;
  if (!testimonialList.length) return null;

  return (
    <section
      className="relative bg-[#15350e] bg-cover bg-center pb-[60px]"
      style={{
        backgroundImage: `url(${content.background_image_url || bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-[rgba(21,53,14,0.82)] backdrop-blur-[2px]" />

      <div className="container relative z-20">
        <div
          className="
      relative
      flex
      -translate-y-1/2
      flex-wrap
      items-center
      justify-between
      gap-6
      rounded-[20px]
      bg-white
      p-[32px_40px]

      shadow-[0_14px_45px_rgba(128,128,128,0.28)]

      max-[900px]:translate-y-0
      max-[900px]:justify-center
      max-[900px]:p-6
    "
        >
          {stats.map((stat, i) => (
            <div
              className="
          relative
          flex
          flex-1
          basis-[200px]
          items-center
          gap-4
          pr-6
          max-[900px]:pr-0
        "
              key={i}
            >
              <div className="flex h-[60px] w-[60px] flex-none items-center justify-center [&_img]:max-h-full [&_img]:max-w-full">
                {STAT_ICONS[i]}
              </div>

              <div>
                <p className="m-0 font-heading text-[32px] leading-[1.2] font-bold text-primary">
                  {stat.value}
                </p>

                <p className="m-0 font-heading text-[15px] text-text-dark">
                  {stat.label}
                </p>
              </div>

              {i < stats.length - 1 && (
                <span
                  className="
              absolute
              top-1/2
              right-0
              h-[60px]
              w-px
              -translate-y-1/2
              bg-black/15
              max-[900px]:hidden
            "
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="container relative pt-24 text-center max-[700px]:pt-5">
        <h2 className="m-0 mb-4 font-heading text-[44px] font-bold text-white max-[700px]:text-[32px] max-[420px]:text-[26px]">
          {content.title}
        </h2>
        <div className="mx-auto mb-14 max-w-[780px]">
          <ExpandableText
            text={content.intro_text}
            lines={2}
            className="font-heading text-lg leading-[1.8] text-white/90"
            toggleClassName="mt-1.5 font-heading text-sm font-semibold text-white/70 hover:underline"
          />
        </div>

        <div className="mx-auto flex max-w-[960px] flex-col gap-10">
          {testimonialList.map((testimonial, i) => (
            <div
              key={i}
              className="relative rounded border border-[#eab308] p-[60px_48px_40px] max-[600px]:p-[50px_24px_28px]"
            >
              <img
                className="absolute top-[-95px] left-[-30px] h-[250px] w-auto max-[600px]:top-[-55px] max-[600px]:left-[-15px] max-[600px]:h-[140px]"
                src={iconQuote}
                alt=""
                aria-hidden="true"
              />
              <img
                className="absolute top-[-55px] left-1/2 mb-5 h-20 w-20 -translate-x-1/2 rounded-full border-[3px] border-[#eab308] object-cover max-[600px]:top-[-40px] max-[600px]:h-16 max-[600px]:w-16"
                src={testimonial.photo_url || patientPhoto}
                alt={testimonial.name}
              />
              <p className="m-0 mb-4 font-heading text-[23px] font-medium text-white max-[600px]:text-lg">
                {testimonial.name}
              </p>
              <div className="mx-auto mb-5 max-w-[1026px]">
                <ExpandableText
                  text={testimonial.quote}
                  lines={4}
                  className="font-heading text-base leading-[2] text-white/90"
                  toggleClassName="mt-1.5 font-heading text-sm font-semibold text-[#eab308] hover:underline"
                />
              </div>
              <img
                className="mx-auto h-[21px]"
                src={stars}
                alt="5 out of 5 stars"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
