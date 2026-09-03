import { useState } from "react";

import photo from "../assets/faq/photo.png";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(1);
  const { row, loading } = useSection('faq');
  const content = row?.content ?? DEFAULT_CONTENT.faq;
  const visible = row?.visible ?? true;
  const faqs = content.items ?? DEFAULT_CONTENT.faq.items;

  if (!loading && !visible) return null;

  return (
    <section className="bg-white py-[90px]">
      <div className="container grid grid-cols-[0.85fr_1.15fr] items-center gap-[60px] max-[900px]:grid-cols-1">
        <div className="[&_img]:h-full [&_img]:max-h-[640px] [&_img]:w-full [&_img]:rounded-[10px] [&_img]:object-cover max-[900px]:[&_img]:max-h-[360px]">
          <img src={content.photo_url || photo} alt="Dermatologist consulting with a patient" />
        </div>
        <div>
          <h2 className="section-title text-navy">Frequently Asked Questions</h2>
          <hr className="section-divider mb-6" />
          <p className="mb-8 font-heading text-lg leading-[1.75] text-text">{content.intro_text}</p>
          <div className="mb-8 flex flex-col gap-4">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  className={`rounded border p-[4px_24px] transition-colors duration-200 ${
                    isOpen ? "border-accent" : "border-black/15"
                  }`}
                  key={i}
                >
                  <button
                    type="button"
                    className={`flex w-full items-center justify-between gap-4 border-none bg-none py-[22px] text-left font-heading text-xl font-medium ${
                      isOpen ? "text-accent" : "text-text-dark"
                    }`}
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span
                      className={`flex h-7 w-7 flex-none items-center justify-center rounded text-lg leading-none ${
                        isOpen ? "bg-accent text-white" : "bg-black/[0.06] text-text-dark"
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && item.answer && (
                    <p className="m-0 mb-[22px] font-heading text-[15px] leading-[1.85] text-text">{item.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
          <button type="button" className="btn-primary">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
