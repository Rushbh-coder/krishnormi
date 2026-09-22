import Header from "../sections/Header";
import Footer from "../sections/Footer";
import WhyChoose from "../sections/WhyChoose";
import AboutHero from "../sections/aboute/AboutHero";
import AboutModernPractice from "../sections/aboute/AboutModernPractice";
import AboutMeetDoctors from "../sections/aboute/AboutMeetDoctors";
import AboutWhatGuidesUs from "../sections/aboute/AboutWhatGuidesUs";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

const CORE_VALUES = [
  "Patient first",
  "Evidence informed",
  "Individualized care",
];

export default function AboutUsPage() {
  const { row: aboutRow } = useSection("about_page");
  const { row: testimonialsRow } = useSection("testimonials");

  const previewMode =
    new URLSearchParams(window.location.search).get("preview") === "true";
  let previewData = null;
  if (previewMode) {
    try {
      previewData = JSON.parse(
        sessionStorage.getItem("about_page_preview") || "null",
      );
    } catch {
      previewData = null;
    }
  }

  const liveContent = aboutRow?.content ?? DEFAULT_CONTENT.about_page;
  const rawContent =
    previewMode && previewData?.content ? previewData.content : liveContent;

  const content = {
    // Banner
    banner_eyebrow:
      rawContent?.banner?.eyebrow ??
      rawContent?.banner_eyebrow ??
      DEFAULT_CONTENT.about_page.banner_eyebrow,

    banner_heading:
      rawContent?.banner?.heading ??
      rawContent?.banner_heading ??
      DEFAULT_CONTENT.about_page.banner_heading,

    banner_text:
      rawContent?.banner?.text ??
      rawContent?.banner_text ??
      DEFAULT_CONTENT.about_page.banner_text,

    banner_image_url:
      rawContent?.banner?.image_url ?? rawContent?.banner_image_url ?? "",

    // Modern practice
    modern_practice_heading:
      rawContent?.modern_practice?.heading ??
      rawContent?.modern_practice_heading ??
      DEFAULT_CONTENT.about_page.modern_practice_heading,

    modern_practice_text_1:
      rawContent?.modern_practice?.text_1 ??
      rawContent?.modern_practice_text_1 ??
      DEFAULT_CONTENT.about_page.modern_practice_text_1,

    modern_practice_text_2:
      rawContent?.modern_practice?.text_2 ??
      rawContent?.modern_practice_text_2 ??
      DEFAULT_CONTENT.about_page.modern_practice_text_2,

    modern_practice_main_image_url:
      rawContent?.modern_practice?.main_image_url ??
      rawContent?.modern_practice_main_image_url ??
      "",

    modern_practice_front_image_url:
      rawContent?.modern_practice?.front_image_url ??
      rawContent?.modern_practice_front_image_url ??
      "",

    core_values_heading:
      rawContent?.modern_practice?.core_values_title ??
      rawContent?.core_values_heading ??
      "Core values",

    core_values: Array.isArray(rawContent?.modern_practice?.core_values)
      ? rawContent.modern_practice.core_values
      : Array.isArray(rawContent?.core_values)
        ? rawContent.core_values
        : CORE_VALUES,

    // Experience
    experience_number:
      rawContent?.experience_number ??
      rawContent?.modern_practice?.experience_number ??
      DEFAULT_CONTENT.about_page.experience_number ??
      "35+",

    experience_label:
      rawContent?.experience_label ??
      rawContent?.modern_practice?.experience_label ??
      DEFAULT_CONTENT.about_page.experience_label ??
      "Experience",

    // Doctors
    doctor_deepa_name:
      rawContent?.doctors?.doctor_1?.name ??
      rawContent?.doctor_deepa_name ??
      DEFAULT_CONTENT.about_page.doctor_deepa_name,

    doctor_deepa_badge:
      rawContent?.doctors?.doctor_1?.badge ??
      rawContent?.doctor_deepa_badge ??
      DEFAULT_CONTENT.about_page.doctor_deepa_badge,

    doctor_deepa_role:
      rawContent?.doctors?.doctor_1?.role ??
      rawContent?.doctor_deepa_role ??
      DEFAULT_CONTENT.about_page.doctor_deepa_role,

    doctor_deepa_bio:
      rawContent?.doctors?.doctor_1?.bio ??
      rawContent?.doctor_deepa_bio ??
      DEFAULT_CONTENT.about_page.doctor_deepa_bio,

    doctor_deepa_image_url:
      rawContent?.doctors?.doctor_1?.image_url ??
      rawContent?.doctor_deepa_image_url ??
      "",

    doctor_khevana_name:
      rawContent?.doctors?.doctor_2?.name ??
      rawContent?.doctor_khevana_name ??
      DEFAULT_CONTENT.about_page.doctor_khevana_name,

    doctor_khevana_badge:
      rawContent?.doctors?.doctor_2?.badge ??
      rawContent?.doctor_khevana_badge ??
      DEFAULT_CONTENT.about_page.doctor_khevana_badge,

    doctor_khevana_role:
      rawContent?.doctors?.doctor_2?.role ??
      rawContent?.doctor_khevana_role ??
      DEFAULT_CONTENT.about_page.doctor_khevana_role,

    doctor_khevana_bio:
      rawContent?.doctors?.doctor_2?.bio ??
      rawContent?.doctor_khevana_bio ??
      DEFAULT_CONTENT.about_page.doctor_khevana_bio,

    doctor_khevana_image_url:
      rawContent?.doctors?.doctor_2?.image_url ??
      rawContent?.doctor_khevana_image_url ??
      "",

    doctors_background_image_url:
      rawContent?.doctors?.background_image_url ??
      rawContent?.doctors_background_image_url ??
      "",

    doctor_card_texture_url:
      rawContent?.doctors?.card_texture_url ??
      rawContent?.doctor_card_texture_url ??
      "",

    doctors_title:
      rawContent?.doctors?.title ??
      rawContent?.doctors_title ??
      "Meet Our Doctors",

    doctors_subtitle:
      rawContent?.doctors?.subtitle ??
      rawContent?.doctors_subtitle ??
      "Expert Dermatology Guided by Experience, Evidence and Individual Care.",

    doctors_description:
      rawContent?.doctors?.description ??
      rawContent?.doctors_description ??
      "A shared commitment to thoughtful assessment, clear communication and individualized dermatology care.",

    // What Guides Us
    guides_heading:
      rawContent?.what_guides_us?.title ??
      rawContent?.guides_heading ??
      "What Guides Us",

    guides_text:
      rawContent?.what_guides_us?.description ?? rawContent?.guides_text ?? "",

    vision_title:
      rawContent?.what_guides_us?.vision?.title ??
      rawContent?.vision_title ??
      "Our Vision",

    vision_text:
      rawContent?.what_guides_us?.vision?.text ?? rawContent?.vision_text ?? "",

    vision_image_url:
      rawContent?.what_guides_us?.vision?.image_url ??
      rawContent?.vision_image_url ??
      "",

    mission_title:
      rawContent?.what_guides_us?.mission?.title ??
      rawContent?.mission_title ??
      "Our Mission",

    mission_text:
      rawContent?.what_guides_us?.mission?.text ??
      rawContent?.mission_text ??
      "",

    mission_image_url:
      rawContent?.what_guides_us?.mission?.image_url ??
      rawContent?.mission_image_url ??
      "",

    goals_title:
      rawContent?.what_guides_us?.goals?.title ??
      rawContent?.goals_title ??
      "Our Goals",

    goals_text:
      rawContent?.what_guides_us?.goals?.text ?? rawContent?.goals_text ?? "",

    goals_image_url:
      rawContent?.what_guides_us?.goals?.image_url ??
      rawContent?.goals_image_url ??
      "",
  };

  const testimonialsContent =
    testimonialsRow?.content ?? DEFAULT_CONTENT.testimonials;
  const stats = testimonialsContent.stats ?? DEFAULT_CONTENT.testimonials.stats;

  return (
    <>
      <Header />

      <style>{`
        @keyframes krHeroZoom { 0% { transform:scale(1.08); filter:saturate(.85) blur(2px); } 100% { transform:scale(1); filter:saturate(1) blur(0); } }
        @keyframes krHeroContent { 0% { opacity:0; transform:translate3d(-45px,25px,0) scale(.96); } 70% { opacity:1; transform:translate3d(8px,-3px,0) scale(1.01); } 100% { opacity:1; transform:translate3d(0,0,0) scale(1); } }
        @keyframes krFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes krPulse { 0%,100% { box-shadow:0 0 0 0 rgba(37,211,102,.22); } 50% { box-shadow:0 0 0 14px rgba(37,211,102,0); } }
        @keyframes krGlow { 0%,100% { box-shadow:0 0 0 rgba(23,119,63,0); } 50% { box-shadow:0 0 32px rgba(23,119,63,.18); } }
        @keyframes krShimmer { 0% { background-position:-220% 0; } 100% { background-position:220% 0; } }
        @keyframes krRevealUp { from { opacity:0; transform:translate3d(0,55px,0) scale(.97); filter:blur(5px); } to { opacity:1; transform:translate3d(0,0,0) scale(1); filter:blur(0); } }
        .kr-reveal-hidden { opacity:0; }
        .kr-reveal-visible { animation:krRevealUp .9s cubic-bezier(.2,.75,.2,1) var(--reveal-delay,0ms) both; }
        .kr-hero-image { animation:krHeroZoom 1.8s cubic-bezier(.2,.7,.2,1) both; transform-origin:center; }
        .kr-hero-content { animation:krHeroContent 1.15s cubic-bezier(.2,.75,.2,1) .25s both; }
        .kr-orbit { animation:krFloat 5s ease-in-out infinite; }
        .kr-stat-card { transition:transform .35s ease,box-shadow .35s ease; }
        .kr-stat-card:hover { transform:translateY(-9px) scale(1.025); box-shadow:0 18px 55px rgba(0,0,0,.14); }
        .kr-stat-item { transition:transform .35s ease; }
        .kr-stat-item:hover { transform:translateY(-6px); }
        .kr-stat-icon { transition:transform .5s cubic-bezier(.2,.8,.2,1); }
        .kr-stat-item:hover .kr-stat-icon { transform:rotate(-7deg) scale(1.13); }
        .kr-doctor-card { transition:transform .55s cubic-bezier(.2,.8,.2,1),filter .55s ease; }
        .kr-doctor-card:hover { transform:translateY(-12px) scale(1.015); filter:drop-shadow(0 25px 35px rgba(0,0,0,.18)); }
        .kr-doctor-photo { transition:transform .8s cubic-bezier(.2,.8,.2,1),filter .8s ease; }
        .kr-doctor-card:hover .kr-doctor-photo { transform:scale(1.055) translateY(-5px); filter:brightness(1.06) saturate(1.08); }
        .kr-guide-card { transition:transform .5s cubic-bezier(.2,.8,.2,1),box-shadow .5s ease; }
        .kr-guide-card:hover { transform:translateY(-12px) scale(1.025); box-shadow:0 25px 55px rgba(0,0,0,.18); }
        .kr-guide-card img { transition:transform 1s cubic-bezier(.2,.8,.2,1),filter .8s ease; }
        .kr-guide-card:hover img { transform:scale(1.09); filter:saturate(1.08) contrast(1.03); }
        .kr-guide-card .kr-guide-icon { transition:transform .5s ease; }
        .kr-guide-card:hover .kr-guide-icon { transform:rotate(12deg) scale(1.18); }
        .kr-btn { position:relative; overflow:hidden; transition:transform .3s ease,box-shadow .3s ease; }
        .kr-btn::after { content:""; position:absolute; inset:0; transform:translateX(-120%); background:linear-gradient(100deg,transparent,rgba(255,255,255,.4),transparent); transition:transform .65s ease; }
        .kr-btn:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 12px 30px rgba(0,0,0,.15); }
        .kr-btn:hover::after { transform:translateX(120%); }
        .kr-whatsapp { animation:krPulse 2.2s ease-out infinite; transition:transform .3s ease; }
        .kr-whatsapp:hover { transform:scale(1.08) rotate(-4deg); }
        .kr-divider { position:relative; overflow:hidden; }
        .kr-divider::after { content:""; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent); transform:translateX(-120%); animation:krShimmer 3.2s linear infinite; }
        .kr-core-value { transition:transform .3s ease,color .3s ease; }
        .kr-core-value:hover { transform:translateX(7px); color:#df2759; }
        @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; transition-duration:.01ms !important; } }
      `}</style>

      <main key={aboutRow?.updated_at || "about-page"}>
        <AboutHero content={content} />
        <AboutModernPractice content={content} />
        <AboutMeetDoctors content={content} stats={stats} />
        <AboutWhatGuidesUs content={content} />
        <WhyChoose />
      </main>

      <Footer />
    </>
  );
}
