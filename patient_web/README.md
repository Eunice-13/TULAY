# TULAY — Patient Web

The patient-facing **web** app for TULAY (YAKAP-GAMOT). Mobile-first,
built with Next.js + Tailwind, sharing the same Supabase project and
design tokens as the staff web app in the repo root.

> Sibling app. The staff/doctor/pharmacy web app lives in the repo root.
> The patient **mobile** app lives in `patient_mobile/` (built separately).

## Getting started

```bash
npm install
cp .env.example .env.local   # use the same Supabase project as the staff app
npm run dev                  # http://localhost:3100
```

Run on a dedicated port so it doesn't clash with the staff app:

```bash
npm run dev -- -p 3100
```

## Stack

Next.js 16 · React 19 · Tailwind CSS 4 · Supabase (shared project).
