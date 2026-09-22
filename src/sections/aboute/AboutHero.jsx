import bannerHero from "../../assets/about-page/banner-hero.jpg";

function toSentenceCase(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
}

function AboutHeading({ value }) {
  const text = toSentenceCase(value || "About Krishnormi");
  const brandStart = text.toLowerCase().indexOf("krishnormi");

  if (brandStart === -1) return text;

  return (
    <>
      {text.slice(0, brandStart)}
      <span className="text-primary">Krishnormi</span>
      {text.slice(brandStart + "krishnormi".length)}
    </>
  );
}

export default function AboutHero({ content }) {
  return (
<section
          className="
          mx-auto
          w-full
          max-w-[1920px]
          overflow-hidden
          bg-white
        "
        >
          <div
            className="
            relative
            w-full
            [aspect-ratio:1920/766]
            max-[900px]:aspect-auto
          "
          >
            <img
              src={content.banner_image_url || bannerHero}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
                max-[900px]:relative
                max-[900px]:aspect-[16/11]
                max-[900px]:h-auto
                max-[900px]:object-[100%_center]
              "
            />

            <div
              className="
              kr-hero-content
              absolute
              top-[55.3%]
              left-[12.5%]
              w-[31.63%]
              -translate-y-1/2
              max-[900px]:static
              max-[900px]:w-auto
              max-[900px]:translate-y-0
              max-[900px]:px-5
              max-[900px]:pt-10
              max-[900px]:pb-14
            "
            >
              <h1
                className="
                font-heading
                text-[clamp(26px,2.865vw,55px)]
                leading-[1.4]
                font-bold
                text-black
                max-[900px]:text-[36px]
                max-[560px]:text-[30px]
              "
              >
                <AboutHeading value={content.banner_eyebrow} />
              </h1>

              <hr
                className="
                kr-divider
                section-divider
                mt-[0.52vw]
                mb-[1.2vw]
                h-[3px]
                w-[clamp(120px,10.68vw,205px)]
                max-[900px]:my-4
                max-[900px]:w-[160px]
              "
              />

              <p
                className="
                font-heading
                text-[clamp(16px,1.302vw,25px)]
                leading-[1.6]
                font-semibold
                text-black
                max-[900px]:text-[20px]
              "
              >
                {content.banner_text ||
                  "Dermatology care built on experience, understanding and trust."}
              </p>

              <p
                className="
                mt-[1vw]
                font-body
                text-[clamp(14px,0.99vw,19px)]
                leading-[1.6]
                text-text
                max-[900px]:mt-4
                max-[900px]:text-base
              "
              >
                <span className="font-bold text-black">Krishnormi</span> is a
                patient-first dermatology and aesthetics practice where careful
                assessment, responsible recommendations and continuity of care
                guide every interaction.
              </p>

              <a
                href="/contact-us"
                className="mt-5 flex w-[200px] items-center justify-center rounded-full border border-accent bg-white px-5 py-3.5 font-body text-sm font-semibold text-accent transition-colors duration-200 hover:bg-accent hover:text-white"
              >
                Book an Appointment
              </a>
            </div>
          </div>
        </section>
  );
}
