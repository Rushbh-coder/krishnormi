export default function TreatmentCard({ treatment }) {
  return (
    <article
      className="
        group
        
        flex
        h-[400px]
        w-[400px]
        min-w-0
        flex-col
        overflow-hidden
        border
        border-[#e7e7e7]
        bg-white
        transition-all
        duration-300

        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]

        max-[650px]:hover:translate-y-0
      "
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      {treatment.image && (
        <div
          className="
            aspect-[16/9]
            w-full
            flex-none
            overflow-hidden
            bg-[#f5f5f5]

            min-[1200px]:aspect-[16/8.5]
          "
        >
          <img
            src={treatment.image}
            alt={treatment.title}
            loading="lazy"
            className="
              h-full
              w-full
              object-cover
              object-center
              transition-transform
              duration-500

              group-hover:scale-105

              max-[650px]:group-hover:scale-100
            "
          />
        </div>
      )}

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          flex
          flex-1
          flex-col
          p-5

          max-[1100px]:p-4
          max-[650px]:p-5
        "
      >
        <h3
          className="
            font-heading
            text-[17px]
            leading-[1.35]
            font-bold
            text-navy

            max-[600px]:text-[16px]
          "
        >
          {treatment.title}
        </h3>

        <p
          className="
            mt-3
            font-body
            text-[12px]
            leading-[1.7]
            text-text

            max-[600px]:text-[12px]
          "
        >
          {treatment.description}
        </p>

        {/* Push Learn More to card bottom */}
        <div className="mt-auto pt-5">
          <div className="border-t border-[#ededed] pt-4">
            <a
              href="/contact-us"
              className="
                flex
                min-h-[28px]
                items-center
                justify-between
                gap-3
                font-heading
                text-[11px]
                font-semibold
                text-text-dark
                transition-colors
                duration-200

                hover:text-primary
              "
            >
              <span>Learn More</span>

              <span
                aria-hidden="true"
                className="
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                "
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
