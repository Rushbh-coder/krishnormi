import ContactReveal from "./ContactReveal";

export default function ContactMap({ content, mapQuery }) {
  return (
        <section className="w-full mt-2 pb-0 bg-[#f9fcfb] max-[700px]:pb-14">
          <ContactReveal>
            <div
              className="
        relative
        w-full
        border
        border-[#c6c6c6]
        bg-white

        min-[561px]:h-[520px]
        max-[900px]:min-[561px]:h-[400px]

        max-[560px]:flex
        max-[560px]:flex-col
        max-[560px]:border-0
      "
            >
              {/* ================= GOOGLE MAP ================= */}

              <div
                className="
          absolute
          inset-0
          overflow-hidden

          max-[560px]:relative
          max-[560px]:inset-auto
          max-[560px]:h-[320px]
          max-[560px]:w-full
          max-[560px]:border
          max-[560px]:border-[#c6c6c6]
        "
              >
                <iframe
                  title="Krishnormi clinic location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    mapQuery,
                  )}&output=embed`}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  className="
            absolute
            inset-0
            h-full
            w-full
            border-0
          "
                />
              </div>

              {/* ================= LOCATION CARD ================= */}

              <div
                className="
          absolute
          top-6
          left-6
          z-10

          w-[300px]
          max-w-[calc(100%-48px)]

          rounded-[15px]
          border
          border-[#d6e3dd]
          bg-white

          p-[18px_22px]

          shadow-[0_10px_24px_-6px_rgba(13,38,33,0.18)]

          max-[560px]:relative
          max-[560px]:top-auto
          max-[560px]:left-auto
          max-[560px]:z-auto

          max-[560px]:w-full
          max-[560px]:max-w-none

          max-[560px]:rounded-none
          max-[560px]:border-t-0

          max-[560px]:p-[18px_20px]

          max-[560px]:shadow-none
        "
              >
                {/* Clinic Name */}

                <p
                  className="
            mb-1.5
            font-heading
            text-xs
            font-semibold
            uppercase
            tracking-[0.04em]
            text-accent
          "
                >
                  {content.map_label_name}
                </p>

                {/* Address Line 1 */}

                <p
                  className="
            mb-1
            font-heading
            text-base
            font-semibold
            leading-[1.4]
            text-text-dark
          "
                >
                  {content.map_label_line1}
                </p>

                {/* Address Line 2 */}

                <p
                  className="
            mb-4
            font-heading
            text-[13px]
            leading-[1.5]
            text-[#60736e]
          "
                >
                  {content.map_label_line2}
                </p>

                {/* ================= GET DIRECTIONS ================= */}

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    mapQuery,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get directions to Krishnormi clinic"
                  className="
            inline-flex
            items-center
            justify-center
            gap-2

            rounded-[6px]
            bg-primary

            px-4
            py-2.5

            font-heading
            text-[13px]
            font-semibold
            text-white

            transition-all
            duration-200

            hover:bg-primary-dark
            hover:shadow-md

            max-[560px]:w-full
            max-[560px]:py-3
          "
                >
                  Get Directions
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </ContactReveal>
        </section>
  );
}
