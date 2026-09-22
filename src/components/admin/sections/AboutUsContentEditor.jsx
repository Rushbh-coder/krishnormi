import { useEffect, useState,useRef } from "react";

import SectionPanel from "../SectionPanel";

import { Field, TextInput, TextArea, ImageUploadField } from "../fields";

import { useSaveSection } from "../../../hooks/useSaveSection";

import bannerHero from "../../../assets/about-page/banner-hero.jpg";
import collageMain from "../../../assets/about-page/collage-main.jpg";
import collageFront from "../../../assets/about-page/collage-front.jpg";
import doctorsBg from "../../../assets/about-page/doctors-bg.jpg";
import cardTexture from "../../../assets/about-page/card-texture.jpg";
import doctorDeepa from "../../../assets/about-page/doctor-deepa.png";
import doctorKhevana from "../../../assets/about-page/doctor-khevana.png";
import visionPhoto from "../../../assets/about-page/vision-photo.jpg";
import missionPhoto from "../../../assets/about-page/mission-photo.jpg";
import goalsPhoto from "../../../assets/about-page/goals-photo.jpg";

/* =========================================================
   DEFAULT CONTENT
========================================================= */

const DEFAULT_ABOUT_CONTENT = {
  banner: {
    eyebrow: "",
    heading: "",
    text: "",
    image_url: "",
  },

  modern_practice: {
    heading: "",
    text_1: "",
    text_2: "",
    main_image_url: "",
    front_image_url: "",
    core_values_title: "Core values",
    core_values: ["Patient first", "Evidence informed", "Individualized care"],
  },

  whatsapp: {
    title: "WhatsApp Helpline",
    description: "Quick Appointment Booking via Whatsapp",
    button_text: "Message Us",
  },

  doctors: {
    title: "Meet Our Doctors",
    background_image_url: "",
    card_texture_url: "",

    subtitle:
      "Expert Dermatology Guided by Experience, Evidence and Individual Care.",

    description:
      "A shared commitment to thoughtful assessment, clear communication and individualized dermatology care.",

    doctor_1: {
      name: "",
      badge: "",
      role: "",
      bio: "",
      image_url: "",
    },

    doctor_2: {
      name: "",
      badge: "",
      role: "",
      bio: "",
      image_url: "",
    },
  },

  what_guides_us: {
    title: "What Guides Us",

    description: "Clear principles. Thoughtful care.",

    vision: {
      title: "Our Vision",
      text: "",
      image_url: "",
    },

    mission: {
      title: "Our Mission",
      text: "",
      image_url: "",
    },

    goals: {
      title: "Our Goals",
      text: "",
      image_url: "",
    },
  },
};

/* =========================================================
   DEEP MERGE
========================================================= */

function mergeObjects(defaults, incoming) {
  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
    return incoming ?? defaults;
  }

  const result = {
    ...defaults,
  };

  Object.keys(incoming).forEach((key) => {
    const incomingValue = incoming[key];

    const defaultValue = defaults?.[key];

    if (
      incomingValue &&
      typeof incomingValue === "object" &&
      !Array.isArray(incomingValue) &&
      defaultValue &&
      typeof defaultValue === "object" &&
      !Array.isArray(defaultValue)
    ) {
      result[key] = mergeObjects(defaultValue, incomingValue);
    } else {
      result[key] = incomingValue;
    }
  });

  return result;
}

/* =========================================================
   NORMALIZE OLD FLAT CONTENT
========================================================= */

