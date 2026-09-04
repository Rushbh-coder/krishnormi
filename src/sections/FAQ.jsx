import { useState } from "react";

import photo from "../assets/faq/photo.png";
import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";
import ExpandableText from "../components/ExpandableText";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(1);

  const { row, loading } = useSection("faq");
  const content = row?.content ?? DEFAULT_CONTENT.faq;
  const visible = row?.visible ?? true;
  const faqs = content.items ?? DEFAULT_CONTENT.faq.items;

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
          className="
            h-full
            min-h-0
            overflow-hidden
            rounded-[10px]

            max-[900px]:h-[360px]
          "
        >
          <img
            src={content.photo_url || photo}
            alt="Dermatologist consulting with a patient"
            className="
              block
              h-full
              w-full
              object-cover
            "
          />
        </div>

        {/* RIGHT FAQ CONTENT */}
        <div className="flex h-full flex-col">
          <h2 className="section-title text-navy">
            Frequently Asked Questions
          </h2>

          <hr className="section-divider mb-6" />
          <div className="mb-8">
            <ExpandableText
              text={content.intro_text}
              lines={2}
              className="font-heading text-lg leading-[1.75] text-text"
              toggleClassName="
      !inline
      !mt-0
      ml-1
      whitespace-nowrap
      font-heading
      text-sm
      font-semibold
      text-accent
      hover:underline
    "
            />
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
                      <ExpandableText
                        text={item.answer}
                        lines={4}
                        className="font-heading text-[15px] leading-[1.85] text-text"
                      />
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
