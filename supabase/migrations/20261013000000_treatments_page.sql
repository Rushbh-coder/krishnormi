-- Krishnormi Treatments page: treatment categories, the treatments inside each
-- category, and the page copy (hero, sidebar banner, disclaimer).

-- ---------- Tables ----------

create table if not exists public.treatment_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  description_2 text,
  image_url text,
  -- Name of an image bundled with the site (src/assets/treatment-page), shown
  -- until an admin uploads one. Only set on the seeded rows.
  default_image text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.treatments (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.treatment_categories (id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  default_image text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists treatments_category_id_idx
  on public.treatments (category_id, sort_order);

-- Same function the homepage CMS migration defines; repeated so this file can
-- be run on its own in the SQL editor.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists treatment_categories_set_updated_at on public.treatment_categories;
create trigger treatment_categories_set_updated_at
  before update on public.treatment_categories
  for each row
  execute function public.set_updated_at();

drop trigger if exists treatments_set_updated_at on public.treatments;
create trigger treatments_set_updated_at
  before update on public.treatments
  for each row
  execute function public.set_updated_at();

-- ---------- Row level security ----------
-- Visitors can read whatever is switched on; a signed-in admin can read and
-- change everything, including hidden rows.

alter table public.treatment_categories enable row level security;
alter table public.treatments enable row level security;

drop policy if exists "Public can read visible treatment categories" on public.treatment_categories;
create policy "Public can read visible treatment categories"
  on public.treatment_categories
  for select
  to anon
  using (visible);

drop policy if exists "Authenticated users can read treatment categories" on public.treatment_categories;
create policy "Authenticated users can read treatment categories"
  on public.treatment_categories
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert treatment categories" on public.treatment_categories;
create policy "Authenticated users can insert treatment categories"
  on public.treatment_categories
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update treatment categories" on public.treatment_categories;
create policy "Authenticated users can update treatment categories"
  on public.treatment_categories
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete treatment categories" on public.treatment_categories;
create policy "Authenticated users can delete treatment categories"
  on public.treatment_categories
  for delete
  to authenticated
  using (true);

drop policy if exists "Public can read visible treatments" on public.treatments;
create policy "Public can read visible treatments"
  on public.treatments
  for select
  to anon
  using (visible);

drop policy if exists "Authenticated users can read treatments" on public.treatments;
create policy "Authenticated users can read treatments"
  on public.treatments
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert treatments" on public.treatments;
create policy "Authenticated users can insert treatments"
  on public.treatments
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update treatments" on public.treatments;
create policy "Authenticated users can update treatments"
  on public.treatments
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete treatments" on public.treatments;
create policy "Authenticated users can delete treatments"
  on public.treatments
  for delete
  to authenticated
  using (true);

-- ---------- Realtime ----------
-- Lets the open /treatments page pick up admin edits without a refresh
-- (src/hooks/useTreatmentCatalog.js subscribes to both tables).

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'treatment_categories'
  ) then
    alter publication supabase_realtime add table public.treatment_categories;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'treatments'
  ) then
    alter publication supabase_realtime add table public.treatments;
  end if;
end $$;

-- ---------- Page copy (reuses the existing homepage_sections table) ----------

insert into public.homepage_sections (id, title, description, visible, sort_order, content) values
(
  'treatments_page',
  'Treatments page',
  'Hero banner, sidebar banner and disclaimer on the /treatments page',
  true,
  11,
  '{
    "hero_heading_highlight": "Our Treatment",
    "hero_heading": "Areas",
    "hero_subheading": "Thoughtful treatment begins with the right assessment.",
    "hero_body_text_1": "At KRISHNORMI, every treatment begins with understanding the patient''s concern, medical history, expectations and individual suitability.",
    "hero_body_text_2": "Treatment information is for general awareness. The final treatment, number of sessions, expected results, precautions and aftercare are discussed during consultation.",
    "hero_button_label": "Book an Appointment",
    "hero_button_link": "/contact-us",
    "hero_image_url": null,
    "banner_heading_highlight": "Healthy Skin",
    "banner_heading": "Begins with the Right Care",
    "banner_image_url": null,
    "disclaimer": "Treatment selection depends on the skin condition, concern and suitability established during consultation."
  }'::jsonb
)
on conflict (id) do nothing;

