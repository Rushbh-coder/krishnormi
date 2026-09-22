import { FaWhatsapp } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import collageMain from "../../assets/about-page/collage-main.jpg";
import collageFront from "../../assets/about-page/collage-front.jpg";
import { DEFAULT_CONTENT } from "../../data/homepageDefaults";
import Reveal from "./Reveal";

const CORE_VALUES = ["Patient first", "Evidence informed", "Individualized care"];

export default function AboutModernPractice({ content }) {
  const whatsappNumber = DEFAULT_CONTENT.footer.whatsapp_number.replace(/\D/g, "");
  return (
<section
          className="
          w-full
          bg-white
          pt-[100px]
          pb-[40px]
          max-[900px]:py-14
        "
        >
          <div
            className="
            container
            grid
            grid-cols-[minmax(0,700fr)_minmax(0,707fr)]
            items-start
            gap-[31px]
            max-[900px]:grid-cols-1
            max-[900px]:gap-16
          "
          >
            <Reveal
              className="
              relative
              aspect-square
              w-[88.6%]
              max-[900px]:mx-auto
              max-[900px]:mb-20
              max-[900px]:w-[72%]
            "
            >
              <img
                src={
                  content.modern_practice_main_image_url ||
                  content.story_image_url ||
                  collageMain
                }
                alt="Dermatology and skin care treatments at Krishnormi"
                className="
                  kr-orbit
                  absolute
                  inset-0
                  h-full
                  w-full
                  rounded-full
                  object-cover
                "
              />

              <div
                className="
                kr-orbit
                absolute
                top-[-0.9%]
                left-[2.3%]
                z-[2]
                flex
                aspect-square
                w-[24.4%]
                flex-col
                items-center
                justify-center
                rounded-full
                border-5
                bg-navy
                text-center
                leading-[1.3]
                text-white
              "
              >
                <span
                  className="
                  font-heading
                  text-[clamp(18px,2.24vw,43px)]
                  leading-[1.1]
                  font-bold
                "
                >
                  {content.experience_number || "35+"}
                </span>

                <span
                  className="
                  font-heading
                  text-[clamp(10px,1.04vw,20px)]
                  leading-[1.2]
                  font-medium
                "
                >
                  {content.experience_label || "Experience"}
                </span>
              </div>

              <img
                src={content.modern_practice_front_image_url || collageFront}
                alt="Aesthetic dermatology procedure at Krishnormi"
                className="
                  absolute
                  top-[53.7%]
                  left-[57.6%]
                  z-[2]
                  h-[57.3%]
                  w-[55.3%]
                  rounded-[50%]
                  border-4
                  border-white
                  object-cover
                  shadow-[-6px_-5px_4px_0_rgba(0,0,0,0.25)]
                "
              />
            </Reveal>

            <Reveal>
              <h2 className="section-title text-navy">
                {content.modern_practice_heading ||
                  "A modern practice shaped by responsible dermatology"}
              </h2>

              <hr
                className="
                section-divider
                mb-[30px]
              "
              />

              <p
                className="
                font-body
                text-sm
                leading-[30px]
                text-text
              "
              >
                {content.modern_practice_text_1 ||
                  "Krishnormi brings clinical dermatology, hair and scalp care, laser procedures and aesthetic dermatology together within one professional setting."}
              </p>

              <p
                className="
                mt-4
                font-body
                text-sm
                leading-[30px]
                text-text
              "
              >
                {content.modern_practice_text_2 ||
                  "Our approach is evidence-informed, transparent, ethical and personalised. Every recommendation begins with careful assessment of the patient’s concerns, needs and suitability for treatment—never a one-size-fits-all plan."}
              </p>

              <p
                className="
                mt-9
                mb-[18px]
                font-heading
                text-lg
                leading-[30px]
                font-bold
                text-navy
              "
              >
                {content.core_values_heading || "Core values"}
              </p>

              <div
                className="
                flex
                flex-wrap
                gap-x-[30px]
                gap-y-4
              "
              >
                {(content.core_values || CORE_VALUES).map((value) => (
                  <span
                    key={value}
                    className="
                      kr-core-value
                      inline-flex
                      items-center
                      gap-2
                      font-heading
                      text-lg
                      leading-[32px]
                      font-medium
                      text-black
                    "
                  >
                    <FiArrowUpRight
                      className="text-accent"
                      aria-hidden="true"
                    />

                    {value}
                  </span>
                ))}
              </div>

              <div
                className="
                mt-9
                flex
                w-[390px]
                max-w-full
                items-center
                rounded-md
                bg-[#e8f5f5]
                py-4
                pr-5
                pl-[30px]
              "
              >
                <span
                  className="
                  kr-whatsapp
                  flex
                  h-[60px]
                  w-[60px]
                  flex-none
                  items-center
                  justify-center
                  rounded-full
                  bg-[#25d366]
                  text-white
                "
                >
                  <FaWhatsapp size={32} aria-hidden="true" />
                </span>

                <span
                  className="
                    ml-4
                    h-[74px]
                    w-px
                    flex-none
                    bg-black/15
                  "
                  aria-hidden="true"
                />

                <div
                  className="
                  min-w-0
                  pl-[21px]
                "
                >
                  <p
                    className="
                    m-0
                    font-heading
                    text-xl
                    leading-[30px]
                    font-semibold
                    text-[#137979]
                  "
                  >
                    WhatsApp Helpline
                  </p>

                  <p
                    className="
                    m-0
                    font-body
                    text-xs
                    leading-[25px]
                    text-[#444]
                  "
                  >
                    Quick Appointment Booking via Whatsapp
                  </p>

                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mt-1
                      inline-block
                      font-heading
                      text-base
                      font-semibold
                      text-[#25d366]
                    "
                  >
                    Message Us
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
  );
}
