import { FaEye, FaBullseye, FaFlagCheckered } from "react-icons/fa";

import visionPhoto from "../../assets/about-page/vision-photo.jpg";
import missionPhoto from "../../assets/about-page/mission-photo.jpg";
import goalsPhoto from "../../assets/about-page/goals-photo.jpg";

import Reveal from "./Reveal";

/* =========================================================
   GUIDE CARD
========================================================= */

function GuideCard({ label, icon: Icon, photo, text }) {
  return (
    <Reveal delay={220} className="kr-guide-card relative">
      <div
        className="
          relative
          aspect-[466/529]
          w-full
          overflow-hidden

          max-[900px]:aspect-auto
          max-[900px]:min-h-[460px]

          max-[480px]:min-h-[440px]
        "
      >
        {/* BACKGROUND IMAGE */}

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

        {/* GRADIENT */}

        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_31.32%,rgba(0,0,0,0.8)_90.11%)]

            max-[900px]:bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_20%,rgba(0,0,0,0.35)_48%,rgba(0,0,0,0.92)_100%)]
          "
        />

        {/* ICON */}

        <span
          className="
            kr-guide-icon
            absolute
            top-[4.9%]
            left-[6.7%]
            flex
            h-[10.3%]
            w-[11.7%]
            items-center
            justify-center
            text-accent

            max-[900px]:top-6
            max-[900px]:left-6
            max-[900px]:h-[52px]
            max-[900px]:w-[52px]
          "
        >
          <Icon className="h-full w-full" aria-hidden="true" />
        </span>

        {/* TEXT CONTENT */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            flex
            h-[39%]
            flex-col
            px-[7.3%]
            pb-[4.8%]
            text-left

            max-[900px]:relative
            max-[900px]:mt-auto
            max-[900px]:h-auto
            max-[900px]:min-h-[460px]
            max-[900px]:justify-end
            max-[900px]:px-7
            max-[900px]:pt-[180px]
            max-[900px]:pb-8

            max-[480px]:min-h-[440px]
            max-[480px]:px-6
            max-[480px]:pt-[160px]
            max-[480px]:pb-7
          "
        >
          {/* CARD TITLE */}

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

              max-[900px]:mb-3
              max-[900px]:text-[26px]
              max-[900px]:leading-[34px]

              max-[480px]:text-[24px]
              max-[480px]:leading-[32px]
            "
          >
            {label}
          </p>

          {/* CARD DESCRIPTION */}

          <p
            className="
              m-0
              whitespace-pre-wrap
              font-heading
              text-lg
              leading-[28px]
              text-white

              max-[1200px]:text-base
              max-[1200px]:leading-[26px]

              max-[900px]:text-[17px]
              max-[900px]:leading-[28px]

              max-[480px]:text-[16px]
              max-[480px]:leading-[26px]
            "
          >
            {text}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* =========================================================
   WHAT GUIDES US SECTION
========================================================= */

export default function AboutWhatGuidesUs({ content = {} }) {
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
    <section
      className="
        w-full
        bg-white
        pt-[80px]
        pb-[30px]

        max-[700px]:py-14
      "
    >
      <div className="container text-center">
        {/* SECTION HEADING */}

        <Reveal>
          <h2 className="section-title text-navy">
            {content.guides_heading || "What Guides Us"}
          </h2>

          <hr className="section-divider mx-auto mb-[33px]" />

          {/* SECTION DESCRIPTION */}

          <p
            className="
              mx-auto
              mb-[50px]
              max-w-[798px]
              whitespace-pre-wrap
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

        {/* GUIDE CARDS */}

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
  );
}
