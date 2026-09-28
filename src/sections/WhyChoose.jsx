import photo1 from "../assets/why-choose/photo-1.png";
import photo2 from "../assets/why-choose/photo-2.png";
import photo3 from "../assets/why-choose/photo-3.png";
import photo4 from "../assets/why-choose/photo-4.png";

import ornament1 from "../assets/why-choose/ornament-1.svg";
import ornament2 from "../assets/why-choose/ornament-2.svg";
import ornament3 from "../assets/why-choose/ornament-3.svg";
import ornament4 from "../assets/why-choose/ornament-4.svg";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import { useReducedMotion, useRevealOnce } from "../hooks/useScrollReveal";

/* =========================================================
   FALLBACK LOCAL ASSETS

   IMPORTANT:
   Position/order remains exactly the same as your DB cards.
========================================================= */

const TEMPLATE = [
  {
    ornament: ornament3,
    alt: "",
  },
  {
    photo: photo1,
    alt: "Dermatologist examining a patient's skin",
  },
  {
    ornament: ornament4,
    alt: "",
  },
  {
    photo: photo2,
    alt: "Laser skin treatment procedure",
  },
  {
    photo: photo3,
    alt: "Patient with healthy, glowing skin",
  },
  {
    ornament: ornament1,
    alt: "",
  },
  {
    photo: photo4,
    alt: "Cosmetic injection procedure",
  },
  {
    ornament: ornament2,
    alt: "",
  },
];

/* =========================================================
   CARD
========================================================= */

