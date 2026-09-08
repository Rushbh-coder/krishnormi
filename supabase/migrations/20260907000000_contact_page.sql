-- Krishnormi Contact Us page: CMS content row + enquiry submissions table.

-- ---------- Contact page content (reuses the existing homepage_sections table) ----------

insert into public.homepage_sections (id, title, description, visible, sort_order, content) values
(
  'contact',
  'Contact Us page',
  'Banner, clinic details and enquiry form copy on the /contact-us page',
  true,
  9,
  '{
    "banner_eyebrow": "CONTACT US",
    "banner_heading": "We''re here to help",
    "banner_text": "Connect with the Krishnormi clinic team for appointments, directions or general enquiries.",
    "clinic_name": "Krishnormi Dermatology",
    "clinic_subheading": "Clinic contact information",
    "address": "Akshar Complex, Satellite Rd, Shivranjani, Jodhpur Village, Ahmedabad, Gujarat 380015",
    "latitude": 23.024412,
    "longitude": 72.528725,
    "phone": "079 3564 1858",
    "email": "info@krishnormi.com",
    "appointment_note": "Visits by confirmed appointment only",
    "map_label_name": "KRISHNORMI",
    "map_label_line1": "Akshar Complex, Shivranjani",
    "map_label_line2": "Ahmedabad, Gujarat 380015",
    "connect_eyebrow": "MULTIPLE WAYS TO CONNECT",
    "connect_heading": "Choose the easiest way to reach us.",
    "connect_text": "Our clinic team can assist with appointments, location guidance and general enquiries.",
    "form_title": "Book a Consultation",
    "form_subtitle": "Share your details and our team will contact you."
  }'::jsonb
)
on conflict (id) do nothing;

-- ---------- Enquiry submissions ----------
-- The public "Book a Consultation" form on /contact-us writes here.
-- Anyone can submit (no login required to send an enquiry); only signed-in
-- admins can read the list, matching how the rest of the admin data is scoped.

create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.contact_enquiries enable row level security;

drop policy if exists "Anyone can submit a contact enquiry" on public.contact_enquiries;
create policy "Anyone can submit a contact enquiry"
  on public.contact_enquiries
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users can read contact enquiries" on public.contact_enquiries;
create policy "Authenticated users can read contact enquiries"
  on public.contact_enquiries
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can delete contact enquiries" on public.contact_enquiries;
create policy "Authenticated users can delete contact enquiries"
  on public.contact_enquiries
  for delete
  to authenticated
  using (true);
