import { useEffect, useRef, useState } from "react";

import doctorsBg from "../../assets/about-page/doctors-bg.jpg";
import cardTexture from "../../assets/about-page/card-texture.jpg";
import doctorDeepa from "../../assets/about-page/doctor-deepa.png";
import doctorKhevana from "../../assets/about-page/doctor-khevana.png";

import iconYear from "../../assets/testimonials/icon-years.svg";
import iconSkin from "../../assets/testimonials/skin1.png";
import iconPatients1 from "../../assets/testimonials/icon-patients-1.svg";
import iconPatients2 from "../../assets/testimonials/icon-patients-2.svg";
import iconSatisfaction from "../../assets/testimonials/icon-satisfaction.svg";

import { useReducedMotion, useRevealOnce } from "../../hooks/useScrollReveal";

import Reveal from "./Reveal";

/* =========================================================
   STAT VALUE
========================================================= */

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

/* =========================================================
   STAT ICONS
========================================================= */

const iconFilter =
  "[filter:brightness(0)_saturate(100%)_invert(83%)_sepia(17%)_saturate(704%)_hue-rotate(34deg)_brightness(96%)_contrast(87%)]";

const STAT_ICONS = [
  <img
    key="years"
    src={iconYear}
    alt=""
    aria-hidden="true"
    className={`h-[44px] w-[44px] object-contain ${iconFilter}`}
  />,

  <span key="patients" className="relative block h-[48px] w-[48px] flex-none">
    <img
      src={iconPatients1}
      alt=""
      aria-hidden="true"
      className={`
        absolute
        inset-[24.76%_0_8.74%_0]
        h-auto
        w-full
        object-contain
        ${iconFilter}
      `}
    />

    <img
      src={iconPatients2}
      alt=""
      aria-hidden="true"
      className={`
        absolute
        inset-[8.74%_29.47%_76.26%_55.54%]
        h-auto
        w-auto
        object-contain
        ${iconFilter}
      `}
    />
  </span>,

  <img
    key="skin"
    src={iconSkin}
    alt=""
    aria-hidden="true"
    className={`h-[44px] w-[44px] object-contain ${iconFilter}`}
  />,

  <img
    key="satisfaction"
    src={iconSatisfaction}
    alt=""
    aria-hidden="true"
    className={`h-[44px] w-[44px] object-contain ${iconFilter}`}
  />,
];

/* =========================================================
   REUSABLE CARD CONTENT
========================================================= */