function normalizeContent(incoming) {
  const source = incoming || {};

  /*
   * Supports the current flat Supabase structure as well as
   * the newer nested structure used by this editor.
   */
  if (
    source.banner ||
    source.modern_practice ||
    source.doctors ||
    source.what_guides_us
  ) {
    return mergeObjects(DEFAULT_ABOUT_CONTENT, source);
  }

  return mergeObjects(DEFAULT_ABOUT_CONTENT, {
    banner: {
      eyebrow: source.banner_eyebrow || "",
      heading: source.banner_heading || "",
      text: source.banner_text || "",
      image_url: source.banner_image_url || "",
    },

    modern_practice: {
      heading:
        source.modern_practice_heading ||
        source.story_heading ||
        "",
      text_1:
        source.modern_practice_text_1 ||
        source.story_text ||
        source.story_text_1 ||
        "",
      text_2:
        source.modern_practice_text_2 ||
        source.story_text_2 ||
        "",
      main_image_url:
        source.modern_practice_main_image_url ||
        source.story_image_url ||
        "",
      front_image_url:
        source.modern_practice_front_image_url ||
        source.story_front_image_url ||
        "",
      core_values_title:
        source.core_values_heading ||
        source.core_values_title ||
        "Core values",
      core_values:
        source.core_values ||
        DEFAULT_ABOUT_CONTENT.modern_practice.core_values,
    },

    whatsapp: {
      title:
        source.whatsapp_title ||
        "WhatsApp Helpline",
      description:
        source.whatsapp_description ||
        "Quick Appointment Booking via Whatsapp",
      button_text:
        source.whatsapp_button_text ||
        "Message Us",
    },

    doctors: {
      title:
        source.doctors_title ||
        "Meet Our Doctors",
      subtitle:
        source.doctors_subtitle ||
        DEFAULT_ABOUT_CONTENT.doctors.subtitle,
      description:
        source.doctors_description ||
        DEFAULT_ABOUT_CONTENT.doctors.description,

      background_image_url:
        source.doctors_background_image_url ||
        "",

      card_texture_url:
        source.doctor_card_texture_url ||
        "",

      doctor_1: {
        name:
          source.doctor_deepa_name ||
          source.doctor_1_name ||
          "",
        badge:
          source.doctor_deepa_badge ||
          source.doctor_1_badge ||
          "",
        role:
          source.doctor_deepa_role ||
          source.doctor_1_role ||
          "",
        bio:
          source.doctor_deepa_bio ||
          source.doctor_1_bio ||
          source.doctor_bio ||
          "",
        image_url:
          source.doctor_deepa_image_url ||
          source.doctor_1_image_url ||
          "",
      },

      doctor_2: {
        name:
          source.doctor_khevana_name ||
          source.doctor_2_name ||
          "",
        badge:
          source.doctor_khevana_badge ||
          source.doctor_2_badge ||
          "",
        role:
          source.doctor_khevana_role ||
          source.doctor_2_role ||
          "",
        bio:
          source.doctor_khevana_bio ||
          source.doctor_2_bio ||
          "",
        image_url:
          source.doctor_khevana_image_url ||
          source.doctor_2_image_url ||
          "",
      },
    },

    what_guides_us: {
      title:
        source.guides_heading ||
        source.guides_title ||
        "What Guides Us",

      description:
        source.guides_text ||
        source.guides_description ||
        "",

      vision: {
        title:
          source.vision_title ||
          "Our Vision",
        text:
          source.vision_text ||
          "",
        image_url:
          source.vision_image_url ||
          "",
      },

      mission: {
        title:
          source.mission_title ||
          "Our Mission",
        text:
          source.mission_text ||
          "",
        image_url:
          source.mission_image_url ||
          "",
      },

      goals: {
        title:
          source.goals_title ||
          "Our Goals",
        text:
          source.goals_text ||
          "",
        image_url:
          source.goals_image_url ||
          "",
      },
    },
  });
}


/* =========================================================
   VALIDATION
========================================================= */

