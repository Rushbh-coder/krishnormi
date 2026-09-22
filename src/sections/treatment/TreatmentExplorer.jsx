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
    mb-0
        max-[1100px]:py-[65px]
        max-[900px]:py-[55px]
        max-[600px]:py-[40px]
      "
    >
      <div
        className="
          container
          grid
          grid-cols-[300px_minmax(0,1fr)]
          items-start
          gap-[20px]

          max-[1200px]:grid-cols-[280px_minmax(0,1fr)]
          max-[1200px]:gap-[32px]

          max-[900px]:grid-cols-1
          max-[900px]:gap-[40px]
        "
      >
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div
          className="
            w-full
            min-w-0

            max-[900px]:mx-auto
            max-[900px]:max-w-[650px]
          "
        >
          <TreatmentSidebar
            categories={treatmentCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* =================================================
              DOCTOR PROMOTIONAL BANNER
          ================================================= */}

          <div
            className="
              relative
              mt-8
              aspect-[466/330]
              w-full
              overflow-hidden
              rounded-[8px]
              bg-[#eaf8f8]

              max-[900px]:aspect-[16/8]
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
                top-[10%]
                left-[3%]
                z-10
                w-[65%]
                max-w-[185px]

                max-[900px]:top-[16%]
                max-[900px]:max-w-[210px]

                max-[600px]:top-[12%]
                max-[600px]:max-w-[165px]
              "
            >
              <h5
                className="
                  font-heading
                  text-[clamp(19px,1.55vw,24px)]
                  leading-[1.12]
                  font-bold
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

                  max-[900px]:w-[55px]
                  max-[600px]:w-[45px]
                "
              />
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT CONTENT
        ================================================= */}

        <div className="min-w-0 w-full">
          {/* =================================================
              CATEGORY HEADING
          ================================================= */}

          <div className="w-full">
            <h2
              className="
                section-title
                text-navy

                max-[600px]:text-[26px]
              "
            >
              {selectedCategory?.title || "Treatments"}
            </h2>

            <hr className="section-divider mb-4" />

            {selectedCategory?.description && (
              <p
                className="
                  max-w-[850px]
                  font-body
                  text-[14px]
                  leading-[1.8]
                  text-text

                  max-[600px]:text-[13px]
                "
              >
                {selectedCategory.description}
              </p>
            )}

            {selectedCategory?.description2 && (
              <p
                className="
                  mt-2
                  max-w-[850px]
                  font-body
                  text-[14px]
                  leading-[1.6]
                  text-text

                  max-[600px]:text-[13px]
                "
              >
                {selectedCategory.description2}
              </p>
            )}
          </div>

          {/* =================================================
              ALL TREATMENT CARDS
          ================================================= */}

          {selectedTreatments.length > 0 ? (
            <div
              key={activeCategory}
              className="
                mt-7
                grid
                w-[830px]
                grid-cols-2
                items-stretch
                gap-2

                max-[1100px]:gap-3

                max-[700px]:grid-cols-1
                max-[700px]:gap-4
              "
            >
              {selectedTreatments.map((treatment) => (
                <TreatmentCard
                  key={`${activeCategory}-${treatment.id}`}
                  treatment={treatment}
                />
              ))}
            </div>
          ) : (
            <div
              className="
                mt-7
                rounded-[6px]
                border
                border-[#e5e5e5]
                bg-[#fafafa]
                p-6

                max-[600px]:p-5
              "
            >
              <p className="m-0 font-body text-[14px] text-text">
                No treatments are currently available in this category.
              </p>
            </div>
          )}

          {/* =================================================
              DISCLAIMER
          ================================================= */}

          <div
            className="
              mt-6
              border-l-[4px]
              border-l-[#ef2d62]
              border-[#36454F]
              bg-[#fafaf3]
              px-5
              py-4
              w-205

              max-[600px]:px-4
              max-[600px]:py-3
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
