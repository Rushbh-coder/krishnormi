import { useState } from "react";

import photoTop from "../assets/about/photo-2.png";
import photoBottom from "../assets/about/photo-4.png";
import ringDecor from "../assets/about/ellipse-decor.svg";
import dottedFace from "../assets/about/dotted-face-decor.svg";
import playRing from "../assets/about/ellipse-play-ring.svg";
import playTriangle from "../assets/about/play-triangle.svg";
import eyebrowIcon from "../assets/about/eyebrow-icon.svg";
import signatureBar from "../assets/about/signature-bar.svg";
import stethoscopeDecor from "../assets/about/stethoscope-decor.png";

import iconClinical from "../assets/about/icon-clinical-dermatology.svg";
import iconHairScalp from "../assets/about/icon-hair-scalp.svg";
import iconLaser from "../assets/about/icon-laser-dermatology.svg";
import iconAesthetic from "../assets/about/icon-aesthetic-dermatology.svg";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

import {
  useReducedMotion,
  useRevealOnce,
  revealClass,
} from "../hooks/useScrollReveal";

/* =========================================================
   FOCUS CARD ICONS
========================================================= */

const FOCUS_TEMPLATE = [
  {
    icon: iconClinical,
    width: 42,
    height: 46,
  },
  {
    icon: iconHairScalp,
    width: 42,
    height: 46,
    opacity: 0.7,
  },
  {
    icon: iconLaser,
    width: 46,
    height: 46,
  },
  {
    icon: iconAesthetic,
    width: 36,
    height: 46,
  },
];

/* =========================================================
   HIGHLIGHT KRISHNORMI
========================================================= */

function HighlightBrand({ text = "" }) {
  const index = text.indexOf("KRISHNORMI");

  if (index === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, index)}

      <span className="text-primary">KRISHNORMI</span>

      {text.slice(index + "KRISHNORMI".length)}
    </>
  );
}

/* =========================================================
   ABOUT US
========================================================= */

