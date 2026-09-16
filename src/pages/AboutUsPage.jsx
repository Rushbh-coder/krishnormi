import { useEffect, useRef, useState } from "react";
import { FaWhatsapp, FaEye, FaBullseye, FaFlagCheckered } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

import Header from "../sections/Header";
import Footer from "../sections/Footer";
import WhyChoose from "../sections/WhyChoose";

import bannerHero from "../assets/about-page/banner-hero.jpg";
import collageMain from "../assets/about-page/collage-main.jpg";
import collageFront from "../assets/about-page/collage-front.jpg";
import doctorsBg from "../assets/about-page/doctors-bg.jpg";
import cardTexture from "../assets/about-page/card-texture.jpg";
import doctorDeepa from "../assets/about-page/doctor-deepa.png";
import doctorKhevana from "../assets/about-page/doctor-khevana.png";
import visionPhoto from "../assets/about-page/vision-photo.jpg";
import missionPhoto from "../assets/about-page/mission-photo.jpg";
import goalsPhoto from "../assets/about-page/goals-photo.jpg";

import iconYear from "../assets/testimonials/icon-years.svg";
import iconSkin from "../assets/testimonials/skin.png";
import iconPatients1 from "../assets/testimonials/icon-patients-1.svg";
import iconPatients2 from "../assets/testimonials/icon-patients-2.svg";
import iconSatisfaction from "../assets/testimonials/icon-satisfaction.svg";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

import {
  useReducedMotion,
  useRevealOnce,
  revealClass,
} from "../hooks/useScrollReveal";

