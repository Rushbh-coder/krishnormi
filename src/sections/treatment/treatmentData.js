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
   TREATMENT CATEGORIES
========================================================= */

export const treatmentCategories = [
  {
    id: "facials",
    title: "Facials",
    description:
      "Clinic-based facial care selected around your skin's current needs.",
     description2:"Selected clinic-based facial procedures may help support cleansing, hydration, exfoliation and general skin maintenance",
     
    image: facialImg,
    count: 4,
  },

  {
    id: "chemical-peels",
    title: "Chemical Peels",
    description:
      "Chemical peels involve controlled application of selected exfoliating agents.",
    image: chemicalPeelImg,
    count: 16,
  },

  {
    id: "microneedling",
    title: "Microneedling",
    description:
      "Device-assisted and autologous procedures considered only after assessment.",
    image: microneedlingImg,
    count: 8,
  },

  {
    id: "lasers",
    title: "Lasers",
    description:
      "Laser treatment is recommended only after assessing the patient's concern.",
    image: laserImg,
    count: 10,
  },

  {
    id: "clinical-procedures",
    title: "Clinical Procedures",
    description:
      "Diagnosis-led procedures performed only when clinically appropriate.",
    image: clinicalImg,
    count: 11,
  },

  {
    id: "injectables",
    title: "Injectables",
    description:
      "Injectable and anti-ageing procedures are considered only after consultation.",
    image: injectablesImg,
    count: 6,
  },

  {
    id: "other-treatments",
    title: "Other Treatments",
    description:
      "Additional treatment and concern labels preserved from the supplied treatment list.",
    image: otherImg,
    count: 5,
  },
];

/* =========================================================
   TREATMENTS
========================================================= */

export const treatments = {
  /* =======================================================
     FACIALS
  ======================================================= */

  facials: [
    {
      id: 1,
      title: "Hydra Facial",
      description:
        "A gentle facial treatment that deeply cleanses, exfoliates and hydrates the skin for a fresh, smooth and radiant appearance.",
      image: hydraFacialImg,
    },

    {
      id: 2,
      title: "Medi Facial",
      description:
        "A customized medical facial designed to cleanse, nourish and rejuvenate the skin while addressing specific skin concerns.",
      image: mediFacialImg,
    },

    {
      id: 3,
      title: "Carbon Facial",
      description:
        "A deep-cleansing facial using activated carbon to help remove impurities and support smoother-looking skin.",
      image: carbonFacialImg,
    },

    {
      id: 4,
      title: "Vampire Facial",
      description:
        "A PRP-based procedure designed to support collagen, skin texture and overall skin appearance.",
      image: vampireFacialImg,
    },
  ],

  /* =======================================================
     CHEMICAL PEELS
  ======================================================= */

  "chemical-peels": [
    {
      id: 1,
      title: "Acne Peel",
      description:
        "A dermatologist-guided peel that may be considered for acne-prone and congested skin.",
    },

    {
      id: 2,
      title: "Pigmentation Peel",
      description:
        "Controlled exfoliation selected to support concerns related to uneven pigmentation.",
    },
  ],

  /* =======================================================
     MICRONEEDLING
  ======================================================= */

  microneedling: [
    {
      id: 1,
      title: "Microneedling",
      description:
        "A controlled procedure designed to support skin texture and collagen stimulation.",
    },
  ],

  /* =======================================================
     LASERS
  ======================================================= */

  lasers: [
    {
      id: 1,
      title: "Laser Hair Reduction",
      description:
        "Laser-based hair reduction planned according to treatment area, skin characteristics and suitability.",
    },

    {
      id: 2,
      title: "Tattoo Removal",
      description:
        "Laser treatment considered after assessing tattoo colour, depth, location and skin type.",
    },
  ],

  /* =======================================================
     CLINICAL PROCEDURES
  ======================================================= */

  "clinical-procedures": [
    {
      id: 1,
      title: "Clinical Dermatology",
      description:
        "Diagnosis-led dermatology care selected according to individual clinical requirements.",
    },
  ],

  /* =======================================================
     INJECTABLES
  ======================================================= */

  injectables: [
    {
      id: 1,
      title: "Injectable Treatments",
      description:
        "Injectable procedures are considered after consultation and discussion of expected outcomes.",
    },
  ],

  /* =======================================================
     OTHER TREATMENTS
  ======================================================= */

  "other-treatments": [
    {
      id: 1,
      title: "Other Dermatology Treatments",
      description:
        "Additional treatment options are recommended according to diagnosis and individual suitability.",
    },
  ],
};