function Card({ card, template, visible, delay, reducedMotion }) {
  /* -------------------------------------------------------
     STAGGER

     Only animation timing.
     Does NOT affect layout.
  ------------------------------------------------------- */

  const staggerStyle = {
    transitionDelay: visible && !reducedMotion ? `${delay}ms` : "0ms",
  };

  const staggerClass = reducedMotion
    ? "opacity-100"
    : `
        transition-[opacity,transform]
        duration-700
        ease-out

        ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `;

  /* =======================================================
     IMAGE CARD
  ======================================================= */

  if (card.type === "image") {
    return (
      <div
        style={staggerStyle}
        className={`
          group

          overflow-hidden
          rounded-[10px]

          max-[640px]:h-[240px]

          ${staggerClass}

          motion-reduce:transform-none
          motion-reduce:transition-none
        `}
      >
        <img
          className="
            h-full
            w-full

            object-cover

            transition-transform
            duration-[900ms]
            ease-out

            group-hover:scale-[1.045]

            motion-reduce:transform-none
            motion-reduce:transition-none
          "
          src={card.image_url || template.photo}
          alt={template.alt}
        />
      </div>
    );
  }

  /* =======================================================
     TEXT CARD
  ======================================================= */

  return (
    <div
      style={staggerStyle}
      className={`
        group

        relative

        flex
        flex-col

        overflow-hidden

        rounded-[10px]

        p-[27px_29px]

        shadow-[0px_2px_80px_0px_rgba(0,0,0,0.1)]

        ${staggerClass}

        ${card.dark ? "bg-navy" : "bg-white"}

        motion-reduce:transform-none
        motion-reduce:transition-none
      `}
    >
      {/* =================================================
          SUBTLE HOVER OVERLAY

          Absolutely positioned.
          Therefore no UI/layout change.
      ================================================= */}

      <span
        aria-hidden="true"
        className={`
          pointer-events-none

          absolute
          inset-0

          opacity-0

          transition-opacity
          duration-500

          group-hover:opacity-100

          ${card.dark ? "bg-white/[0.025]" : "bg-navy/[0.018]"}
        `}
      />

      {/* =================================================
          CARD HEADING
      ================================================= */}

      <div className="relative z-[2] mb-6 flex items-center gap-3">
        {/* Vertical Line */}

        <span
          className={`
            h-6
            w-[3px]

            flex-none

            origin-center

            transition-transform
            duration-500
            ease-out

            group-hover:scale-y-[1.2]

            ${card.dark ? "bg-white" : "bg-navy"}

            motion-reduce:transform-none
            motion-reduce:transition-none
          `}
        />

        {/* Heading */}

        <h3
          className={`
            m-0

            font-heading

            text-xl
            leading-[1.4]
            font-semibold

            transition-transform
            duration-500
            ease-out

            group-hover:translate-x-[3px]

            ${card.dark ? "text-white" : "text-navy"}

            motion-reduce:transform-none
            motion-reduce:transition-none
          `}
        >
          {card.title}
        </h3>
      </div>

      {/* =================================================
          CARD TEXT

          whitespace-pre-wrap allows Admin Enter / blank lines.
      ================================================= */}

      <p
        className={`
          relative
          z-[2]

          m-0

          whitespace-pre-wrap

          font-heading

          text-[15px]
          leading-[1.85]

          transition-transform
          duration-500
          ease-out

          group-hover:translate-y-[-2px]

          ${card.dark ? "text-white" : "text-text"}

          motion-reduce:transform-none
          motion-reduce:transition-none
        `}
      >
        {card.text}
      </p>

      {/* =================================================
          DECORATIVE ORNAMENT
      ================================================= */}

      {template.ornament && (
        <img
          className="
            pointer-events-none

            absolute
            right-4
            bottom-3

            h-auto
            w-16

            opacity-50

            transition-[transform,opacity]
            duration-700
            ease-out

            group-hover:translate-x-[-3px]
            group-hover:translate-y-[-3px]
            group-hover:scale-[1.05]
            group-hover:opacity-60

            motion-reduce:transform-none
            motion-reduce:transition-none
          "
          src={template.ornament}
          alt=""
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WhyChoose() {
  const { row, loading } = useSection("why-choose");

  const content = row?.content ?? DEFAULT_CONTENT["why-choose"];

  const visible = row?.visible ?? true;

  const cards = content.cards ?? DEFAULT_CONTENT["why-choose"].cards;

  const reducedMotion = useReducedMotion();

  /* =======================================================
     GRID REVEAL
  ======================================================= */

  const [gridRef, gridVisible] = useRevealOnce(reducedMotion);

  /* =======================================================
     HEADING REVEAL
  ======================================================= */

  const [headingRef, headingVisible] = useRevealOnce(reducedMotion);

  /* =======================================================
     HIDE SECTION
  ======================================================= */

  if (!loading && !visible) {
    return null;
  }

  return (
    <section className="bg-tint py-[90px]">
      <div className="container">
        {/* =================================================
            SECTION HEADING

            Same margin/layout.
            Only reveal animation added.
        ================================================= */}

        <div
          ref={headingRef}
          className={`
            mb-14
            text-center

            transition-[opacity,transform]
            duration-700
            ease-out

            ${
              reducedMotion || headingVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }

            motion-reduce:transform-none
            motion-reduce:transition-none
          `}
        >
          <h2 className="section-title">{content.title}</h2>

          <hr
            className={`
              section-divider
              mx-auto

              origin-center

              transition-transform
              duration-700
              ease-out

              ${reducedMotion || headingVisible ? "scale-x-100" : "scale-x-0"}

              motion-reduce:transform-none
              motion-reduce:transition-none
            `}
          />
        </div>

        {/* =================================================
            CARDS GRID

            ORIGINAL UI CLASSES UNCHANGED:
            - 4 columns desktop
            - 2 columns tablet
            - 1 column mobile
            - original row height
            - original gap
        ================================================= */}

        <div
          ref={gridRef}
          className="
            grid
            grid-cols-4
            auto-rows-[minmax(278px,auto)]
            gap-6

            max-[1100px]:grid-cols-2

            max-[640px]:grid-cols-1
          "
        >
          {cards.map((card, i) => (
            <Card
              key={i}
              card={card}
              template={TEMPLATE[i] ?? {}}
              visible={gridVisible}
              delay={i * 80}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