function Reveal({ children, className = "", delay = 0 }) {
  const reducedMotion = useReducedMotion();
  const [ref, visible] = useRevealOnce(reducedMotion);

  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` }}
      className={`${revealClass(visible, className)} kr-reveal ${
        visible ? "kr-reveal-visible" : "kr-reveal-hidden"
      }`}
    >
      {children}
    </div>
  );
}

function formatStatValue(value, progress) {
  const text = String(value ?? "");

  if (progress >= 1) return text;

  const match = text.match(/^(\s*[^0-9+-]*)([+-]?\d[\d,]*(?:\.\d+)?)(.*)$/);

  if (!match) return text;

  const [, prefix, numericText, suffix] = match;
  const target = Number(numericText.replace(/,/g, ""));

  if (!Number.isFinite(target)) return text;

  const decimals = Math.min(numericText.split(".")[1]?.length ?? 0, 6);
  const currentValue = decimals
    ? Number((target * progress).toFixed(decimals))
    : Math.round(target * progress);

  return `${prefix}${new Intl.NumberFormat("en-US", {
    useGrouping: numericText.includes(","),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(currentValue)}${suffix}`;
}

function toSentenceCase(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
}

function AboutHeading({ value }) {
  const text = toSentenceCase(value || "About Krishnormi");
  const brandStart = text.toLowerCase().indexOf("krishnormi");

  if (brandStart === -1) return text;

  return (
    <>
      {text.slice(0, brandStart)}
      <span className="text-primary">Krishnormi</span>
      {text.slice(brandStart + "krishnormi".length)}
    </>
  );
}

const CORE_VALUES = [
  "Patient first",
  "Evidence informed",
  "Individualized care",
];

/*
|--------------------------------------------------------------------------
| STAT ICONS
|--------------------------------------------------------------------------
| Values and labels are fetched from Homepage Testimonials.
| Only the icons remain local to About Us.
|--------------------------------------------------------------------------
*/

const STAT_ICONS = [
  <img
    key="years"
    src={iconYear}
    alt=""
    aria-hidden="true"
    className="h-[44px] w-[44px] object-contain [filter:brightness(0)_saturate(100%)_invert(83%)_sepia(17%)_saturate(704%)_hue-rotate(34deg)_brightness(96%)_contrast(87%)]"
  />,

  <span key="patients" className="relative block h-[48px] w-[48px] flex-none">
    <img
      className="absolute inset-[24.76%_0_8.74%_0] h-auto w-full object-contain [filter:brightness(0)_saturate(100%)_invert(83%)_sepia(17%)_saturate(704%)_hue-rotate(34deg)_brightness(96%)_contrast(87%)]"
      src={iconPatients1}
      alt=""
      aria-hidden="true"
    />

    <img
      className="absolute inset-[8.74%_29.47%_76.26%_55.54%] h-auto w-auto object-contain [filter:brightness(0)_saturate(100%)_invert(83%)_sepia(17%)_saturate(704%)_hue-rotate(34deg)_brightness(96%)_contrast(87%)]"
      src={iconPatients2}
      alt=""
      aria-hidden="true"
    />
  </span>,

  <img
    key="skin"
    src={iconSkin}
    alt=""
    aria-hidden="true"
    className="h-[44px] w-[44px] object-contain [filter:brightness(0)_saturate(100%)_invert(83%)_sepia(17%)_saturate(704%)_hue-rotate(34deg)_brightness(96%)_contrast(87%)]"
  />,

  <img
    key="satisfaction"
    src={iconSatisfaction}
    alt=""
    aria-hidden="true"
    className="h-[44px] w-[44px] object-contain [filter:brightness(0)_saturate(100%)_invert(83%)_sepia(17%)_saturate(704%)_hue-rotate(34deg)_brightness(96%)_contrast(87%)]"
  />,
];

function DoctorCard({ photo, name, badge, role, bio, cardTextureUrl }) {
  return (
    <Reveal
      delay={120}
      className="
        kr-doctor-card
        relative
        w-full
        min-w-0
      "
    >
      {/* =====================================================
          MOBILE CARD
          Below 640px
      ====================================================== */}
      <div
        className="
          relative
          w-full
          overflow-hidden
          rounded-[26px]
          bg-[#15350e]
          shadow-[0_18px_45px_rgba(0,0,0,0.20)]
          sm:hidden
        "
      >
        <img
          src={cardTextureUrl || cardTexture}
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            opacity-[0.20]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[linear-gradient(to_bottom,rgba(45,82,28,0.45)_0%,#15350e_52%,#102b0b_100%)]
          "
        />

        <div
          className="
            relative
            z-[1]
            flex
            h-[300px]
            w-full
            items-end
            justify-center
            overflow-hidden
            max-[430px]:h-[285px]
            max-[375px]:h-[260px]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              bottom-[20px]
              left-1/2
              h-[230px]
              w-[230px]
              -translate-x-1/2
              rounded-full
              border
              border-white/10
              bg-white/[0.05]
              max-[430px]:h-[210px]
              max-[430px]:w-[210px]
            "
          />

          <img
            src={photo}
            alt={name}
            className="
              relative
              z-[2]
              h-[96%]
              w-auto
              max-w-[94%]
              object-contain
              object-bottom
              drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]
            "
          />
        </div>

        <div
          className="
            relative
            z-[3]
            px-5
            pt-5
            pb-7
            text-center
            min-[430px]:px-7
          "
        >
          <span
            className="
              mb-4
              inline-flex
              w-fit
              items-center
              justify-center
              rounded-full
              bg-[#5d8648]
              px-4
              py-[9px]
              font-heading
              text-[12px]
              leading-none
              font-semibold
              text-white
              min-[430px]:px-5
              min-[430px]:text-[13px]
            "
          >
            {badge}
          </span>

          <h3
            className="
              m-0
              font-heading
              text-[22px]
              leading-[1.3]
              font-bold
              text-white
              min-[430px]:text-[24px]
            "
          >
            {name}
          </h3>

          <p
            className="
              mx-auto
              mt-2
              mb-4
              max-w-[330px]
              font-heading
              text-[13px]
              leading-[1.55]
              text-white/80
              italic
              min-[430px]:text-[14px]
            "
          >
            {role}
          </p>

          {bio && (
            <p
              className={`
                mx-auto
                mt-0
                mb-6
                max-w-[360px]
                font-body
                text-[13px]
                leading-[1.7]
                text-white/80
              `}
            >
              {bio}
            </p>
          )}

          <a href="/our-doctor" className="btn-hero mt-5 max-[460px]:w-[100px]">
            View Profile
          </a>
        </div>
      </div>

      {/* =====================================================
          TABLET + DESKTOP CARD
          640px and above
      ====================================================== */}
      <div
        className="
          relative
          hidden
          w-full
          sm:block
          sm:min-h-[430px]
          md:min-h-[450px]
          xl:min-h-0
          xl:aspect-[665/460]
        "
      >
        <div
          className="
            absolute
            inset-0
            [filter:drop-shadow(0_18px_32px_rgba(0,0,0,0.28))]
          "
        >
          <div
            className="
              absolute
              inset-0
              overflow-hidden
              rounded-[24px]
              xl:rounded-none
              xl:[clip-path:polygon(17.75%_0,100%_0,100%_100%,0_100%)]
            "
          >
            <img
              src={cardTextureUrl || cardTexture}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-[75%_center]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-[linear-gradient(to_left,rgba(36,71,17,0.72)_0%,#15350e_12%,#15350e_100%)]
              "
            />
          </div>
        </div>

        <img
          src={photo}
          alt={name}
          className="
            kr-doctor-photo
            absolute
            bottom-0
            z-[1]
            h-[92%]
            w-auto
            max-w-none
            object-contain
            object-bottom
            drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]
            sm:left-[-3%]
            md:left-[-4%]
            md:h-[94%]
            xl:left-[-11%]
            xl:h-[96%]
          "
        />

        <div
          className="
            relative
            z-[2]
            flex
            min-h-[430px]
            flex-col
            justify-center
            py-10
            pr-8
            pl-[44%]
            md:min-h-[450px]
            md:pr-10
            xl:h-full
            xl:min-h-0
            xl:py-[7%]
            xl:pr-[6%]
            xl:pl-[41.5%]
          "
        >
          <span
            className="
              mb-3.5
              inline-flex
              w-fit
              items-center
              rounded-full
              bg-[#5d8648]
              px-5
              py-[9px]
              font-heading
              text-[13px]
              leading-none
              font-semibold
              text-white
              lg:text-[14px]
              xl:text-[15px]
            "
          >
            {badge}
          </span>

          <h3
            className="
              m-0
              font-heading
              text-[20px]
              leading-[1.3]
              font-semibold
              text-white
              lg:text-[21px]
              xl:text-[22px]
            "
          >
            {name}
          </h3>

          <p
            className="
              mt-1
              mb-4
              font-heading
              text-[13px]
              leading-[1.5]
              text-white/85
              italic
              lg:text-sm
            "
          >
            {role}
          </p>

          {bio && (
            <p
              className="
                m-0
                mb-6
                font-body
                text-xs
                leading-[1.65]
                text-white/85
              "
            >
              {bio}
            </p>
          )}

          <a
            href="/our-doctor"
            className="
              btn-hero
              kr-btn
              text-sm
              inline-flex
              lg:w-[150px]
            "
          >
            View Profile
          </a>
        </div>
      </div>
    </Reveal>
  );
}

function GuideCard({ label, icon: Icon, photo, text }) {
  return (
    <Reveal delay={220} className="kr-guide-card relative">
      <div
        className="
        relative
        aspect-[466/529]
        w-full
        overflow-hidden
      "
      >
        <img
          src={photo}
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
          "
        />

        <div
          className="
          absolute
          inset-0
          bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_31.32%,rgba(0,0,0,0.8)_90.11%)]
        "
        />

        <span
          className="kr-guide-icon
          absolute
          top-[4.9%]
          left-[6.7%]
          flex
          h-[10.3%]
          w-[11.7%]
          items-center
          justify-center
          text-accent
        "
        >
          <Icon className="h-full w-full" aria-hidden="true" />
        </span>

        <div
          className="
          absolute
          inset-x-0
          bottom-0
          flex
          h-[39%]
          flex-col
          px-[7.3%]
          pb-[4.5%]
          text-left
        "
        >
          <p
            className="
            m-0
            mb-1
            font-heading
            text-[26px]
            leading-[36px]
            font-semibold
            text-white
            min-[901px]:min-h-[36px]
            max-[1200px]:text-[22px]
            max-[1200px]:leading-[30px]
          "
          >
            {label}
          </p>

          <p
            className="
            m-0
            font-heading
            text-lg
            leading-[30px]
            text-white
            max-[1200px]:text-base
            max-[1200px]:leading-[26px]
          "
          >
            {text}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function AboutUsPage() {
  /*
  |--------------------------------------------------------------------------
  | ABOUT US CONTENT
  |--------------------------------------------------------------------------
  */

  const { row: aboutRow } = useSection("about_page");

  /*
  |--------------------------------------------------------------------------
  | TESTIMONIAL / HOMEPAGE STATISTICS
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | About Us statistics are now fetched directly from the Homepage
  | Testimonials section.
  |
  */

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

  // Always use the latest About Us record fetched from Supabase.
  // Preview data is used only when /about-us?preview=true is active.
  const liveContent = aboutRow?.content ?? DEFAULT_CONTENT.about_page;

  const rawContent =
    previewMode && previewData?.content ? previewData.content : liveContent;

  /*
   * Supabase stores About Us content in nested JSON:
   *
   * content.banner.heading
   * content.modern_practice.heading
   * content.doctors.doctor_1.name
   * content.what_guides_us.vision.text
   *
   * The JSX below uses flat content.* fields.
   * Normalize the live Supabase JSON here so Admin changes
   * are reflected on the public page immediately.
   *
   * The fallback also supports the older flat structure.
   */
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

  /*
  |--------------------------------------------------------------------------
  | FETCH TESTIMONIAL STATISTICS
  |--------------------------------------------------------------------------
  */

  const testimonialsContent =
    testimonialsRow?.content ?? DEFAULT_CONTENT.testimonials;

  const stats = testimonialsContent.stats ?? DEFAULT_CONTENT.testimonials.stats;

  const reducedMotion = useReducedMotion();
  const [statsRef, statsVisible] = useRevealOnce(reducedMotion);
  const [statsProgress, setStatsProgress] = useState(0);
  const statsCountCompleted = useRef(false);

  useEffect(() => {
    if (!statsVisible || statsCountCompleted.current) return undefined;

    if (reducedMotion) {
      setStatsProgress(1);
      statsCountCompleted.current = true;
      return undefined;
    }

    let frameId;
    let startTime = null;
    const duration = 1500;

    const animateStats = (time) => {
      if (startTime === null) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setStatsProgress(eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(animateStats);
      } else {
        setStatsProgress(1);
        statsCountCompleted.current = true;
      }
    };

    frameId = requestAnimationFrame(animateStats);

    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion, statsVisible]);

  const whatsappNumber = DEFAULT_CONTENT.footer.whatsapp_number.replace(
    /\D/g,
    "",
  );

  const doctors = [
    {
      photo: content.doctor_deepa_image_url || doctorDeepa,
      name: content.doctor_deepa_name || "Dr. Deepa Bhatt",
      badge: content.doctor_deepa_badge || "35+ years experience",
      role:
        content.doctor_deepa_role ||
        "Consultant Dermatologist | Cosmetologist | Trichologist",
      bio: content.doctor_deepa_bio || "",
      cardTextureUrl: content.doctor_card_texture_url || cardTexture,
    },
    {
      photo: content.doctor_khevana_image_url || doctorKhevana,
      name: content.doctor_khevana_name || "Dr. Khevana Bhatt",
      badge: content.doctor_khevana_badge || "Dermatologist",
      role: content.doctor_khevana_role || "Dermatologist",
      bio: content.doctor_khevana_bio || "",
      cardTextureUrl: content.doctor_card_texture_url || cardTexture,
    },
  ];

  const guides = [
    {
      label: content.vision_title || "Our Vision",
      icon: FaEye,
      photo: content.vision_image_url || visionPhoto,
      text:
        content.vision_text ||
        "To make responsible, individualized dermatology care feel clear, reassuring and accessible to every patient.",
    },
    {
      label: content.mission_title || "Our Mission",
      icon: FaBullseye,
      photo: content.mission_image_url || missionPhoto,
      text:
        content.mission_text ||
        "To combine clinical experience, careful assessment and transparent communication in every care journey.",
    },
    {
      label: content.goals_title || "Our Goals",
      icon: FaFlagCheckered,
      photo: content.goals_image_url || goalsPhoto,
      text:
        content.goals_text ||
        "To support informed choices, continuity of care and treatment recommendations suited to each individual.",
    },
  ];

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
        {/* ───────── BANNER ───────── */}

        <section
          className="
          mx-auto
          w-full
          max-w-[1920px]
          overflow-hidden
          bg-white
        "
        >
          <div
            className="
            relative
            w-full
            [aspect-ratio:1920/766]
            max-[900px]:aspect-auto
          "
          >
            <img
              src={content.banner_image_url || bannerHero}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
                max-[900px]:relative
                max-[900px]:aspect-[16/11]
                max-[900px]:h-auto
                max-[900px]:object-[100%_center]
              "
            />

            <div
              className="
              kr-hero-content
              absolute
              top-[55.3%]
              left-[12.5%]
              w-[31.63%]
              -translate-y-1/2
              max-[900px]:static
              max-[900px]:w-auto
              max-[900px]:translate-y-0
              max-[900px]:px-5
              max-[900px]:pt-10
              max-[900px]:pb-14
            "
            >
              <h1
                className="
                font-heading
                text-[clamp(26px,2.865vw,55px)]
                leading-[1.4]
                font-bold
                text-black
                max-[900px]:text-[36px]
                max-[560px]:text-[30px]
              "
              >
                <AboutHeading value={content.banner_eyebrow} />
              </h1>

              <hr
                className="
                kr-divider
                section-divider
                mt-[0.52vw]
                mb-[1.2vw]
                h-[3px]
                w-[clamp(120px,10.68vw,205px)]
                max-[900px]:my-4
                max-[900px]:w-[160px]
              "
              />

              <p
                className="
                font-heading
                text-[clamp(16px,1.302vw,25px)]
                leading-[1.6]
                font-semibold
                text-black
                max-[900px]:text-[20px]
              "
              >
                {content.banner_text ||
                  "Dermatology care built on experience, understanding and trust."}
              </p>

              <p
                className="
                mt-[1vw]
                font-body
                text-[clamp(14px,0.99vw,19px)]
                leading-[1.6]
                text-text
                max-[900px]:mt-4
                max-[900px]:text-base
              "
              >
                <span className="font-bold text-black">Krishnormi</span> is a
                patient-first dermatology and aesthetics practice where careful
                assessment, responsible recommendations and continuity of care
                guide every interaction.
              </p>

              <a
                href="/contact-us"
                className="mt-5 flex w-[200px] items-center justify-center rounded-full border border-accent bg-white px-5 py-3.5 font-body text-sm font-semibold text-accent transition-colors duration-200 hover:bg-accent hover:text-white"
              >
                Book an Appointment
              </a>
            </div>
          </div>
        </section>

        {/* ───────── A MODERN PRACTICE ───────── */}

        <section
          className="
          w-full
          bg-white
          pt-[100px]
          pb-[40px]
          max-[900px]:py-14
        "
        >
          <div
            className="
            container
            grid
            grid-cols-[minmax(0,700fr)_minmax(0,707fr)]
            items-start
            gap-[31px]
            max-[900px]:grid-cols-1
            max-[900px]:gap-16
          "
          >
            <Reveal
              className="
              relative
              aspect-square
              w-[88.6%]
              max-[900px]:mx-auto
              max-[900px]:mb-20
              max-[900px]:w-[72%]
            "
            >
              <img
                src={
                  content.modern_practice_main_image_url ||
                  content.story_image_url ||
                  collageMain
                }
                alt="Dermatology and skin care treatments at Krishnormi"
                className="
                  kr-orbit
                  absolute
                  inset-0
                  h-full
                  w-full
                  rounded-full
                  object-cover
                "
              />

              <div
                className="
                kr-orbit
                absolute
                top-[-0.9%]
                left-[2.3%]
                z-[2]
                flex
                aspect-square
                w-[24.4%]
                flex-col
                items-center
                justify-center
                rounded-full
                border-5
                bg-navy
                text-center
                leading-[1.3]
                text-white
              "
              >
                <span
                  className="
                  font-heading
                  text-[clamp(18px,2.24vw,43px)]
                  leading-[1.1]
                  font-bold
                "
                >
                  {content.experience_number || "35+"}
                </span>

                <span
                  className="
                  font-heading
                  text-[clamp(10px,1.04vw,20px)]
                  leading-[1.2]
                  font-medium
                "
                >
                  {content.experience_label || "Experience"}
                </span>
              </div>

              <img
                src={content.modern_practice_front_image_url || collageFront}
                alt="Aesthetic dermatology procedure at Krishnormi"
                className="
                  absolute
                  top-[53.7%]
                  left-[57.6%]
                  z-[2]
                  h-[57.3%]
                  w-[55.3%]
                  rounded-[50%]
                  border-4
                  border-white
                  object-cover
                  shadow-[-6px_-5px_4px_0_rgba(0,0,0,0.25)]
                "
              />
            </Reveal>

            <Reveal>
              <h2 className="section-title text-navy">
                {content.modern_practice_heading ||
                  "A modern practice shaped by responsible dermatology"}
              </h2>

              <hr
                className="
                section-divider
                mb-[30px]
              "
              />

              <p
                className="
                font-body
                text-sm
                leading-[30px]
                text-text
              "
              >
                {content.modern_practice_text_1 ||
                  "Krishnormi brings clinical dermatology, hair and scalp care, laser procedures and aesthetic dermatology together within one professional setting."}
              </p>

              <p
                className="
                mt-4
                font-body
                text-sm
                leading-[30px]
                text-text
              "
              >
                {content.modern_practice_text_2 ||
                  "Our approach is evidence-informed, transparent, ethical and personalised. Every recommendation begins with careful assessment of the patient’s concerns, needs and suitability for treatment—never a one-size-fits-all plan."}
              </p>

              <p
                className="
                mt-9
                mb-[18px]
                font-heading
                text-lg
                leading-[30px]
                font-bold
                text-navy
              "
              >
                {content.core_values_heading || "Core values"}
              </p>

              <div
                className="
                flex
                flex-wrap
                gap-x-[30px]
                gap-y-4
              "
              >
                {(content.core_values || CORE_VALUES).map((value) => (
                  <span
                    key={value}
                    className="
                      kr-core-value
                      inline-flex
                      items-center
                      gap-2
                      font-heading
                      text-lg
                      leading-[32px]
                      font-medium
                      text-black
                    "
                  >
                    <FiArrowUpRight
                      className="text-accent"
                      aria-hidden="true"
                    />

                    {value}
                  </span>
                ))}
              </div>

              <div
                className="
                mt-9
                flex
                w-[390px]
                max-w-full
                items-center
                rounded-md
                bg-[#e8f5f5]
                py-4
                pr-5
                pl-[30px]
              "
              >
                <span
                  className="
                  kr-whatsapp
                  flex
                  h-[60px]
                  w-[60px]
                  flex-none
                  items-center
                  justify-center
                  rounded-full
                  bg-[#25d366]
                  text-white
                "
                >
                  <FaWhatsapp size={32} aria-hidden="true" />
                </span>

                <span
                  className="
                    ml-4
                    h-[74px]
                    w-px
                    flex-none
                    bg-black/15
                  "
                  aria-hidden="true"
                />

                <div
                  className="
                  min-w-0
                  pl-[21px]
                "
                >
                  <p
                    className="
                    m-0
                    font-heading
                    text-xl
                    leading-[30px]
                    font-semibold
                    text-[#137979]
                  "
                  >
                    WhatsApp Helpline
                  </p>

                  <p
                    className="
                    m-0
                    font-body
                    text-xs
                    leading-[25px]
                    text-[#444]
                  "
                  >
                    Quick Appointment Booking via Whatsapp
                  </p>

                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mt-1
                      inline-block
                      font-heading
                      text-base
                      font-semibold
                      text-[#25d366]
                    "
                  >
                    Message Us
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────── STATS BAR + MEET OUR DOCTORS ───────── */}

        <section
          className="
            relative
            overflow-x-clip
            bg-white
            pb-[100px]
            max-[900px]:pb-[80px]
            max-[640px]:pb-[60px]
          "
          style={{
            width: "100vw",
            maxWidth: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
          }}
        >
          <style>{`
            .doctors-band {
              border-radius: 50% / 3vw;
            }

            @media (max-width: 900px) {
              .doctors-band {
                border-radius: 38px 38px 0 0;
              }
            }

            @media (max-width: 640px) {
              .doctors-band {
                border-radius: 28px 28px 0 0;
              }
            }
          `}</style>

          {/* FULL WIDTH DOCTORS BACKGROUND */}
          <div
            className="
              doctors-band
              absolute
              inset-x-0
              top-[120px]
              bottom-0
              z-0
              w-full
              bg-cover
              bg-center
              max-[900px]:top-[150px]
              max-[640px]:top-[210px]
            "
            style={{
              backgroundImage: `url(${content.doctors_background_image_url || doctorsBg})`,
            }}
            aria-hidden="true"
          />

          {/* FLOATING STATS */}
          <div
            className="
              relative
              z-10
              mx-auto
              w-full
              max-w-[1240px]
              px-4
              pt-16
              pb-14
              sm:px-6
              lg:px-10
              max-[900px]:pt-12
              max-[640px]:pt-7
              max-[640px]:pb-10
            "
          >
            <div
              ref={statsRef}
              className={`
    mx-auto
    grid
    w-full
    grid-cols-2
    items-center
    gap-2
    overflow-hidden
    rounded-[14px]
    bg-[#082D70]
    px-4
    py-5
    shadow-none
    sm:gap-3
    sm:rounded-[14px]
    sm:px-5
    sm:py-6
    md:rounded-[14px]
    md:px-8
    md:py-8
    lg:grid-cols-4
    lg:gap-0
    transition-all
    duration-700
    ease-out
    motion-reduce:transition-none
    ${statsVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
  `}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 15% 20%, rgba(214,179,117,.20), transparent 32%), radial-gradient(circle at 90% 90%, rgba(117,167,139,.24), transparent 34%)",
                }}
                aria-hidden="true"
              />

              {stats.map((stat, i) => (
                <div
                  key={`${stat.label}-${i}`}
                  className={`relative flex min-w-0 items-center gap-2 px-1 py-3 sm:gap-4 sm:px-3 sm:py-4 lg:px-7 lg:py-3 ${i !== stats.length - 1 ? "lg:border-r lg:border-white/[0.12]" : ""}`}
                  style={{
                    transitionDelay:
                      statsVisible && !reducedMotion ? `${i * 90}ms` : "0ms",
                  }}
                >
                  <div
                    className="
                      flex
                      h-[46px]
                      w-[46px]
                      flex-none
                      items-center
                      justify-center
                      rounded-none
                      shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                      sm:h-[60px]
                      sm:w-[60px]
                      sm:rounded-2xl
                    "
                  >
                    {STAT_ICONS[i]}
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        m-0
                        font-heading
                        text-[21px]
                        leading-none
                        font-bold
                        text-white
                        sm:text-[29px]
                        md:text-[32px]
                      "
                    >
                      {formatStatValue(stat.value, statsProgress)}
                    </p>

                    <p
                      className="
                        mt-2
                        mb-0
                        font-heading
                        text-[9px]
                        leading-[1.3]
                        text-white/70
                        sm:text-[12px]
                        md:text-[13px]
                      "
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MEET OUR DOCTORS */}
          <div
            className="
              relative
              z-10
              mx-auto
              w-full
              max-w-[1450px]
              px-4
              text-center
              sm:px-6
              lg:px-10
            "
          >
            <Reveal>
              <h2
                className="
                  section-title
                  text-navy
                  max-[640px]:text-[30px]
                  max-[640px]:leading-[1.2]
                  max-[380px]:text-[27px]
                "
              >
                {content.doctors_title || "Meet Our Doctors"}
              </h2>

              <hr
                className="
                  section-divider
                  mx-auto
                  mb-6
                  max-[640px]:mb-5
                "
              />

              <p
                className="
                  mx-auto
                  mb-3
                  max-w-[780px]
                  font-heading
                  text-sm
                  leading-[1.8]
                  font-semibold
                  text-black
                  max-[640px]:max-w-[350px]
                  max-[640px]:px-2
                  max-[640px]:text-[14px]
                  max-[640px]:leading-[1.65]
                "
              >
                {content.doctors_subtitle ||
                  "Expert Dermatology Guided by Experience, Evidence and Individual Care."}
              </p>

              <p
                className="
                  mx-auto
                  mb-12
                  max-w-[900px]
                  font-body
                  text-sm
                  leading-[1.75]
                  text-text
                  max-[640px]:mb-8
                  max-[640px]:max-w-[355px]
                  max-[640px]:px-2
                  max-[640px]:text-[13px]
                  max-[640px]:leading-[1.7]
                "
              >
                {content.doctors_description ||
                  "A shared commitment to thoughtful assessment, clear communication and individualized dermatology care."}
              </p>
            </Reveal>

            <div
              className="
                mx-auto
                grid
                w-full
                max-w-[1450px]
                grid-cols-2
                items-stretch
                gap-[55px]
                text-left
                max-[1280px]:gap-10
                max-[1200px]:grid-cols-1
                max-[1200px]:max-w-[760px]
                max-[640px]:max-w-[430px]
                max-[640px]:gap-7
              "
            >
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.name} {...doctor} />
              ))}
            </div>
          </div>
        </section>

        {/* ───────── WHAT GUIDES US ───────── */}

        <section
          className="
          w-full
          bg-white
          pt-[120px]
          pb-[100px]
          max-[700px]:py-14
        "
        >
          <div
            className="
            container
            text-center
          "
          >
            <Reveal>
              <h2
                className="
                section-title
                text-navy
              "
              >
                {content.guides_heading || "What Guides Us"}
              </h2>

              <hr
                className="
                section-divider
                mx-auto
                mb-[33px]
              "
              />

              <p
                className="
                mx-auto
                mb-[50px]
                max-w-[798px]
                font-body
                text-sm
                leading-[25px]
                text-text
              "
              >
                {content.guides_text ||
                  "Clear principles. Thoughtful care. Explore answers to frequently asked questions about skin concerns and treatments. Get clear guidance on procedures, benefits, care, and expected results."}
              </p>
            </Reveal>

            <div
              className="
              grid
              grid-cols-3
              gap-[21px]
              max-[900px]:grid-cols-1
              max-[900px]:gap-8
            "
            >
              {guides.map((guide) => (
                <GuideCard key={guide.label} {...guide} />
              ))}
            </div>
          </div>
        </section>

        {/* ───────── WHY CHOOSE KRISHNORMI ───────── */}

        <WhyChoose />
      </main>

      <Footer />
    </>
  );
}
