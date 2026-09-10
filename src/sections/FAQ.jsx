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
        <div
          ref={contentRef}
          className={`flex h-full flex-col ${revealClass(contentVisible)}`}
        >
          <h2 className="section-title text-navy">
            Frequently Asked Questions
          </h2>

          <hr className="section-divider mb-6" />
          <div className="mb-8">
            <p className="font-heading text-lg leading-[1.75] text-text">
              {content.intro_text}
            </p>
          </div>
          <div className="mb-8 flex flex-col gap-4">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;

              return (
                <div
                  key={i}
                  className={`rounded border p-[4px_24px] transition-colors duration-200 ${
                    isOpen ? "border-accent" : "border-black/15"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between gap-4 border-none bg-transparent py-[22px] text-left font-heading text-xl font-medium ${
                      isOpen ? "text-accent" : "text-text-dark"
                    }`}
                  >
                    <span>{item.question}</span>

                    <span
                      aria-hidden="true"
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded text-lg leading-none ${
                        isOpen
                          ? "bg-accent text-white"
                          : "bg-black/[0.06] text-text-dark"
                      }`}
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && item.answer && (
                    <div className="mb-[22px]">
                      <p className="font-heading text-[15px] leading-[1.85] text-text">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button type="button" className="btn-primary self-start">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
