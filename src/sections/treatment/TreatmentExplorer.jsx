import { useMemo, useState } from "react";

import TreatmentSidebar from "./TreatmentSidebar";
import TreatmentCard from "./TreatmentCard";

import { treatmentCategories, treatments } from "./treatmentData";

import logo from "../../assets/header/logo-icon.png";
import sidebarDoctorsImg from "../../assets/treatment-page/doctors.jpg";

export default function TreatmentExplorer() {
  const [activeCategory, setActiveCategory] = useState("facials");

  const selectedCategory = useMemo(
    () => treatmentCategories.find((item) => item.id === activeCategory),
    [activeCategory],
  );

  const selectedTreatments = treatments?.[activeCategory] || [];

  return (
    <section
      className="
        w-full
        bg-white
        py-[80px]

        max-[1200px]:py-[65px]
        max-[900px]:py-[55px]
        max-[600px]:py-[40px]
      "
    >
      {/* =====================================================
          CENTERED MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          mx-auto
          grid
          w-[calc(100%-40px)]
          max-w-[1280px]
          grid-cols-[290px_minmax(0,1fr)]
          items-start
          gap-[20px]

          max-[1200px]:w-[calc(100%-32px)]
          max-[1200px]:grid-cols-[270px_minmax(0,1fr)]
          max-[1200px]:gap-[18px]

          max-[900px]:grid-cols-1
          max-[900px]:gap-[30px]

          max-[600px]:w-[calc(100%-24px)]
          max-[600px]:gap-[24px]
        "
      >
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div
          className="
            w-full
            min-w-0

            max-[900px]:mx-auto
            max-[900px]:max-w-[760px]
          "
        >
          <TreatmentSidebar
            categories={treatmentCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* =====================================================
              DOCTOR PROMOTIONAL BANNER
          ====================================================== */}

          <div
            className="
              relative
              mt-[24px]
              aspect-[466/330]
              w-full
              overflow-hidden
              rounded-[8px]
              bg-[#eaf8f8]

              max-[900px]:aspect-[16/7]
              max-[600px]:aspect-[466/330]
            "
          >
            <img
              src={sidebarDoctorsImg}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
              "
            />

            {/* TEXT */}

            <div
              className="
                absolute
                left-[3%]
                top-[10%]
                z-10
                w-[65%]
                max-w-[185px]

                max-[900px]:left-[5%]
                max-[900px]:top-[15%]
                max-[900px]:max-w-[220px]

                max-[600px]:left-[4%]
                max-[600px]:top-[12%]
                max-[600px]:max-w-[165px]
              "
            >
              <h5
                className="
                  m-0
                  font-heading
                  text-[clamp(19px,1.55vw,24px)]
                  font-bold
                  leading-[1.12]
                  text-black

                  max-[900px]:text-[26px]
                  max-[600px]:text-[clamp(19px,5vw,24px)]
                "
              >
                <span className="text-[#147a46]">Healthy Skin</span>
                <br />
                Begins with
                <br />
                the Right
                <br />
                Care
              </h5>
            </div>

            {/* LOGO */}

            <div
              className="
                absolute
                bottom-[7%]
                left-[7%]
                z-10
              "
            >
              <img
                src={logo}
                alt="KRISHNORMI"
                className="
                  h-auto
                  w-[45px]
                  object-contain

                  max-[900px]:w-[52px]
                  max-[600px]:w-[45px]
                "
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT CONTENT
        ====================================================== */}

        <div
          className="
            w-full
            min-w-0

            max-[900px]:mx-auto
            max-[900px]:max-w-[760px]
          "
        >
          {/* =====================================================
              CATEGORY HEADER
          ====================================================== */}

          <div className="w-full">
            <h2
              className="
                section-title
                m-0
                text-navy

                max-[600px]:text-[26px]
              "
            >
              {selectedCategory?.title || "Treatments"}
            </h2>

            {/* SHORT PINK LINE */}

            <div
              className="
                mt-[7px]
                mb-[12px]
                h-[2px]
                w-[55px]
                bg-[#ef2d62]

                max-[600px]:w-[45px]
              "
            />

            {/* DESCRIPTION 1 */}

            {selectedCategory?.description && (
              <p
                className="
                  m-0
                  w-full
                  max-w-[850px]
                  font-body
                  text-[14px]
                  leading-[1.7]
                  text-text

                  max-[600px]:text-[13px]
                  max-[600px]:leading-[1.6]
                "
              >
                {selectedCategory.description}
              </p>
            )}

            {/* DESCRIPTION 2 */}

            {selectedCategory?.description2 && (
              <p
                className="
                  mt-[5px]
                  mb-0
                  w-full
                  max-w-[850px]
                  font-body
                  text-[14px]
                  leading-[1.7]
                  text-text

                  max-[600px]:text-[13px]
                  max-[600px]:leading-[1.6]
                "
              >
                {selectedCategory.description2}
              </p>
            )}
          </div>

          {/* =====================================================
              TREATMENT CARDS
          ====================================================== */}

          {selectedTreatments.length > 0 ? (
            <div
              key={activeCategory}
              className="
                mt-[20px]
                grid
                w-full
                grid-cols-2
                items-stretch

                gap-x-[10px]
                gap-y-[10px]

                max-[1100px]:gap-[10px]

                max-[700px]:grid-cols-1
                max-[700px]:gap-[10px]

                max-[600px]:mt-[18px]
              "
            >
              {selectedTreatments.map((treatment) => (
                <div
                  key={`${activeCategory}-${treatment.id}`}
                  className="
                    h-full
                    w-full
                    min-w-0
                  "
                >
                  <TreatmentCard treatment={treatment} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                mt-[20px]
                w-full
                rounded-[6px]
                border
                border-[#e5e5e5]
                bg-[#fafafa]
                p-6

                max-[600px]:p-5
              "
            >
              <p
                className="
                  m-0
                  font-body
                  text-[14px]
                  text-text
                "
              >
                No treatments are currently available in this category.
              </p>
            </div>
          )}

          {/* =====================================================
              DISCLAIMER
          ====================================================== */}

          <div
            className="
              mt-[18px]
              flex
              min-h-[62px]
              w-full
              box-border
              items-center

              border
              border-[#36454F]
              border-l-[4px]
              border-l-[#ef2d62]

              bg-[#fafaf3]

              px-5
              py-3

              max-[768px]:min-h-[60px]
              max-[768px]:px-4

              max-[480px]:px-3
              max-[480px]:py-3
            "
          >
            <p
              className="
                m-0
                font-body
                text-[11px]
                italic
                leading-[1.6]
                text-[#444]

                max-[768px]:text-[10.5px]
                max-[480px]:text-[10px]
              "
            >
              Treatment selection depends on the skin condition, concern and
              suitability established during consultation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
