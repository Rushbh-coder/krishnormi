import facialImg from "../../assets/treatment-page/facial.jpg";
import chemicalPeelImg from "../../assets/treatment-page/chemical-peel.jpg";
import microneedlingImg from "../../assets/treatment-page/microneedling.jpg";
import laserImg from "../../assets/treatment-page/laser.jpg";
import clinicalImg from "../../assets/treatment-page/clinical-procedure.jpg";
import injectablesImg from "../../assets/treatment-page/injectables.jpg";
import otherImg from "../../assets/treatment-page/other-treatment.jpg";

/* =========================================================
   FACIAL TREATMENT CARD IMAGES
========================================================= */

import hydraFacialImg from "../../assets/treatment-page/hydra-facial.png";
import mediFacialImg from "../../assets/treatment-page/medi-facial.jpg";
import carbonFacialImg from "../../assets/treatment-page/mask-facial.jpg";
import vampireFacialImg from "../../assets/treatment-page/vampire-facial.png";

/* =========================================================
   BUNDLED DEFAULT IMAGES

   Keyed by the `default_image` column of the treatment_categories
   and treatments tables. Shown until an admin uploads an image.
========================================================= */

export const DEFAULT_IMAGES = {
  facial: facialImg,
  "chemical-peel": chemicalPeelImg,
  microneedling: microneedlingImg,
  laser: laserImg,
  "clinical-procedure": clinicalImg,
  injectables: injectablesImg,
  "other-treatment": otherImg,
  "hydra-facial": hydraFacialImg,
  "medi-facial": mediFacialImg,
  "mask-facial": carbonFacialImg,
  "vampire-facial": vampireFacialImg,
};

export function resolveTreatmentImage(row) {
  return row?.image_url || DEFAULT_IMAGES[row?.default_image] || null;
}

/* =========================================================
   FALLBACK CATALOG

   Shown while Supabase data is loading, or if the tables are
   unreachable. Mirrors the seed data in
   supabase/migrations/20261013000000_treatments_page.sql.
========================================================= */

const FALLBACK = [
  {
    slug: "facials",
    title: "Facials",
    description:
      "Clinic-based facial care selected around your skin's current needs.",
    description_2:
      "Selected clinic-based facial procedures may help support cleansing, hydration, exfoliation and general skin maintenance",
    default_image: "facial",
    treatments: [
      {
        title: "Hydra Facial",
        description:
          "A gentle facial treatment that deeply cleanses, exfoliates and hydrates the skin for a fresh, smooth and radiant appearance.",
        default_image: "hydra-facial",
      },
      {
        title: "Medi Facial",
        description:
          "A customized medical facial designed to cleanse, nourish and rejuvenate the skin while addressing specific skin concerns.",
        default_image: "medi-facial",
      },
      {
        title: "Carbon Facial",
        description:
          "A deep-cleansing facial using activated carbon to help remove impurities and support smoother-looking skin.",
        default_image: "mask-facial",
      },
      {
        title: "Vampire Facial",
        description:
          "A PRP-based procedure designed to support collagen, skin texture and overall skin appearance.",
        default_image: "vampire-facial",
      },
    ],
  },

  {
    slug: "chemical-peels",
    title: "Chemical Peels",
    description:
      "Chemical peels involve controlled application of selected exfoliating agents.",
    default_image: "chemical-peel",
    treatments: [
      {
        title: "Acne Peel",
        description:
          "A dermatologist-guided peel that may be considered for acne-prone and congested skin.",
      },
      {
        title: "Pigmentation Peel",
        description:
          "Controlled exfoliation selected to support concerns related to uneven pigmentation.",
      },
    ],
  },

  {
    slug: "microneedling",
    title: "Microneedling",
    description:
      "Device-assisted and autologous procedures considered only after assessment.",
    default_image: "microneedling",
    treatments: [
      {
        title: "Microneedling",
        description:
          "A controlled procedure designed to support skin texture and collagen stimulation.",
      },
    ],
  },

  {
    slug: "lasers",
    title: "Lasers",
    description:
      "Laser treatment is recommended only after assessing the patient's concern.",
    default_image: "laser",
    treatments: [
      {
        title: "Laser Hair Reduction",
        description:
          "Laser-based hair reduction planned according to treatment area, skin characteristics and suitability.",
      },
      {
        title: "Tattoo Removal",
        description:
          "Laser treatment considered after assessing tattoo colour, depth, location and skin type.",
      },
    ],
  },

  {
    slug: "clinical-procedures",
    title: "Clinical Procedures",
    description:
      "Diagnosis-led procedures performed only when clinically appropriate.",
    default_image: "clinical-procedure",
    treatments: [
      {
        title: "Clinical Dermatology",
        description:
          "Diagnosis-led dermatology care selected according to individual clinical requirements.",
      },
    ],
  },

  {
    slug: "injectables",
    title: "Injectables",
    description:
      "Injectable and anti-ageing procedures are considered only after consultation.",
    default_image: "injectables",
    treatments: [
      {
        title: "Injectable Treatments",
        description:
          "Injectable procedures are considered after consultation and discussion of expected outcomes.",
      },
    ],
  },

  {
    slug: "other-treatments",
    title: "Other Treatments",
    description:
      "Additional treatment and concern labels preserved from the supplied treatment list.",
    default_image: "other-treatment",
    treatments: [
      {
        title: "Other Dermatology Treatments",
        description:
          "Additional treatment options are recommended according to diagnosis and individual suitability.",
      },
    ],
  },
];

// Same shape as the rows useTreatmentCatalog builds from Supabase.
export const FALLBACK_CATALOG = FALLBACK.map((category, categoryIndex) => ({
  description_2: null,
  image_url: null,
  ...category,
  id: category.slug,
  visible: true,
  sort_order: categoryIndex + 1,
  treatments: category.treatments.map((treatment, treatmentIndex) => ({
    image_url: null,
    default_image: null,
    ...treatment,
    id: `${category.slug}-${treatmentIndex + 1}`,
    category_id: category.slug,
    visible: true,
    sort_order: treatmentIndex + 1,
  })),
}));
