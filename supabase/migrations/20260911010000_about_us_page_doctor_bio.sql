-- Adds the "Meet the Doctor" bio field to the already-seeded about_page row.
-- Uses jsonb merge so it won't clobber any content already edited in admin.

update public.homepage_sections
set content = content || jsonb_build_object(
  'doctor_bio',
  'Dr. Deepa K. Bhatt brings decades of dermatological experience across skin, hair, clinical procedures, lasers and aesthetic dermatology. Every consultation begins with understanding the patient — their concern, medical history and expectations — before any treatment option is considered.'
)
where id = 'about_page'
  and not (content ? 'doctor_bio');