function validate(content) {
  const errors = {};

  const required = [
    ["banner.heading", "Banner heading"],

    ["banner.text", "Banner text"],

    ["modern_practice.heading", "Modern Practice heading"],

    ["modern_practice.text_1", "Modern Practice text"],

    ["doctors.doctor_1.name", "Doctor 1 name"],

    ["doctors.doctor_1.bio", "Doctor 1 bio"],

    ["doctors.doctor_2.name", "Doctor 2 name"],

    ["doctors.doctor_2.bio", "Doctor 2 bio"],

    ["what_guides_us.vision.text", "Vision text"],

    ["what_guides_us.mission.text", "Mission text"],

    ["what_guides_us.goals.text", "Goals text"],
  ];

  const getValue = (object, path) => {
    return path.split(".").reduce((value, key) => value?.[key], object);
  };

  required.forEach(([path, label]) => {
    const value = getValue(content, path);

    if (typeof value !== "string" || !value.trim()) {
      errors[path] = `${label} is required.`;
    }
  });

  return errors;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AboutUsContentEditor({
  initialContent,
  initialVisible,
  onPreview,
}) {
  const [content, setContent] = useState(normalizeContent(initialContent));

  const [visible, setVisible] = useState(initialVisible ?? true);
  const [savedVisible, setSavedVisible] = useState(initialVisible ?? true);

  const [fieldErrors, setFieldErrors] = useState({});

  const { save, saving, lastSaved, error } = useSaveSection("about_page");

  /*
   * If Supabase data changes after the
   * component was mounted, refresh editor.
   */
  useEffect(() => {
    setContent(normalizeContent(initialContent));

    setVisible(initialVisible ?? true);
    setSavedVisible(initialVisible ?? true);
  }, [initialContent, initialVisible]);

  /* =======================================================
     NESTED SETTER
  ======================================================= */

  const setNested = (path) => (value) => {
    setContent((current) => {
      const next = structuredClone(current);

      const keys = path.split(".");

      let target = next;

      for (let i = 0; i < keys.length - 1; i += 1) {
        target = target[keys[i]];
      }

      target[keys[keys.length - 1]] = value;

      return next;
    });

    setFieldErrors((current) => {
      if (!current[path]) {
        return current;
      }

      const next = {
        ...current,
      };

      delete next[path];

      return next;
    });
  };

  /* =======================================================
     ARRAY SETTER
  ======================================================= */

  const setCoreValue = (index) => (value) => {
    setContent((current) => {
      const next = structuredClone(current);

      if (!Array.isArray(next.modern_practice.core_values)) {
        next.modern_practice.core_values = [];
      }

      next.modern_practice.core_values[index] = value;

      return next;
    });
  };

  /* =======================================================
     ADD CORE VALUE
  ======================================================= */

  const addCoreValue = () => {
    setContent((current) => {
      const next = structuredClone(current);

      if (!Array.isArray(next.modern_practice.core_values)) {
        next.modern_practice.core_values = [];
      }

      next.modern_practice.core_values.push("");

      return next;
    });
  };

  /* =======================================================
     REMOVE CORE VALUE
  ======================================================= */

  const removeCoreValue = (index) => {
    setContent((current) => {
      const next = structuredClone(current);

      next.modern_practice.core_values =
        next.modern_practice.core_values.filter((_, i) => i !== index);

      return next;
    });
  };

  /* =======================================================
     VALIDATE
  ======================================================= */

  const runValidation = () => {
    const errors = validate(content);

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async () => {
    if (!runValidation()) {
      return;
    }

    const saved = await save(content, visible);

    if (saved) {
      setSavedVisible(visible);
    }
  };

  /* =======================================================
     PREVIEW
  ======================================================= */

  const handlePreview = () => {
    if (!runValidation()) {
      return;
    }

    if (typeof onPreview === "function") {
      onPreview({
        content,
        visible,
      });
    }
  };

  /* =======================================================
     ERROR CLASS
  ======================================================= */

  const fieldClass = (key) =>
    fieldErrors[key] ? "rounded-[10px] outline-2 outline-[#df2759]" : "";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <SectionPanel
      title="About Us Page"
      description="
        Manage all About Us page content,
        doctors, images and What Guides Us.
      "
      className="max-w-[400px] w-100"
      visible={visible}
      savedVisible={savedVisible}
      onVisibleChange={setVisible}
      lastSaved={lastSaved}
    >
      {/* ===================================================
          BANNER
      =================================================== */}

      <div
        id="banner"
        className="
          mb-8
          scroll-mt-[100px]
          border-b
          border-[#eaecf0]
          pb-8
        "
      >
        <h2
          className="
            mb-5
            font-heading
            text-xl
            font-bold
            text-[#101828]
          "
        >
          1. Banner
        </h2>

        <Field label="Banner eyebrow">
          <TextInput
            value={content.banner.eyebrow}
            onChange={setNested("banner.eyebrow")}
          />
        </Field>

        <div className={fieldClass("banner.heading")}>
          <Field label="Banner heading *">
            <TextInput
              value={content.banner.heading}
              onChange={setNested("banner.heading")}
              maxLength={15}
            />
          </Field>

          {fieldErrors["banner.heading"] && (
            <p className="mt-1 text-xs text-[#df2759]">
              {fieldErrors["banner.heading"]}
              
            </p>

          )}
        </div>

        <div className={fieldClass("banner.text")}>
          <Field label="Banner text *">
            <TextArea
              value={content.banner.text}
              onChange={setNested("banner.text")}
              rows={3}
              maxLength={150}
            />
          </Field>

          {fieldErrors["banner.text"] && (
            <p className="mt-1 text-xs text-[#df2759]">
              {fieldErrors["banner.text"]}
            </p>
          )}
        </div>

        <ImageUploadField
          label="Banner image"
          value={content.banner.image_url}
          fallback={bannerHero}
          onChange={setNested("banner.image_url")}
          folder="about-page/banner"
          aspect={1920 / 766}
        />
      </div>

      {/* ===================================================
          MODERN PRACTICE
      =================================================== */}

      <div
        id="modern-practice"
        className="
          mb-8
          scroll-mt-[100px]
          border-b
          border-[#eaecf0]
          pb-8
        "
      >
        <h2
          className="
            mb-5
            font-heading
            text-xl
            font-bold
            text-[#101828]
          "
        >
          2. Modern Practice
        </h2>

        <div className={fieldClass("modern_practice.heading")}>
          <Field label="Heading *">
            <TextInput
              value={content.modern_practice.heading}
              onChange={setNested("modern_practice.heading")}
              maxLength={50}
            />
          </Field>
        </div>

        <div className={fieldClass("modern_practice.text_1")}>
          <Field label="First paragraph *">
            <TextArea
              value={content.modern_practice.text_1}
              onChange={setNested("modern_practice.text_1")}
              rows={4}
              maxLength={300}
            />
          </Field>
        </div>

        <Field label="Second paragraph">
          <TextArea
            value={content.modern_practice.text_2}
            onChange={setNested("modern_practice.text_2")}
            rows={4}
            maxLength={300}
          />
        </Field>

        <div
          className="
            grid
            grid-cols-2
            gap-5
            max-[800px]:grid-cols-1
          "
        >
          <ImageUploadField
            label="Modern Practice main image"
            value={content.modern_practice.main_image_url}
            fallback={collageMain}
            onChange={setNested("modern_practice.main_image_url")}
            folder="about-page/modern-practice"
            aspect={1}
          />

          <ImageUploadField
            label="Modern Practice front image"
            value={content.modern_practice.front_image_url}
            fallback={collageFront}
            onChange={setNested("modern_practice.front_image_url")}
            folder="about-page/modern-practice"
            aspect={1}
          />
        </div>

        {/* <Field label="Core values heading">
          <TextInput
            value={content.modern_practice.core_values_title}
            onChange={setNested("modern_practice.core_values_title")}
          />
        </Field> */}

        <div className="mt-4">
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >
            {/* <p
              className="
                font-heading
                text-sm
                font-semibold
                text-[#344054]
              "
            >
              Core values
            </p> */}

            <button
              type="button"
              onClick={addCoreValue}
              className="
                rounded-lg
                border
                border-[#df2759]
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[#df2759]
                hover:bg-[#df2759]
                hover:text-white
              "
            >
              + Add Value
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {(content.modern_practice.core_values || []).map((value, index) => (
              <div
                key={index}
                className="
                    flex
                    items-center
                    gap-3
                  "
              >
                <TextInput
                  value={value}
                  onChange={setCoreValue(index)}
                  maxLength={20}
                />

                <button
                  type="button"
                  onClick={() => removeCoreValue(index)}
                  className="
                      shrink-0
                      rounded-lg
                      border
                      border-[#f7c8d5]
                      bg-[#fce8ee]
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-[#df2759]
                    "
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================
          WHATSAPP
      =================================================== */}

      {/* <div
        id="whatsapp"
        className="
          mb-8
          scroll-mt-[100px]
          border-b
          border-[#eaecf0]
          pb-8
        "
      >
        <h2
          className="
            mb-5
            font-heading
            text-xl
            font-bold
            text-[#101828]
          "
        >
          WhatsApp Helpline
        </h2>

        <Field label="Title">
          <TextInput
            value={content.whatsapp.title}
            onChange={setNested("whatsapp.title")}
          />
        </Field>

        <Field label="Description">
          <TextInput
            value={content.whatsapp.description}
            onChange={setNested("whatsapp.description")}
          />
        </Field>

        <Field label="Button text">
          <TextInput
            value={content.whatsapp.button_text}
            onChange={setNested("whatsapp.button_text")}
          />
        </Field>
      </div> */}

      {/* ===================================================
          DOCTORS
      =================================================== */}

      <div
        id="doctors"
        className="
          mb-8
          scroll-mt-[100px]
          border-b
          border-[#eaecf0]
          pb-8
        "
      >
        <h2
          className="
            mb-5
            font-heading
            text-xl
            font-bold
            text-[#101828]
          "
        >
          3. Meet Our Doctors
        </h2>

        <Field label="Section heading">
          <TextInput
            value={content.doctors.title}
            onChange={setNested("doctors.title")}
          />
        </Field>

        <Field label="Section subtitle">
          <TextInput
            value={content.doctors.subtitle}
            onChange={setNested("doctors.subtitle")}
          />
        </Field>

        <Field label="Section description">
          <TextArea
            value={content.doctors.description}
            onChange={setNested("doctors.description")}
            rows={3}
          />
        </Field>

        <div className="mt-6 grid grid-cols-2 gap-5 max-[800px]:grid-cols-1">
          <ImageUploadField
            label="Doctors background image"
            value={content.doctors.background_image_url}
            fallback={doctorsBg}
            onChange={setNested("doctors.background_image_url")}
            folder="about-page/doctors"
            aspect={16 / 9}
          />

          <ImageUploadField
            label="Doctor card texture"
            value={content.doctors.card_texture_url}
            fallback={cardTexture}
            onChange={setNested("doctors.card_texture_url")}
            folder="about-page/doctors"
            aspect={16 / 9}
          />
        </div>

        {/* DOCTOR 1 */}

        <div
          className="
            mt-6
            rounded-xl
            border
            border-[#e4eae7]
            bg-[#f8faf9]
            p-5
          "
        >
          <h3
            className="
              mb-5
              font-heading
              text-lg
              font-bold
              text-[#101828]
            "
          >
            Doctor 1
          </h3>

          <ImageUploadField
            label="Doctor 1 image"
            value={content.doctors.doctor_1.image_url}
            fallback={doctorDeepa}
            onChange={setNested("doctors.doctor_1.image_url")}
            folder="about-page/doctors"
            aspect={1}
          />

          <Field label="Name *">
            <TextInput
              value={content.doctors.doctor_1.name}
              onChange={setNested("doctors.doctor_1.name")}
            />
          </Field>

          <Field label="Badge">
            <TextInput
              value={content.doctors.doctor_1.badge}
              onChange={setNested("doctors.doctor_1.badge")}
            />
          </Field>

          <Field label="Role">
            <TextInput
              value={content.doctors.doctor_1.role}
              onChange={setNested("doctors.doctor_1.role")}
            />
          </Field>

          <Field label="Bio *">
            <TextArea
              value={content.doctors.doctor_1.bio}
              onChange={setNested("doctors.doctor_1.bio")}
              rows={5}
              maxLength={200}
            />
          </Field>
        </div>

        {/* DOCTOR 2 */}

        <div
          className="
            mt-6
            rounded-xl
            border
            border-[#e4eae7]
            bg-[#f8faf9]
            p-5
          "
        >
          <h3
            className="
              mb-5
              font-heading
              text-lg
              font-bold
              text-[#101828]
            "
          >
            Doctor 2
          </h3>

          <ImageUploadField
            label="Doctor 2 image"
            value={content.doctors.doctor_2.image_url}
            fallback={doctorKhevana}
            onChange={setNested("doctors.doctor_2.image_url")}
            folder="about-page/doctors"
            aspect={1}
          />

          <Field label="Name *">
            <TextInput
              value={content.doctors.doctor_2.name}
              onChange={setNested("doctors.doctor_2.name")}
              maxLength={20}
                        />
          </Field>

          <Field label="Badge">
            <TextInput
              value={content.doctors.doctor_2.badge}
              onChange={setNested("doctors.doctor_2.badge")}
              maxLength={15}
              rows={1}
            />
          </Field>

          <Field label="Role">
            <TextInput
              value={content.doctors.doctor_2.role}
              onChange={setNested("doctors.doctor_2.role")}
              rows={4}
              maxLength={50}
            />
          </Field>

          <Field label="Bio *">
            <TextArea
              value={content.doctors.doctor_2.bio}
              onChange={setNested("doctors.doctor_2.bio")}
              rows={5}
              maxLength={200}
            />
          </Field>
        </div>
      </div>


      {/* ===================================================
    WHAT GUIDES US
=================================================== */}

      <div
        id="what-guides-us"
        className="
    mb-8
    scroll-mt-[100px]
    border-b
    border-[#eaecf0]
    pb-8
  "
      >
        <h2
          className="
      mb-5
      font-heading
      text-xl
      font-bold
      text-[#101828]
    "
        >
          4. What Guides Us
        </h2>

        <Field label="Section heading">
          <TextInput
            value={content.what_guides_us.title}
            onChange={setNested("what_guides_us.title")}
            maxLength={20}
          />

        </Field>

        <Field label="Section description">
          <TextArea
            value={content.what_guides_us.description}
            onChange={setNested("what_guides_us.description")}
            rows={3}
            maxLength={250}
          />
        </Field>

        {/* ===================== VISION ===================== */}

        <div
          className="
      mt-6
      rounded-xl
      border
      border-[#e4eae7]
      bg-[#f8faf9]
      p-5
    "
        >
          <h3
            className="
        mb-5
        font-heading
        text-lg
        font-bold
        text-[#101828]
      "
          >
            Our Vision
          </h3>

          <ImageUploadField
            label="Vision image"
            value={content.what_guides_us.vision.image_url}
            fallback={visionPhoto}
            onChange={setNested("what_guides_us.vision.image_url")}
            folder="about-page/guides"
            aspect={466 / 529}
          />

          <Field label="Vision heading">
            <TextInput
              value={content.what_guides_us.vision.title}
              onChange={setNested("what_guides_us.vision.title")}
            />
          </Field>

          <Field label="Vision text *">
            <TextArea
              value={content.what_guides_us.vision.text}
              onChange={setNested("what_guides_us.vision.text")}
              rows={4}
              maxLength={110}
            />
          </Field>
        </div>

        {/* ===================== MISSION ===================== */}

        <div
          className="
      mt-6
      rounded-xl
      border
      border-[#e4eae7]
      bg-[#f8faf9]
      p-5
    "
        >
          <h3
            className="
        mb-5
        font-heading
        text-lg
        font-bold
        text-[#101828]
      "
          >
            Our Mission
          </h3>

          <ImageUploadField
            label="Mission image"
            value={content.what_guides_us.mission.image_url}
            fallback={missionPhoto}
            onChange={setNested("what_guides_us.mission.image_url")}
            folder="about-page/guides"
            aspect={466 / 529}
          />

          <Field label="Mission heading">
            <TextInput
              value={content.what_guides_us.mission.title}
              onChange={setNested("what_guides_us.mission.title")}
            />
          </Field>

          <Field label="Mission text *">
            <TextArea
              value={content.what_guides_us.mission.text}
              onChange={setNested("what_guides_us.mission.text")}
              rows={4}
              maxLength={110}
            />
          </Field>
        </div>

        {/* ===================== GOALS ===================== */}

        <div
          className="
      mt-6
      rounded-xl
      border
      border-[#e4eae7]
      bg-[#f8faf9]
      p-5
    "
        >
          <h3
            className="
        mb-5
        font-heading
        text-lg
        font-bold
        text-[#101828]
      "
          >
            Our Goals
          </h3>

          <ImageUploadField
            label="Goals image"
            value={content.what_guides_us.goals.image_url}
            fallback={goalsPhoto}
            onChange={setNested("what_guides_us.goals.image_url")}
            folder="about-page/guides"
            aspect={466 / 529}
          />

          <Field label="Goals heading">
            <TextInput
              value={content.what_guides_us.goals.title}
              onChange={setNested("what_guides_us.goals.title")}
            />
          </Field>

          <Field label="Goals text *">
            <TextArea
              value={content.what_guides_us.goals.text}
              onChange={setNested("what_guides_us.goals.text")}
              rows={4}
              maxLength={110}
            />
          </Field>
        </div>
      </div>
      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div
          className="
            rounded-lg
            border
            border-[#f7c8d5]
            bg-[#fce8ee]
            px-4
            py-3
          "
        >
          <p
            className="
              font-body
              text-sm
              text-[#df2759]
            "
          >
            {error}
          </p>
        </div>
      )}

      {/* ===================================================
          ACTIONS
      =================================================== */}

      <div
        className="
          flex
          flex-wrap
          gap-3
          border-t
          border-[#eaecf0]
          pt-5
        "
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="
            inline-flex
            min-w-[130px]
            items-center
            justify-center
            rounded-[10px]
            bg-[#df2759]
            px-5
            py-2.5
            font-heading
            text-sm
            font-semibold
            text-white
            shadow-[0_6px_14px_-4px_rgba(224,38,89,0.16)]
            transition-all
            duration-200
            hover:bg-[#c91f4f]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving ? "Saving…" : "Save changes"}
        </button>

        <button
          type="button"
          onClick={handlePreview}
          disabled={saving}
          className="
            inline-flex
            min-w-[150px]
            items-center
            justify-center
            rounded-[10px]
            border
            border-[#df2759]
            bg-white
            px-5
            py-2.5
            font-heading
            text-sm
            font-semibold
            text-[#df2759]
            transition-all
            duration-200
            hover:bg-[#df2759]
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Preview Changes
        </button>
      </div>
    </SectionPanel>
  );
}