-- ---------- Seed data ----------
-- Mirrors what was hardcoded in src/sections/treatment/treatmentData.js, so
-- the public page renders the same before any admin edits are made.

insert into public.treatment_categories (slug, title, description, description_2, default_image, sort_order) values
  ('facials', 'Facials', 'Clinic-based facial care selected around your skin''s current needs.', 'Selected clinic-based facial procedures may help support cleansing, hydration, exfoliation and general skin maintenance', 'facial', 1),
  ('chemical-peels', 'Chemical Peels', 'Chemical peels involve controlled application of selected exfoliating agents.', null, 'chemical-peel', 2),
  ('microneedling', 'Microneedling', 'Device-assisted and autologous procedures considered only after assessment.', null, 'microneedling', 3),
  ('lasers', 'Lasers', 'Laser treatment is recommended only after assessing the patient''s concern.', null, 'laser', 4),
  ('clinical-procedures', 'Clinical Procedures', 'Diagnosis-led procedures performed only when clinically appropriate.', null, 'clinical-procedure', 5),
  ('injectables', 'Injectables', 'Injectable and anti-ageing procedures are considered only after consultation.', null, 'injectables', 6),
  ('other-treatments', 'Other Treatments', 'Additional treatment and concern labels preserved from the supplied treatment list.', null, 'other-treatment', 7)
on conflict (slug) do nothing;

-- Only seeds treatments into an empty table, so re-running this never
-- duplicates rows or restores ones an admin has deleted.
insert into public.treatments (category_id, title, description, default_image, sort_order)
select c.id, seed.title, seed.description, seed.default_image, seed.sort_order
from (
  values
    ('facials', 'Hydra Facial', 'A gentle facial treatment that deeply cleanses, exfoliates and hydrates the skin for a fresh, smooth and radiant appearance.', 'hydra-facial', 1),
    ('facials', 'Medi Facial', 'A customized medical facial designed to cleanse, nourish and rejuvenate the skin while addressing specific skin concerns.', 'medi-facial', 2),
    ('facials', 'Carbon Facial', 'A deep-cleansing facial using activated carbon to help remove impurities and support smoother-looking skin.', 'mask-facial', 3),
    ('facials', 'Vampire Facial', 'A PRP-based procedure designed to support collagen, skin texture and overall skin appearance.', 'vampire-facial', 4),
    ('chemical-peels', 'Acne Peel', 'A dermatologist-guided peel that may be considered for acne-prone and congested skin.', null, 1),
    ('chemical-peels', 'Pigmentation Peel', 'Controlled exfoliation selected to support concerns related to uneven pigmentation.', null, 2),
    ('microneedling', 'Microneedling', 'A controlled procedure designed to support skin texture and collagen stimulation.', null, 1),
    ('lasers', 'Laser Hair Reduction', 'Laser-based hair reduction planned according to treatment area, skin characteristics and suitability.', null, 1),
    ('lasers', 'Tattoo Removal', 'Laser treatment considered after assessing tattoo colour, depth, location and skin type.', null, 2),
    ('clinical-procedures', 'Clinical Dermatology', 'Diagnosis-led dermatology care selected according to individual clinical requirements.', null, 1),
    ('injectables', 'Injectable Treatments', 'Injectable procedures are considered after consultation and discussion of expected outcomes.', null, 1),
    ('other-treatments', 'Other Dermatology Treatments', 'Additional treatment options are recommended according to diagnosis and individual suitability.', null, 1)
) as seed (category_slug, title, description, default_image, sort_order)
join public.treatment_categories c on c.slug = seed.category_slug
where not exists (select 1 from public.treatments);
