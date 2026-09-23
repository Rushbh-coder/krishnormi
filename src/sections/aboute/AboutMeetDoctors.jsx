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
    kr-doctor-photo
    absolute
    bottom-0
    left-[25%]
    z-[1]

    h-[98%]
    w-auto
    max-w-[48%]

    object-contain
    object-bottom

    drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)]

    md:left-[3%]
    md:h-[100%]
    md:w-[50%]

    lg:left-[-6%]
    lg:h-[103%]

    xl:left-[-7%]
    xl:h-[105%]

    2xl:left-[-5%]
    2xl:h-[108%]
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

          <a
            href="/our-doctor"
            className="
    btn-hero
    mt-5

    flex
    items-center
    justify-center

    mx-auto

    w-[150px]
    whitespace-nowrap

    max-[460px]:w-[150px]
    max-[460px]:text-sm
  "
          >
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
          w-130
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
            md:pl-75
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

export default function AboutMeetDoctors({ content, stats }) {
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
      if (progress < 1) frameId = requestAnimationFrame(animateStats);
      else {
        setStatsProgress(1);
        statsCountCompleted.current = true;
      }
    };
    frameId = requestAnimationFrame(animateStats);
    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion, statsVisible]);

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
                gap-[2px]
                text-left
                max-[1280px]:gap-10
                max-[1200px]:grid-cols-1
                max-[1200px]:max-w-[760px]
                max-[640px]:max-w-[430px]
                max-[640px]:gap-7
              "
        >
          {doctors.map((doctor, index) => (
            <div
              key={doctor.name}
              className={`
      min-w-0
      ${index === 0 ? "translate-x-[110px]" : ""}
      max-[1200px]:translate-x-0
    `}
            >
              <DoctorCard {...doctor} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
