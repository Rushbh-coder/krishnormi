import { useState } from "react";

import photo from "../assets/faq/photo.png";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import { useReducedMotion, useRevealOnce, revealClass } from "../hooks/useScrollReveal";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(1);

  const { row, loading } = useSection("faq");
  const content = row?.content ?? DEFAULT_CONTENT.faq;
  const visible = row?.visible ?? true;
  const faqs = (content.items ?? DEFAULT_CONTENT.faq.items).slice(0, 6);

  const reducedMotion = useReducedMotion();
  const [imageRef, imageVisible] = useRevealOnce(reducedMotion);
  const [contentRef, contentVisible] = useRevealOnce(reducedMotion);

  if (!loading && !visible) return null;

  return (
    <section className="bg-white py-[110px]">
      <div
        className="
          container
          grid
          grid-cols-[0.85fr_1.15fr]
          items-stretch
          gap-[60px]
          max-[1100px]:grid-cols-1
        "
      >
        {/* LEFT IMAGE */}
        <div
          ref={imageRef}
          className={`
    h-[960px]
    w-full
    self-start
    overflow-hidden
    rounded-[10px]

    max-[1100px]:h-[420px]
    max-[900px]:h-[360px]
    max-[560px]:h-[300px]

    ${revealClass(imageVisible)}
  `}
        >
          <img
            src={content.photo_url || photo}
            alt="Dermatologist consulting with a patient"
            className="
      block
      h-full
      w-full
      object-cover
      object-center
    "
          />
        </div>
        {/* RIGHT FAQ CONTENT */}
        {/* RIGHT FAQ CONTENT */}
        <div
          ref={contentRef}
          className={`flex h-full flex-col ${revealClass(contentVisible)}`}
        >
          {/* Heading */}
          <h2 className="section-title text-navy">
            Frequently Asked Questions
          </h2>

          <hr className="section-divider mb-6" />

          {/* Intro Text */}
          <div className="mb-8">
            <p className="font-heading text-lg leading-[1.75] text-text">
              {content.intro_text}
            </p>
          </div>

          {/* FAQ LIST */}
          <div
            className="
      mb-6
      flex
      min-h-[500px]
      flex-col
      gap-4

      max-[1100px]:min-h-[480px]
      max-[700px]:min-h-[460px]
      max-[560px]:min-h-0
    "
          >
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;

              return (
                <div
                  key={i}
                  className={`
            rounded
            border
            p-[4px_24px]
            transition-colors
            duration-200

            max-[560px]:p-[2px_16px]

            ${isOpen ? "border-accent" : "border-black/15"}
          `}
                >
                  {/* QUESTION */}
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className={`
              flex
              w-full
              items-center
              justify-between
              gap-4
              border-none
              bg-transparent
              py-[22px]
              text-left
              font-heading
              text-xl
              font-medium

              max-[700px]:text-lg
              max-[560px]:py-[18px]
              max-[560px]:text-[16px]

              ${isOpen ? "text-accent" : "text-text-dark"}
            `}
                  >
                    {/* Question Text */}
                    <span className="min-w-0 flex-1">{item.question}</span>

                    {/* Plus / Minus Icon */}
                    <span
                      aria-hidden="true"
                      className={`
                flex
                h-7
                w-7
                flex-none
                items-center
                justify-center
                rounded
                text-lg
                leading-none

                ${
                  isOpen
                    ? "bg-accent text-white"
                    : "bg-black/[0.06] text-text-dark"
                }
              `}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {/* ANSWER */}
                  {isOpen && item.answer && (
                    <div
                      className="
                mb-[22px]
                pr-10

                max-[560px]:mb-[18px]
                max-[560px]:pr-0
              "
                    >
                      <p
                        className="
                  font-heading
                  text-[15px]
                  leading-[1.85]
                  text-text

                  max-[560px]:text-[14px]
                  max-[560px]:leading-[1.7]
                "
                      >
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* LEARN MORE */}
          <button type="button" className="btn-hero mt-auto self-start">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
