export default function TreatmentSidebar({
  categories = [],
  activeCategory,
  onCategoryChange,
}) {
  return (
    <aside
      className="
        w-full
        overflow-hidden
        rounded-[6px]
        border-2
        border-[#e4e4e4]
        bg-gray-200
        shadow-[0_3px_12px_rgba(0,0,0,0.04)]
      "
    >
      {categories.map((category) => {
        const active = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange?.(category.id)}
            className={`
              group
              flex
              min-h-[100px]
              w-full
              items-center
              gap-[12px]
              border-b
              border-[#e8e8e8]
              px-[12px]
              py-[10px]
              text-left
              transition-all
              duration-300
              last:border-b-0

              max-[1200px]:gap-[10px]
              max-[1200px]:px-[10px]

              max-[900px]:min-h-[92px]
              max-[900px]:px-[12px]

              max-[600px]:min-h-[86px]
              max-[600px]:gap-[10px]
              max-[600px]:px-[10px]
              max-[600px]:py-[8px]

              ${
                active
                  ? "bg-[#062b68] text-white"
                  : "bg-white text-[#292929] hover:bg-[#f6f9fb]"
              }
            `}
          >
            {/* ==========================================
                CATEGORY IMAGE
            ========================================== */}

            <div
              className="
                h-[80px]
                w-[80px]
                flex-none
                overflow-hidden
                rounded-[3px]
                bg-[#B2BEB5]

                max-[1200px]:h-[72px]
                max-[1200px]:w-[72px]

                max-[900px]:h-[74px]
                max-[900px]:w-[82px]

                max-[600px]:h-[68px]
                max-[600px]:w-[68px]

                max-[400px]:h-[62px]
                max-[400px]:w-[62px]
              "
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition-transform
                    duration-500

                    group-hover:scale-105

                    max-[600px]:group-hover:scale-100
                  "
                />
              ) : (
                <div className="h-full w-full bg-[#edf2f2]" />
              )}
            </div>

            {/* ==========================================
                TEXT
            ========================================== */}

            <div className="min-w-0 flex-1">
              <p
                className={`
                  m-0
                  font-heading
                  text-[14px]
                  leading-[1.3]
                  font-bold

                  max-[600px]:text-[13px]

                  ${active ? "text-white" : "text-[#2d2d2d]"}
                `}
              >
                {category.title}
              </p>

              {category.description && (
                <p
                  className={`
                    mt-[5px]
                    mb-0
                    line-clamp-2
                    font-body
                    text-[10px]
                    leading-[1.4]

                    max-[600px]:text-[9.5px]

                    ${active ? "text-white/80" : "text-[#555]"}
                  `}
                >
                  {category.description}
                </p>
              )}
            </div>

            {/* ==========================================
                COUNT BADGE
            ========================================== */}

            {category.count !== undefined && (
              <span
                className="
                  flex
                  min-w-[26px]
                  flex-none
                  items-center
                  justify-center
                  self-start
                  rounded-[2px]
                  bg-[#ef2d62]
                  px-[5px]
                  py-[3px]
                  font-heading
                  text-[9px]
                  leading-none
                  font-semibold
                  text-white

                  max-[600px]:min-w-[24px]
                  max-[600px]:px-[4px]
                  max-[600px]:text-[8px]
                "
              >
                {category.count}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
