# Krishnormi

Marketing site and content-managed admin dashboard for Krishnormi (Dr. Deepa Bhatt), built with React, Vite, Tailwind CSS, and Supabase.

## Stack

- **React 19 + Vite** — app shell and routing (`react-router-dom`)
- **Tailwind CSS v4** — styling
- **Supabase** — Postgres database, auth, and file storage for the admin CMS

## Structure

- `src/sections/` — public marketing site sections (Header, Hero, About Us, Why Choose, Treatments, Awards, Testimonials, FAQ, Footer)
- `src/pages/` — routed pages: the public `Home` page, `AdminLogin`, and the `admin/` dashboard (Dashboard, Home Page editor, Settings)
- `src/context/` — `AuthContext` (Supabase Auth session) and `HomepageContentContext` (live homepage content)
- `src/components/admin/` — reusable admin form fields and per-section editors
- `supabase/migrations/` — SQL schema, RLS policies, and seed data for the `homepage_sections` table and `site-media` storage bucket

## Local development

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL + anon key
npm run dev
```

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/publishable key |

These are required at build time — set them in your deployment platform's environment variable settings as well as locally.

## Database setup

Run the SQL in `supabase/migrations/20260903000000_homepage_cms.sql` in your Supabase project's SQL Editor. It creates the `homepage_sections` table, RLS policies, the `site-media` storage bucket, and seeds it with the site's default content.

Create an admin user under **Authentication → Users** in the Supabase dashboard to sign in at `/admin`.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run Oxlint
