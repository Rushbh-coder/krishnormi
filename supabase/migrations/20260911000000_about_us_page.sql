-- Krishnormi About Us page: standalone /about-us page (distinct from the
-- "Our About US" teaser section already shown on the homepage).

-- ---------- Realtime ----------
-- Lets every open tab/visitor pick up admin content edits live, without a
-- page refresh (src/context/HomepageContentContext.jsx subscribes to this).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'homepage_sections'
  ) then
    alter publication supabase_realtime add table public.homepage_sections;
  end if;
end $$;

insert into public.homepage_sections (id, title, description, visible, sort_order, content) values
(
  'about_page',
  'About Us page',
  'Banner and story content on the /about-us page',
  true,
  10,
  '{
    "banner_eyebrow": "ABOUT US",
    "banner_heading": "About Krishnormi",
    "banner_text": "Expert Dermatology Guided by Experience, Evidence and Individual Care.",
    "story_heading": "Our Story",
    "story_text": "KRISHNORMI is a dermatology and aesthetics practice led by Dr. Deepa K. Bhatt, bringing together clinical dermatology, hair and scalp care, laser procedures and aesthetic dermatology within one professional setting.",
    "story_image_url": null,
    "mission_heading": "Our Approach",
    "mission_text": "We believe responsible dermatology should be evidence-informed, transparent, ethical and personalised. Every treatment plan is considered according to individual requirements and suitability rather than following a one-treatment-fits-all approach."
  }'::jsonb
)
on conflict (id) do nothing;
