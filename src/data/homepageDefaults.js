// Fallback content shown while Supabase data is loading, or if a row is
// missing/unreachable. Mirrors the seed data in
// supabase/migrations/20260903000000_homepage_cms.sql so the public site
// never flashes empty content.

export const DEFAULT_CONTENT = {
  hero: {
    heading: 'Healthy Skin Begins with the Right Care',
    supporting_text: 'Expert Dermatology Guided by Experience, Evidence and Individual Care.',
    body_text_1:
      'At KRISHNORMI, dermatological care combines clinical experience, careful assessment and a personalised approach to skin, hair and aesthetic concerns.',
    body_text_2:
      'Led by Dr. Deepa K. Bhatt, the clinic focuses on responsible dermatology where every treatment recommendation begins with understanding the individual patient, their concerns and their suitability for treatment.',
    button_label: 'Book an Appointment',
    button_link: '#contact',
    image_url: null,
  },
  about: {
    eyebrow_text: 'Our About US',
    heading: 'Welcome to KRISHNORMI',
    lead_text: 'Expert Dermatology Guided by Experience, Evidence and Individual Care.',
    body_text_1:
      'KRISHNORMI is a dermatology and aesthetics practice led by Dr. Deepa K. Bhatt, bringing together clinical dermatology, hair and scalp care, laser procedures and aesthetic dermatology within one professional setting.',
    body_text_2:
      "Our approach begins with understanding the patient's concern, medical history and expectations before considering available treatment options.",
    body_text_3:
      'We believe responsible dermatology should be evidence-informed, transparent, ethical and personalised. Every treatment plan is considered according to individual requirements and suitability rather than following a one-treatment-fits-all approach.',
    cta_label: 'About More',
    cta_link: '#contact',
    badge_number: '35+',
    badge_label: 'Experience',
    signature_role: 'Consultant Dermatologist, Cosmetologist & Trichologist',
    signature_note:
      'Professor & Head of Department – institutional designation to be displayed after final verification.',
    signature_name: '~ Dr. Deepa K. Bhatt',
    photo_top_url: null,
    photo_bottom_url: null,
    focus_items: [
      { title: 'Clinical Dermatology', description: 'Assessment and management of a wide range of skin-related concerns.' },
      { title: 'Hair & Scalp Care', description: 'Evaluation of hair fall, scalp conditions and related concerns.' },
      {
        title: 'Laser Dermatology',
        description: 'Doctor-supervised laser and energy-based procedures selected according to individual suitability.',
      },
      {
        title: 'Aesthetic Dermatology',
        description: 'Responsible aesthetic procedures supported by clinical assessment and realistic expectations.',
      },
    ],
  },
  'why-choose': {
    title: 'Why Choose Krishnormi?',
    cards: [
      {
        type: 'text',
        dark: true,
        title: 'Dermatology Care Built Around You',
        text: 'Choosing dermatological care is not simply about selecting a procedure. It is about understanding the concern, establishing suitability and choosing an appropriate course of care.',
        image_url: null,
      },
      { type: 'image', dark: false, title: '', text: '', image_url: null },
      {
        type: 'text',
        dark: false,
        title: 'Experience That Matters',
        text: 'Dr. Deepa K. Bhatt brings decades of dermatological experience across skin, hair, clinical procedures, lasers and aesthetic dermatology.',
        image_url: null,
      },
      { type: 'image', dark: false, title: '', text: '', image_url: null },
      { type: 'image', dark: false, title: '', text: '', image_url: null },
      {
        type: 'text',
        dark: false,
        title: 'Individualized Assessment',
        text: "Every patient's skin, medical history, lifestyle and expectations are different. Recommendations are therefore based on individual evaluation.",
        image_url: null,
      },
      { type: 'image', dark: false, title: '', text: '', image_url: null },
      {
        type: 'text',
        dark: false,
        title: 'Evidence-Informed Approach',
        text: 'Treatment options are considered using established clinical principles, professional judgement and current dermatological understanding.',
        image_url: null,
      },
    ],
  },
  treatments: {
    title: 'Treatments & Procedures',
    body_text:
      'Expert skin treatments tailored to your unique concerns, from rejuvenation to corrective procedures, promoting healthier, smoother, and more radiant-looking skin.',
    button_label: 'Learn More',
    background_image_url: null,
    hero_image_url: null,
    cards: [
      {
        featured: true,
        title: 'Dermatology Care Designed',
        text: 'KRISHNORMI provides dermatology, hair and scalp care, lasers and aesthetic dermatology.',
      },
      {
        featured: false,
        title: 'Facials & Skin Hydration',
        text: 'Selected clinic-based facial procedures may help support cleansing, hydration and general skin maintenance.',
      },
      {
        featured: false,
        title: 'Chemical Peels',
        text: 'Chemical peels gently exfoliate the skin to improve acne, pigmentation, uneven tone, and skin texture.',
      },
      {
        featured: false,
        title: 'Acne & Acne-Scar Care',
        text: 'Acne and acne scars are different conditions and may require different management approaches.',
      },
    ],
  },
  awards: {
    title: 'Awards & Recognition',
    subtitle: 'A Career Dedicated to Dermatology',
    body_text_1:
      'Dr. Deepa K. Bhatt brings approximately 35 years of professional experience in dermatology, combining clinical practice with longstanding involvement in medical education and mentorship.',
    body_text_2:
      'Her professional journey reflects a continued commitment to clinical dermatology, academic development, teaching and the advancement of responsible patient care.',
    highlights_title: 'Recognition Highlights',
    highlights_text:
      'KRISHNORMI is a dermatology and aesthetics practice led by Dr. Deepa K. Bhatt, bringing together clinical dermatology, hair and scalp care, laser procedures and aesthetic dermatology within one professional setting.',
    photo_url: null,
    cards: [
      { title: '35+ Years of Experience', description: 'Longstanding professional experience across clinical and aesthetic dermatology.' },
      { title: 'Academic Leadership', description: 'Extensive involvement in dermatology education and departmental leadership.' },
      {
        title: 'Teaching & Mentorship',
        description: 'Contribution towards educating and mentoring medical students and emerging dermatology professionals.',
      },
      { title: 'Professional Participation', description: 'Participation in lectures, conferences, workshops and scientific forums' },
    ],
  },
  testimonials: {
    title: 'Patient Testimonials',
    intro_text:
      "Every patient's experience is personal. KRISHNORMI values genuine feedback that helps us understand how patients experience our consultation, communication and care",
    background_image_url: null,
    stats: [
      { value: '20+', label: 'Years of Experience' },
      { value: '10K+', label: 'Patients Treated' },
      { value: '50K+', label: 'Skin Treatments' },
      { value: '98%', label: 'Patient Satisfaction' },
    ],
    testimonials: [
      {
        name: 'Firoz Saiyad',
        photo_url: null,
        quote:
          'very nice hospital dr explained everything clearly and treated patients with great patience and respect very grateful for the care provided. their dedication and kindness truly makes a difference. i would definitely recommend this hospital to others...❤️❤️',
      },
    ],
  },
  faq: {
    intro_text:
      'Explore answers to frequently asked questions about skin concerns and treatments. Get clear guidance on procedures, benefits, care, and expected results.',
    photo_url: null,
    items: [
      { question: 'Is submitting the website form a confirmed appointment?', answer: '' },
      {
        question: 'Do I need an appointment before visiting KRISHNORMI?',
        answer:
          'Yes. Consultations are provided through confirmed appointments. You may submit an appointment request online or contact the clinic directly.',
      },
      { question: 'What concerns can I consult for?', answer: '' },
      { question: 'Do you provide laser treatments?', answer: '' },
      { question: 'How do I know which treatment is right for me?', answer: '' },
    ],
  },
  footer: {
    tagline: 'Skin • Hair • Laser • Aesthetics',
    description:
      'Professional dermatology care focused on clinical assessment, responsible treatment and individualised recommendations.',
    address: '311, 312, Akshar Complex, Shivranjani Cross Road, Satellite, Ahmedabad',
    email: 'demo@example.com',
    phone: '079-35641858 / +91 95374 84784',
    facebook_url: '#',
    linkedin_url: '#',
    google_url: '#',
    twitter_url: '#',
  },
};
