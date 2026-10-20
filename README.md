# NutriTrack

A nutrition-management web prototype that brings dietitian, client, clinic-assistant, and admin workflows into one interface.

[Open the demo](https://nutri-track-nu-hazel.vercel.app)

## Features

- Four switchable role dashboards for exploring different clinic workflows.
- Client profiles, diet plans, meal logs, and a food/alternative-product database.
- Appointment and payment-record views.
- Supabase data access with bundled mock-data fallback for exploration.

The role selector is a demonstration mechanism. It does not implement authenticated role-based access, and payment records do not establish a live payment integration. Use sample data when exploring the prototype.

## Stack

React 19, TypeScript, Vite, Tailwind CSS, and Supabase.

## Run locally

```bash
git clone https://github.com/ceylanal/NutriTrack.git
cd NutriTrack
npm ci
npm run dev
```

The development server runs on port **3000**. The interface starts with bundled sample data and retains it when Supabase is unavailable or empty.

To connect your own Supabase project, create `.env.local`:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Review [supabase_setup.sql](supabase_setup.sql) before applying it to your own database. The frontend reads the two `VITE_` variables above; they are public client configuration, so a server-only service-role key must not be used here.

## Checks and build

```bash
npm run lint
npm run build
npm run preview
```

`lint` runs TypeScript checking. The production build is written to `dist/`.

## Repository map

| Path | Purpose |
| --- | --- |
| `src/components/` | Role dashboards and shared interface components |
| `src/lib/` | Supabase client, data access, and database types |
| `src/mockData.ts` | Sample data used by the prototype |
| `src/types.ts` | Domain models |
| `supabase_setup.sql` | Database setup script |

## Development context

The project started in Google AI Studio and has been adapted around nutrition and clinic workflows. This repository is a product prototype; deployment and data-access controls need review before use with real client information.
