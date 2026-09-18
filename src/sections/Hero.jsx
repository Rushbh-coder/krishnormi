import heroBackground from "../assets/hero/hero-background.png";
import drDeepaKhevana from "../assets/hero/dr-deepa&khevna.png";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

const HEADING_LEAD = "Healthy Skin";

function HeadingWithLead({ text }) {
  if (!text.startsWith(HEADING_LEAD)) return text;

  return (
    <>
      <span className="text-primary">{HEADING_LEAD}</span>
      {text.slice(HEADING_LEAD.length)}
    </>
  );
}

export default function Hero() {
  const { row, loading } = useSection("hero");

  const content = row?.content ?? DEFAULT_CONTENT.hero;

  const visible = row?.visible ?? true;

  if (!loading && !visible) return null;

  return (
    <section
      className="
        relative
        min-h-[680px]
        overflow-hidden
        bg-white

        max-[1100px]:min-h-[620px]

        max-[960px]:flex
        max-[960px]:min-h-0
        max-[960px]:flex-col
      "
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0

          max-[960px]:relative
          max-[960px]:order-1
          max-[960px]:h-[500px]

          max-[560px]:h-[440px]
        "
        aria-hidden="true"
      >
        <img
          src={content.image_url || heroBackground}
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
          "
        />

        {/* soft left fade */}
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.95)_25%,rgba(255,255,255,0.4)_48%,rgba(255,255,255,0)_68%)]

            max-[960px]:hidden
          "
        />
      </div>

      {/* =====================================================
          DOCTORS - FIXED INSIDE MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          container
          pointer-events-none
          absolute
          inset-x-0
          top-0
          z-[2]
          h-full

          max-[960px]:relative
          max-[960px]:order-1
          max-[960px]:inset-auto
          max-[960px]:h-[500px]
          max-[960px]:-mt-[500px]

          max-[560px]:h-[440px]
          max-[560px]:-mt-[440px]
        "
      >
        <div className="relative h-full w-full">
          {/* Doctors Image */}
          <img
            src={drDeepaKhevana}
            width={890}
            height={783}
            alt="Dr. Deepa Bhatt and Dr. Khevana Bhatt"
            style={{ animationDelay: "0.15s" }}
            className="
      animate-fade-up-in
      absolute
      right-[-8%]
      bottom-0
      h-[96%]
      w-auto
      max-w-[58%]
      object-contain
      object-bottom

      max-[1200px]:h-[88%]
      max-[1200px]:max-w-[55%]
      max-[1050px]:h-[82%]

      max-[960px]:right-1/3
      max-[960px]:h-[94%]
      max-[960px]:max-w-[90%]
      max-[960px]:translate-x-1/3

      max-[560px]:h-[88%]
      max-[560px]:max-w-[96%]
    "
          />

          {/* Doctor Nameplates */}
          {/* Doctor Nameplates */}
          <div
            className="
    absolute
    right-[5%]
    bottom-[6%]
    z-[4]

    grid
    w-[min(100%,420px)]
    grid-cols-2
    gap-10

    max-[960px]:right-1/2
    max-[960px]:bottom-[5%]
    max-[960px]:w-[min(85%,420px)]
    max-[960px]:translate-x-1/2

    max-[560px]:w-[94%]
    max-[560px]:gap-2
  "
          >
            {["Dr. Deepa Bhatt", "Dr. Khevana Bhatt"].map((name, i) => (
              <div
                key={name}
                style={{ animationDelay: `${i * 0.6}s` }}
                className="
        animate-nameplate-float
        flex
        min-w-0
        items-center
        gap-2.5

        rounded-[12px]
        border
        border-accent/30
        bg-[#fce4eb]/90

        px-3
        py-2.5

        shadow-[0_8px_24px_rgba(224,40,89,0.16)]
        backdrop-blur-[10px]

        max-[560px]:rounded-[10px]
        max-[560px]:px-2
        max-[560px]:py-2
      "
              >
                <span
                  className="h-9 w-[3px] flex-none rounded-full bg-accent max-[560px]:h-8"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <span className="block font-body text-[8px] font-semibold uppercase tracking-[0.08em] text-primary max-[560px]:text-[7px]">
                    Dermatologist
                  </span>

                  <span className="mt-0.5 block font-heading text-[14px] leading-[1.3] font-semibold text-text-dark max-[560px]:text-[11px]">
                    {name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          LEFT CONTENT
      ====================================================== */}

      <div
        className="
          container
          relative
          z-[3]
          flex
          min-h-[680px]
          items-center

          max-[1100px]:min-h-[620px]

          max-[960px]:order-2
          max-[960px]:min-h-0
          max-[960px]:py-14
        "
      >
        <div
          className="
            animate-fade-up-in
            w-full
            max-w-[600px]

            max-[1200px]:max-w-[520px]

            max-[960px]:max-w-full
          "
        >
          {/* Heading */}

          <h1
            className="
              m-0
              font-heading
              text-[clamp(38px,3.2vw,58px)]
              leading-[1.18]
              font-bold
              text-text-dark

              max-[560px]:text-[34px]
            "
          >
            <HeadingWithLead text={content.heading} />
          </h1>

          {/* Divider */}

          <hr
            className="
              mt-5
              h-[3px]
              w-[205px]
              border-none
              bg-accent

              max-[560px]:w-[140px]
            "
          />

          {/* Supporting text */}

          <p className="mt-[22px] max-w-[520px] text-justify font-heading text-[clamp(18px,1.35vw,24px)] leading-[1.55] font-semibold text-text-dark">
            {content.supporting_text}
          </p>

          {/* Body 1 */}

          <p className="mt-5 max-w-[550px] text-justify font-heading text-[17px] leading-[1.7] text-text max-[560px]:text-base">
            {content.body_text_1}
          </p>

          {/* Body 2 */}

          <p className="mt-4 max-w-[550px] text-justify font-heading text-[17px] leading-[1.7] text-text max-[560px]:text-base">
            {content.body_text_2}
          </p>

          {/* Button */}

          <a
            href={content.button_link || "#contact"}
            className="
    btn-hero
    mt-5

    inline-flex
    items-center
    justify-center

    whitespace-nowrap

    px-6
    py-3

    max-[630px]:w-auto
    max-[630px]:px-5
    max-[630px]:text-sm
  "
          >
            {content.button_label}
          </a>
        </div>
      </div>
    </section>
  );
}
