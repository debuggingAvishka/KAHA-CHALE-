# KAHA CHALE

**Discover Jabalpur, one mood at a time.**

KAHA CHALE is a place-discovery web app focused on Jabalpur, Madhya Pradesh, and destinations in the surrounding region. It helps people explore local places, browse by category and region, and get recommendations based on their mood, interests, company and budget.

The project is being developed as a practical, source-conscious regional directory: published listings are served from Supabase, while place details and imagery remain subject to verification.

---

## What the app currently does

- **Explore the directory** — browse published places from the Jabalpur region.
- **Search and filter** — search by place name, area or category; filter by category and region.
- **Browse by region** — distinguish Jabalpur city, nearby escapes, extended trips and places whose locality still needs verification.
- **Mood quiz** — choose moods, interests, who you are going with and a budget to receive rule-based recommendations from the available place dataset.
- **Place cards** — view descriptions, category, area, listing-verification status, available photographs and photo credits, with a link to Google Maps.
- **Authentication** — create an account or sign in with email/password, or use Google sign-in.
- **Guest access** — explore the directory and use the discovery experience without creating an account.

### Recommendation behaviour

Recommendations are generated in the frontend using available place metadata and category-level interest associations. Unknown estimated costs are not treated as free: places with unknown costs can remain eligible, but the app labels the cost as unavailable. A match score reflects supported preference signals; it should not be interpreted as a guarantee that a place offers a particular activity or suits every visitor.

Quiz answers are handled in the current client-side experience and are not saved to a user profile.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript |
| Build tooling | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router |
| Authentication | Supabase Auth |
| Database / REST API | Supabase (PostgreSQL) |
| Place data | OpenStreetMap-derived records, with review and enrichment workflows |
| Place imagery | Verified image records with source, author and licence attribution |

---

## Getting started

### Prerequisites

- Node.js (use a current LTS release)
- npm
- A Supabase project for live database and authentication features

### 1. Clone the repository

```bash
git clone https://github.com/debuggingAvishka/KAHA-CHALE-.git
cd KAHA-CHALE-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and provide your Supabase project URL and anon/publishable key:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Then edit `.env.local` with your project values.

> **Security:** Only the Supabase anon/publishable key belongs in this browser app. Never put a Supabase `service_role` key, Google OAuth client secret, database password or other private credential in `.env.local` or any `VITE_*` variable. Vite exposes `VITE_*` values to the client bundle.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

---

## Supabase setup

The live directory uses the Supabase project schema and public read policies.

The frontend reads:

- `places` — published place records and their descriptions, coordinates, category, locality and estimated-cost fields.
- `place_categories` — category names and slugs.
- `localities` — locality labels used to derive the display region.
- `place_images` — verified primary images for published places, including attribution, source-page URL and licence.

The public directory query filters places by `listing_status = 'published'`. Image retrieval filters to `verification_status = 'verified'` and `is_primary = true`. Database Row Level Security (RLS) and SELECT policies must allow the intended public reads; drafts and unverified images should not be exposed through public policies.

If Supabase is configured but returns no published listings, or the request fails, the app falls back to the bundled local preview dataset. The preview dataset is not a substitute for the live database.

### Email and Google authentication

Authentication is implemented with Supabase Auth.

1. In Supabase, enable the Email provider.
2. For Google sign-in, enable the Google provider and enter the Google OAuth client ID and client secret in Supabase. Keep the client secret in Supabase; do not add it to frontend environment variables.
3. In Google Cloud, register the Supabase callback URL shown in the Supabase Google provider settings as an authorised redirect URI.
4. In Supabase Authentication URL Configuration, set the Site URL and add the app's local and deployed URLs to the allowed redirect URLs. For local development, add `http://localhost:5173/**`.
5. Configure the deployed domain before using OAuth in production.

Email confirmation may be required after email/password sign-up, depending on the Supabase Auth settings. Users can still browse as guests.

---

## Data quality and attribution

The directory is being expanded in stages. A listing appearing in the app does **not** mean every detail has been independently verified. The UI displays a verification label, and visitor access, opening hours, prices and other operational details should be confirmed before travel.

- Place records are sourced in part from OpenStreetMap. OpenStreetMap data is available under the [Open Database Licence (ODbL)](https://www.openstreetmap.org/copyright).
- Images are handled separately from place records. Keep the image author, licence, attribution and source-page URL with each image record, and follow the applicable licence conditions.
- Do not invent descriptions, opening hours, prices, visitor access or image credits. Prefer source-backed information and leave uncertain fields unconfirmed.
- The enrichment queue script creates review tasks; it does not generate facts or publish records automatically.

---

## Useful commands

```bash
npm run dev        # Start the Vite development server
npm run build      # Type-check and create a production build
npm run preview    # Preview the production build locally
npm run lint       # Run ESLint
npm run test       # Run Vitest in watch mode
npm run test:run   # Run tests once
```

### Enrichment review queue

A helper script can create a CSV queue for records missing descriptions, images, opening hours, websites or category review:

```bash
python scripts/build_enrichment_queue.py src/data/places.cleaned.json --out-dir data/enrichment
```

The generated queue is for research and review. It does not modify Supabase or publish listings.

---

## Project structure

```text
src/
├── components/layout/       # Shared layout and navigation
├── features/
│   ├── auth/                # Supabase authentication context
│   ├── places/              # Place types, cards, directory and data hook
│   └── recommendations/     # Mood quiz and recommendation logic
├── lib/
│   ├── supabase.ts          # Supabase Auth client
│   └── supabasePlaces.ts    # Published place and image data access
├── pages/                   # Home, Explore, About, Login and Signup
└── data/                    # Local preview data
scripts/                     # Data-quality and enrichment utilities
```

---

## Current scope and roadmap

KAHA CHALE is an active work in progress. The current implementation focuses on the regional directory, authentication and the client-side mood quiz.

Potential next steps include:

- Expand and verify the Jabalpur-region place directory.
- Improve place descriptions, image coverage and licence attribution.
- Add a multi-image gallery and richer place details.
- Improve recommendation metadata and explainability as more verified data becomes available.
- Develop privacy controls before introducing persistent personalisation or storing user preferences.

Features such as an AI discovery assistant, saved itineraries, persistent user profiles and a full in-app interactive map are not presented as implemented in the current version.

---

## Contributing

This is an evolving project. For suggestions or bug reports, open a GitHub issue with steps to reproduce the problem and relevant screenshots or logs.

## Licence

No repository-wide open-source licence is currently specified. Third-party data and images remain subject to their respective licences and attribution requirements.