export default function AboutUs() {
  const { row, loading } = useSection("about");

  const content = row?.content ?? DEFAULT_CONTENT.about;

  const visible = row?.visible ?? true;

  const focusItems = content.focus_items ?? DEFAULT_CONTENT.about.focus_items;

  const [activeFocus, setActiveFocus] = useState(0);

  /* Animation */

  const reducedMotion = useReducedMotion();

  const [imageRef, imageVisible] = useRevealOnce(reducedMotion);

  const [textRef, textVisible] = useRevealOnce(reducedMotion);

  const [cardsRef, cardsVisible] = useRevealOnce(reducedMotion);

  if (!loading && !visible) {
    return null;
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-white
        pt-[75px]
        pb-[80px]

        max-[960px]:pt-[65px]
        max-[560px]:pt-[50px]
        max-[560px]:pb-[55px]
      "
    >
      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          container
          relative
          z-[1]
          flex
          items-start
          gap-[55px]

          max-[1100px]:gap-[35px]
          max-[960px]:flex-col
        "
      >
        {/* =================================================
            LEFT IMAGE COMPOSITION
        ================================================== */}

        <div
          ref={imageRef}
          className={`
            relative

            aspect-[620/650]

            w-full
            max-w-[520px]

            flex-none

            max-[1100px]:max-w-[460px]

            max-[960px]:mx-auto
            max-[960px]:max-w-[520px]

            ${revealClass(imageVisible)}
          `}
        >
          {/* Green decorative ring */}

          <span
            className="
              pointer-events-none
              absolute
              top-[7%]
              left-[0%]
              z-[1]

              aspect-square
              w-[28%]

              bg-contain
              bg-center
              bg-no-repeat
            "
            style={{
              backgroundImage: `url(${ringDecor})`,
            }}
            aria-hidden="true"
          />

          {/* TOP IMAGE */}

          <img
            src={content.photo_top_url || photoTop}
            width={467}
            height={583}
            alt="Dermatology treatment being performed at Krishnormi clinic"
            className="
              absolute

              top-[0%]
              left-[10%]

              z-[2]

              h-[64%]
              w-[57%]

              object-cover

              shadow-[0_12px_30px_rgba(0,34,97,0.10)]
            "
          />

          {/* =================================================
              HOW WE WORK
          ================================================== */}

          <span
            className="
              absolute

              top-[15%]
              left-[64%]

              z-[5]

              whitespace-nowrap

              origin-center
              -rotate-90

              font-heading
              text-[15px]
              font-semibold

              text-navy

              max-[560px]:text-[12px]
            "
          >
            How We Work
          </span>

          {/* =================================================
              PLAY BUTTON
          ================================================== */}

          <div
            className="
              absolute

              top-[34%]
              left-[65%]

              z-[6]

              aspect-square
              w-[12%]
            "
          >
            <img
              src={playRing}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
              "
            />

            <img
              src={playTriangle}
              alt=""
              aria-hidden="true"
              className="
                absolute

                top-[34%]
                left-[34%]

                h-[32%]
                w-[32%]
              "
            />
          </div>

          {/* =================================================
              BOTTOM IMAGE
          ================================================== */}

          <img
            src={content.photo_bottom_url || photoBottom}
            width={480}
            height={398}
            alt="Patient consultation at Krishnormi clinic"
            className="
              absolute

              top-[51%]
              left-[33%]

              z-[3]

              h-[45%]
              w-[61%]

              object-cover

              shadow-[0_12px_30px_rgba(0,34,97,0.10)]
            "
          />

          {/* =================================================
              EXPERIENCE BADGE
          ================================================== */}

          <div
            className="
              absolute

              top-[48%]
              left-[18%]

              z-[7]

              flex
              aspect-square
              w-[28%]

              flex-col
              items-center
              justify-center

              rounded-full

              border-[7px]
              border-white

              bg-navy

              text-center
              text-white

              shadow-[0_10px_24px_rgba(0,34,97,0.20)]
            "
          >
            <span
              className="
                font-heading

                text-[clamp(23px,3vw,34px)]

                leading-[1]
                font-bold
              "
            >
              {content.badge_number}
            </span>

            <span
              className="
                mt-1

                font-heading

                text-[clamp(11px,1.5vw,15px)]

                leading-[1.2]
                font-medium
              "
            >
              {content.badge_label}
            </span>
          </div>

          {/* =================================================
              DOTTED FACE DECORATION
          ================================================== */}

          <img
            src={dottedFace}
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none

              absolute

              bottom-[4%]
              left-[7%]

              z-[1]

              w-[20%]

              opacity-90
            "
          />
        </div>

        {/* =================================================
            RIGHT CONTENT
        ================================================== */}

        <div
          ref={textRef}
          className={`
            relative

            min-w-0
            flex-1

            pt-[8px]
            pr-[80px]

            max-[1200px]:pr-[40px]
            max-[960px]:w-full
            max-[960px]:pr-0

            ${revealClass(textVisible)}
          `}
        >
          {/* Eyebrow */}

          <p
            className="
              section-eyebrow

              mb-[12px]

              flex
              items-center
              gap-2
            "
          >
            <img
              src={eyebrowIcon}
              width={18}
              height={18}
              alt=""
              aria-hidden="true"
            />

            {content.eyebrow_text}
          </p>

          {/* Heading */}

          <h2
            className="
              section-title

              text-[clamp(26px,2.3vw,36px)]
              leading-[1.2]
            "
          >
            <HighlightBrand text={content.heading} />
          </h2>

          {/* Pink divider */}

          <hr
            className="
              section-divider

              mt-[12px]
              mb-[18px]

              w-[125px]
            "
          />

          {/* Lead */}

          <p
            className="
              font-heading

              text-[15px]
              leading-[1.5]
              font-semibold

              text-text-dark
            "
          >
            {content.lead_text}
          </p>

          {/* Body 1 */}

          <p
            className="
              mt-[17px]

              max-w-[600px]

              font-body

              text-[14px]
              leading-[1.65]

              text-text
            "
          >
            {content.body_text_1}
          </p>

          {/* Body 2 */}

          <p
            className="
              mt-[14px]

              max-w-[600px]

              font-body

              text-[14px]
              leading-[1.65]

              text-text
            "
          >
            {content.body_text_2}
          </p>

          {/* Body 3 */}

          <p
            className="
              mt-[14px]

              max-w-[600px]

              font-body

              text-[14px]
              leading-[1.65]

              text-text
            "
          >
            {content.body_text_3}
          </p>

          {/* =================================================
              SIGNATURE / DOCTOR INFORMATION
          ================================================== */}

          <div
            className="
              mt-[20px]

              flex
              max-w-[590px]
              gap-[12px]
            "
          >
            <img
              src={signatureBar}
              alt=""
              aria-hidden="true"
              className="
                h-auto
                w-[7px]
                flex-none
                object-fill
              "
            />

            <div>
              <p
                className="
                  mb-[4px]

                  font-heading

                  text-[13px]
                  font-semibold

                  text-[#293253]
                "
              >
                {content.signature_role}
              </p>

              <p
                className="
                  mb-[4px]

                  font-heading

                  text-[12px]
                  leading-[1.45]

                  text-[#636363]
                  italic
                "
              >
                {content.signature_note}
              </p>

              <p
                className="
                  font-heading

                  text-[12px]
                  font-bold

                  text-[#636363]
                "
              >
                {content.signature_name}
              </p>
            </div>
          </div>

          {/* =================================================
              CTA
          ================================================== */}

          <a
            href={content.cta_link || "#contact"}
            className="
              btn-hero

              mt-[20px]

              inline-flex
              min-h-[38px]

              items-center
              justify-center

              px-[25px]
              py-[9px]

              text-[12px]
            "
          >
            {content.cta_label}
          </a>

          {/* =================================================
              STETHOSCOPE
          ================================================== */}

          <img
            src={stethoscopeDecor}
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none

              absolute

              right-[-80px]
              bottom-[-20px]

              z-[0]

              hidden
              w-[150px]

              object-contain

              min-[1150px]:block
            "
          />
        </div>
      </div>

      {/* =====================================================
          FOCUS CARDS
      ====================================================== */}

      <div className="container">
        <div
          ref={cardsRef}
          className={`mt-12 grid grid-cols-4 gap-5 max-[960px]:grid-cols-2 max-[560px]:grid-cols-1 ${revealClass(cardsVisible)}`}
        >
          {FOCUS_TEMPLATE.map((template, i) => {
            const item = focusItems[i] ?? {};
            const isActive = activeFocus === i;
            return (
              <button
                type="button"
                key={i}
                onClick={() => setActiveFocus(i)}
                className={`
    group
    rounded-[10px]
    border-x
    border-y-[3px]
    border-x-[#e9e9e9]
    px-7
    py-8
    text-left
    transition-all
    duration-300
    ease-out
    hover:-translate-y-1
    hover:border-y-accent
    hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)]
    ${isActive ? "border-y-accent" : "border-y-[#e9e9e9]"}
  `}
              >
                <img
                  className="mx-auto mb-[26px] block object-contain"
                  src={template.icon}
                  width={template.width}
                  height={template.height}
                  style={
                    template.opacity ? { opacity: template.opacity } : undefined
                  }
                  alt=""
                  aria-hidden="true"
                />
                <h3
                  className={`
    mb-3.5
    line-clamp-1
    font-heading
    text-xl
    font-semibold
    transition-colors
    duration-300
    ${isActive ? "text-accent" : "text-navy group-hover:text-accent"}
  `}
                >
                  {item.title}
                </h3>
                <p className="line-clamp-4 font-body text-[15px] leading-[1.6] text-text">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
