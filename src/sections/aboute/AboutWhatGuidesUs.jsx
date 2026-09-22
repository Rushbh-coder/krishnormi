import { FaEye, FaBullseye, FaFlagCheckered } from "react-icons/fa";
import visionPhoto from "../../assets/about-page/vision-photo.jpg";
import missionPhoto from "../../assets/about-page/mission-photo.jpg";
import goalsPhoto from "../../assets/about-page/goals-photo.jpg";
import Reveal from "./Reveal";

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
          pb-[4.8%]
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
            leading-[28px]
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

export default function AboutWhatGuidesUs({ content }) {
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
          pt-[120px]
          pb-[30px]
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
  );
}
