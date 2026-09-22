import treatmentHeroBg from "../../assets/treatment-page/hero.jpg";

export default function TreatmentHero() {
  return (
    <section className="mx-auto w-full max-w-[1920px] overflow-hidden bg-white">
      <div
        className="
          relative
          w-full
          [aspect-ratio:1920/766]

          max-[900px]:aspect-auto
        "
      >
        {/* HERO IMAGE */}
        <img
          src={treatmentHeroBg}
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
            max-[900px]:block
            max-[900px]:aspect-[16/8]
            max-[900px]:h-auto
            max-[900px]:object-cover
            max-[900px]:object-[70%_center]

            max-[600px]:aspect-[16/10]
            max-[600px]:object-[72%_center]
          "
        />

        {/* CONTENT */}
        <div
          className="
            absolute
            top-1/2
            left-[12.5%]
            w-[34%]
            -translate-y-1/2

            max-[1400px]:left-[9%]
            max-[1400px]:w-[37%]

            max-[1100px]:left-[6%]
            max-[1100px]:w-[40%]

            max-[900px]:static
            max-[900px]:w-full
            max-[900px]:translate-y-0
            max-[900px]:px-6
            max-[900px]:py-10

            max-[600px]:px-5
            max-[600px]:py-8
          "
        >
          <h1
            className="
              font-heading
              text-[clamp(28px,2.865vw,55px)]
              leading-[1.2]
              font-bold
              text-black

              max-[900px]:text-[38px]
              max-[600px]:text-[32px]
              max-[400px]:text-[29px]
            "
          >
            <span className="text-primary">Our Treatment</span> Areas
          </h1>

          <hr
            className="
              section-divider
              mt-[10px]
              mb-[20px]
              h-[3px]
              w-[clamp(120px,10.68vw,205px)]

              max-[600px]:mb-5
              max-[600px]:w-[130px]
            "
          />

          <h2
            className="
              font-heading
              text-[clamp(17px,1.302vw,25px)]
              leading-[1.45]
              font-semibold
              text-black

              max-[600px]:text-[18px]
            "
          >
            Thoughtful treatment begins with the right assessment.
          </h2>

          <p
            className="
              mt-4
              font-body
              text-[clamp(13px,0.82vw,16px)]
              leading-[1.65]
              text-text

              max-[900px]:max-w-[650px]
              max-[600px]:text-[14px]
              max-[600px]:leading-[1.7]
            "
          >
            At <span className="font-bold text-black">KRISHNORMI</span>, every
            treatment begins with understanding the patient's concern, medical
            history, expectations and individual suitability.
          </p>

          <p
            className="
              mt-3
              font-body
              text-[clamp(13px,0.82vw,16px)]
              leading-[1.65]
              text-text

              max-[900px]:max-w-[650px]
              max-[600px]:text-[14px]
              max-[600px]:leading-[1.7]
            "
          >
            Treatment information is for general awareness. The final treatment,
            number of sessions, expected results, precautions and aftercare are
            discussed during consultation.
          </p>

          <a
            href="/contact-us"
            className="
              mt-5
              inline-flex
              min-h-[46px]
              w-[200px]
              items-center
              justify-center
              rounded-full
              border
              border-accent
              bg-white
              px-5
              py-3
              font-body
              text-sm
              font-semibold
              text-accent
              transition-colors
              duration-200

              hover:bg-accent
              hover:text-white

              max-[600px]:w-auto
              max-[600px]:min-w-[180px]
            "
          >
            Book an Appointment
          </a>
        </div>
      </div>
    </section>
  );
}