function DoctorCard({ photo, name, badge, role, bio, cardTextureUrl }) {
  return (
    <Reveal
      delay={120}
      className="kr-doctor-card relative h-full w-full min-w-0"
    >
      <article className="relative h-full w-full min-w-0">
        {/* DESKTOP / LAPTOP: preserve original angled reference shape */}
        <div className="relative hidden w-full sm:block aspect-[665/460]">
          <div className="absolute inset-0 [filter:drop-shadow(0_18px_32px_rgba(0,0,0,0.24))] mr-5">
            <div className="absolute inset-0 overflow-hidden [clip-path:polygon(17.75%_0,100%_0,100%_100%,0_100%)]">
              <img
                src={cardTextureUrl || cardTexture}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-[75%_center]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(36,71,17,0.72)_0%,#15350e_14%,#15350e_100%)]" />
            </div>
          </div>

          <img
            src={photo}
            alt={name}
            className="kr-doctor-photo pointer-events-none absolute bottom-0 left-[-8%] z-[2] h-[94%] w-[47%] max-w-none object-contain object-bottom drop-shadow-[0_22px_30px_rgba(0,0,0,0.28)] lg:left-[-9%] lg:h-[96%] xl:left-[-10%] xl:h-[97%] 2xl:left-[-9%]"
          />

          <div className="absolute inset-y-0 right-0 z-[3] flex w-[61%] flex-col justify-center pr-[6%] pl-[5%] py-[6%]">
            <span className="mb-3 inline-flex min-h-[30px] w-fit items-center justify-center rounded-full bg-[#5d8648] px-4 py-[7px] font-heading text-[11px] leading-none font-semibold whitespace-nowrap text-white lg:min-h-[32px] lg:px-5 lg:text-[12px] xl:text-[13px]">
              {badge}
            </span>

            <h3 className="m-0 font-heading text-[18px] leading-[1.2] font-semibold text-white lg:text-[20px] xl:text-[22px]">
              {name}
            </h3>

            <p className="mt-1.5 mb-0 min-h-[38px] max-w-[360px] font-heading text-[11px] leading-[1.45] text-white/90 lg:text-[12px] xl:text-[13px]">
              {role}
            </p>

            <div className="mt-3 min-h-[86px] w-full lg:min-h-[96px] xl:min-h-[105px]">
              {bio && (
                <p className="m-0 max-w-[390px] font-body text-[10px] leading-[1.55] text-white/85 lg:text-[11px] lg:leading-[1.6] xl:text-[12px] xl:leading-[1.65]">
                  {bio}
                </p>
              )}
            </div>

            <div className="mt-3 flex w-full justify-start">
              <a
                href="/our-doctor"
                className="btn-hero kr-btn inline-flex h-[42px] w-[138px] flex-none items-center justify-center rounded-full text-[12px] font-semibold whitespace-nowrap lg:h-[44px] lg:w-[145px] lg:text-[13px] xl:h-[46px] xl:w-[150px] xl:text-[14px]"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>

        {/* MOBILE: shape changes only here */}
        <div className="relative w-full overflow-hidden rounded-[24px] bg-[#15350e] shadow-[0_16px_38px_rgba(0,0,0,0.22)] sm:hidden">
          <img
            src={cardTextureUrl || cardTexture}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(36,71,17,0.58)_0%,#15350e_46%,#15350e_100%)]" />

          <div className="relative z-[2] flex h-[255px] w-full items-end justify-center max-[430px]:h-[245px] max-[375px]:h-[225px]">
            <img
              src={photo}
              alt={name}
              className="block h-[98%] w-auto max-w-[86%] object-contain object-bottom drop-shadow-[0_18px_26px_rgba(0,0,0,0.28)]"
            />
          </div>

          <div className="relative z-[3] flex flex-col items-center px-5 pt-5 pb-7 text-center max-[375px]:px-4">
            <span className="mb-3 inline-flex min-h-[32px] w-fit items-center justify-center rounded-full bg-[#5d8648] px-4 py-[7px] font-heading text-[12px] leading-none font-semibold whitespace-nowrap text-white">
              {badge}
            </span>

            <h3 className="m-0 font-heading text-[21px] leading-[1.2] font-semibold text-white max-[375px]:text-[19px]">
              {name}
            </h3>

            <p className="mt-1.5 mb-0 mx-auto max-w-[340px] font-heading text-[12px] leading-[1.5] text-white/90">
              {role}
            </p>

            {bio && (
              <p className="m-0 mt-4 mx-auto max-w-[355px] font-body text-[12px] leading-[1.65] text-white/85 max-[375px]:text-[11px]">
                {bio}
              </p>
            )}

            <a
              href="/our-doctor"
              className="btn-hero kr-btn mt-5 inline-flex h-[46px] w-[150px] flex-none items-center justify-center rounded-full text-[13px] font-semibold whitespace-nowrap"
            >
              View Profile
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AboutMeetDoctors({ content = {}, stats = [] }) {
  const reducedMotion = useReducedMotion();

  const [statsRef, statsVisible] = useRevealOnce(reducedMotion);

  const [statsProgress, setStatsProgress] = useState(0);

  const statsCountCompleted = useRef(false);

  /* =======================================================
     STATS ANIMATION
  ======================================================= */

  useEffect(() => {
    if (!statsVisible || statsCountCompleted.current) {
      return undefined;
    }

    if (reducedMotion) {
      setStatsProgress(1);

      statsCountCompleted.current = true;

      return undefined;
    }

    let frameId;

    let startTime = null;

    const duration = 1500;

    const animateStats = (time) => {
      if (startTime === null) {
        startTime = time;
      }

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

  /* =======================================================
     DOCTOR DATA
  ======================================================= */

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

  return (
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
      {/* =================================================
          BACKGROUND SHAPE

          Desktop = original curved shape
          Tablet/mobile = adjusted responsive shape
      ================================================= */}

      <style>{`
        .doctors-band {
          border-radius: 50% / 3vw;
        }

        @media (max-width: 1199px) {
          .doctors-band {
            border-radius: 50% / 34px;
          }
        }

        @media (max-width: 640px) {
          .doctors-band {
            border-radius: 50% / 24px;
          }
        }
      `}</style>

      {/* =================================================
          FULL BACKGROUND
      ================================================= */}

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

          max-[900px]:
          top-[150px]

          max-[640px]:
          top-[210px]
        "
        style={{
          backgroundImage: `url(${
            content.doctors_background_image_url || doctorsBg
          })`,
        }}
        aria-hidden="true"
      />

      {/* =================================================
          STATS
      ================================================= */}

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

          max-[900px]:
          pt-12

          max-[640px]:
          pt-7
          pb-10
        "
      >
        <div
          ref={statsRef}
          className={`
            relative

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

            sm:gap-3
            sm:px-5
            sm:py-6

            md:px-8
            md:py-8

            lg:grid-cols-4
            lg:gap-0

            transition-all
            duration-700
            ease-out

            motion-reduce:transition-none

            ${
              statsVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }
          `}
        >
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              opacity-50
            "
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(214,179,117,.20), transparent 32%), radial-gradient(circle at 90% 90%, rgba(117,167,139,.24), transparent 34%)",
            }}
            aria-hidden="true"
          />

          {stats.map((stat, i) => (
            <div
              key={`${stat.label}-${i}`}
              className={`
                relative

                flex
                min-w-0
                items-center

                gap-2

                px-1
                py-3

                sm:gap-4
                sm:px-3
                sm:py-4

                lg:px-7
                lg:py-3

                ${
                  i !== stats.length - 1
                    ? "lg:border-r lg:border-white/[0.12]"
                    : ""
                }
              `}
            >
              <div
                className="
                  flex

                  h-[46px]
                  w-[46px]

                  flex-none

                  items-center
                  justify-center

                  sm:h-[60px]
                  sm:w-[60px]
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

      {/* =================================================
          DOCTORS SECTION
      ================================================= */}

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
        {/* HEADING */}

        <Reveal>
          <h2
            className="
              section-title
              text-navy

              max-[640px]:
              text-[30px]
              leading-[1.2]

              max-[380px]:
              text-[27px]
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

              max-[640px]:
              max-w-[350px]
              px-2
              text-[14px]
              leading-[1.65]
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

              max-[640px]:
              mb-8
              max-w-[355px]
              px-2
              text-[13px]
              leading-[1.7]
            "
          >
            {content.doctors_description ||
              "A shared commitment to thoughtful assessment, clear communication and individualized dermatology care."}
          </p>
        </Reveal>

        {/* =================================================
            DOCTOR GRID

            Desktop >= 1200 = two columns
            Tablet <1200 = one column
            Mobile <640 = vertical cards
        ================================================= */}

        <div
          className="
            mx-auto

            grid

            w-full
            max-w-[1320px]

            grid-cols-2

            items-stretch

            gap-x-6
            gap-y-8

            text-left

            max-[1199px]:max-w-[1080px]
            max-[1199px]:gap-x-5

            max-[899px]:max-w-[700px]
            max-[899px]:grid-cols-1
            max-[899px]:gap-y-8

            max-[639px]:max-w-[430px]
            max-[639px]:gap-7
          "
        >
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="
                h-full
                w-full
                min-w-0
              "
            >
              <DoctorCard {...doctor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
