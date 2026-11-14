# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Current place directory (v2 rebuild)

The Explore experience currently reads from the cleaned local OpenStreetMap dataset in `src/data/places.cleaned.json`, with a small curated presentation layer in `src/features/places/data/places.ts`. It highlights seven flagship destinations, supports text/category/region filters, and links each place to a map search. Two extended-region listings (Singorgarh Fort and Veerangana Durgavati Wildlife Sanctuary) are currently included as unverified draft candidates.

**Data status:** this frontend snapshot is not yet connected to Supabase. Place descriptions and region labels are provisional presentation data; opening hours, prices, visitor access and images must be verified before being marked as confirmed. OSM source links are retained on cards where available.


## Supabase-powered Explore directory

The Explore and Featured Places sections now request **published** rows from Supabase.
The local curated dataset remains as a safe preview fallback when Supabase is not configured,
has no published listings, or is temporarily unavailable. Draft records are never fetched
by the public frontend.

### Configure Supabase locally

1. Copy `.env.example` to `.env.local` in the project root.
2. Set `VITE_SUPABASE_URL` to your Supabase project URL.
3. Set `VITE_SUPABASE_ANON_KEY` to your project's anon / publishable key.
4. Restart Vite (`Ctrl+C`, then `npm run dev`).

Only use the anon / publishable key in this frontend. Never use the `service_role` key.
The database must have public SELECT policies for published `places` and readable
`place_categories`. The app filters with `listing_status=published`, so draft records
remain hidden. If the database has no published places yet, the local preview remains visible.

### Database columns used

`places`: `id`, `name`, `description`, `latitude`, `longitude`, `address`, `area`,
`estimated_cost_min`, `estimated_cost_max`, `verification_status`, `category_id`,
`locality_id`, `listing_status`.

`place_categories`: `id`, `name`, `slug`.

`localities`: `id`, `name`, `locality_type`.

If your Supabase schema uses different column names, update `src/lib/supabasePlaces.ts`.
