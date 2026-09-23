import Header from "../sections/Header";
import Footer from "../sections/Footer";

import TreatmentHero from "../sections/treatment/TreatmentHero";
import TreatmentExplorer from "../sections/treatment/TreatmentExplorer";

import AboutMeetDoctors from "../sections/aboute/AboutMeetDoctors";
import ContactFormSection from "../sections/contact/ContactFormSection";

import { useSection } from "../context/HomepageContentContext";
import { DEFAULT_CONTENT } from "../data/homepageDefaults";

export default function Treatments() {
  /* =========================================================
     FETCH DATA
  ========================================================= */

  const { row: contactRow } = useSection("contact");
  const { row: aboutRow } = useSection("about_page");
  const { row: testimonialsRow } = useSection("testimonials");

  /* =========================================================
     CONTACT CONTENT
  ========================================================= */

  const contactContent = contactRow?.content ?? DEFAULT_CONTENT?.contact ?? {};

  /* =========================================================
     RAW ABOUT CONTENT
  ========================================================= */

  const rawContent = aboutRow?.content ?? DEFAULT_CONTENT?.about_page ?? {};

  /* =========================================================
     DOCTOR CONTENT

     IMPORTANT:
     Database doctor information is nested like:

     doctors
       doctor_1
         name
         badge
         role
         bio
         image_url

       doctor_2
         name
         badge
         role
         bio
         image_url

     AboutMeetDoctors expects flat properties, so we map
     the nested structure here exactly like AboutUsPage.
  ========================================================= */

  const aboutContent = {
    /* ==========================
       DR. DEEPA BHATT
    ========================== */

    doctor_deepa_name:
      rawContent?.doctors?.doctor_1?.name ??
      rawContent?.doctor_deepa_name ??
      DEFAULT_CONTENT?.about_page?.doctor_deepa_name ??
      "Dr. Deepa Bhatt",

    doctor_deepa_badge:
      rawContent?.doctors?.doctor_1?.badge ??
      rawContent?.doctor_deepa_badge ??
      DEFAULT_CONTENT?.about_page?.doctor_deepa_badge ??
      "35+ years experience",

    doctor_deepa_role:
      rawContent?.doctors?.doctor_1?.role ??
      rawContent?.doctor_deepa_role ??
      DEFAULT_CONTENT?.about_page?.doctor_deepa_role ??
      "Consultant Dermatologist | Cosmetologist | Trichologist",

    doctor_deepa_bio:
      rawContent?.doctors?.doctor_1?.bio ??
      rawContent?.doctor_deepa_bio ??
      DEFAULT_CONTENT?.about_page?.doctor_deepa_bio ??
      "",

    doctor_deepa_image_url:
      rawContent?.doctors?.doctor_1?.image_url ??
      rawContent?.doctor_deepa_image_url ??
      "",

    /* ==========================
       DR. KHEVANA BHATT
    ========================== */

    doctor_khevana_name:
      rawContent?.doctors?.doctor_2?.name ??
      rawContent?.doctor_khevana_name ??
      DEFAULT_CONTENT?.about_page?.doctor_khevana_name ??
      "Dr. Khevana Bhatt",

    doctor_khevana_badge:
      rawContent?.doctors?.doctor_2?.badge ??
      rawContent?.doctor_khevana_badge ??
      DEFAULT_CONTENT?.about_page?.doctor_khevana_badge ??
      "Dermatologist",

    doctor_khevana_role:
      rawContent?.doctors?.doctor_2?.role ??
      rawContent?.doctor_khevana_role ??
      DEFAULT_CONTENT?.about_page?.doctor_khevana_role ??
      "Dermatologist",

    doctor_khevana_bio:
      rawContent?.doctors?.doctor_2?.bio ??
      rawContent?.doctor_khevana_bio ??
      DEFAULT_CONTENT?.about_page?.doctor_khevana_bio ??
      "",

    doctor_khevana_image_url:
      rawContent?.doctors?.doctor_2?.image_url ??
      rawContent?.doctor_khevana_image_url ??
      "",

    /* ==========================
       DOCTOR SECTION
    ========================== */

    doctors_title:
      rawContent?.doctors?.title ??
      rawContent?.doctors_title ??
      "Meet Our Doctors",

    doctors_subtitle:
      rawContent?.doctors?.subtitle ??
      rawContent?.doctors_subtitle ??
      "Expert Dermatology Guided by Experience, Evidence and Individual Care.",

    doctors_description:
      rawContent?.doctors?.description ??
      rawContent?.doctors_description ??
      "A shared commitment to thoughtful assessment, clear communication and individualized dermatology care.",

    /* ==========================
       BACKGROUND
    ========================== */

    doctors_background_image_url:
      rawContent?.doctors?.background_image_url ??
      rawContent?.doctors_background_image_url ??
      "",

    doctor_card_texture_url:
      rawContent?.doctors?.card_texture_url ??
      rawContent?.doctor_card_texture_url ??
      "",
  };

  /* =========================================================
     STATS
  ========================================================= */

  const testimonialsContent =
    testimonialsRow?.content ?? DEFAULT_CONTENT?.testimonials ?? {};

  const stats =
    testimonialsContent?.stats ?? DEFAULT_CONTENT?.testimonials?.stats ?? [];

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <TreatmentHero />

        {/* TREATMENTS */}
        <div className="mb-0">
          <TreatmentExplorer />
        </div>

        {/* =================================================
            MEET OUR DOCTORS
            Now receives same mapped data as About page
        ================================================= */}
        <div className="treatment-doctors-section ">
          <style>{`
    .treatment-doctors-section .doctors-band {
      border-radius: 50% 50% 0 0 / 3vw 3vw 0 0 !important;
    }

    @media (max-width: 900px) {
      .treatment-doctors-section .doctors-band {
        border-radius: 38px 38px 0 0 !important;
      }
    }

    @media (max-width: 640px) {
      .treatment-doctors-section .doctors-band {
        border-radius: 28px 28px 0 0 !important;
      }
    }
  `}</style>

          <AboutMeetDoctors content={aboutContent} stats={stats} />
        </div>

        {/* =================================================
            CONTACT
        ================================================= */}

        <section
          className="
            pt-20
            max-[900px]:pt-14
            max-[600px]:pt-10
          "
        >
          <ContactFormSection content={contactContent} />
        </section>
      </main>

      <Footer />
    </>
  );
}
