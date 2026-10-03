# TULAY (YAKAP-GAMOT)

A demo platform that bridges beneficiaries to covered medicines: register,
get activated by a clinic, receive a laboratory referral when the clinic cannot
cover a service, find covered medicines, receive a prescription with a unique
code, and locate a pharmacy with live stock status.

> All data in this project is **mock / fictional**. No real PII or
> government integration.

## Tech stack

- Next.js (App Router) + TypeScript
- Supabase (Postgres, Auth, RLS, Edge Functions)
- Tailwind CSS
- Leaflet (provider map)

## Project structure

```
tulay/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # landing + "What is YAKAP-GAMOT?"
│   │   ├── (public)/
│   │   │   ├── eligibility-guide/
│   │   │   ├── directory/          # provider list + Leaflet map
│   │   │   └── facilities/[id]/    # facility profile
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── onboarding/
│   │   │   ├── philhealth/         # mock info form + match result
│   │   │   ├── clinic/             # select (new) or confirm (existing)
│   │   │   └── pending/            # status, verification reference/QR
│   │   ├── (patient)/              # Active beneficiaries only
│   │   │   ├── dashboard/
│   │   │   ├── medicines/          # formulary checker
│   │   │   ├── prescriptions/[id]/ # My Prescriptions + UPSC + reminder
│   │   │   ├── pharmacy-finder/
│   │   │   ├── access-plan/
│   │   │   ├── notifications/
│   │   │   ├── benefit-balance/    # optional
│   │   │   └── referrals/          # own laboratory-referral records
│   │   ├── (clinic)/clinic/
│   │   │   ├── dashboard/
│   │   │   ├── activations/        # reference entry + Activate Account
│   │   │   ├── appointments/       # only if scheduling stays in scope
│   │   │   ├── availability/
│   │   │   └── profile/
│   │   ├── (doctor)/doctor/
│   │   │   ├── patients/
│   │   │   └── prescriptions/new/
│   │   │   └── referrals/          # laboratory referral form
│   │   ├── (pharmacy)/pharmacy/
│   │   │   ├── dashboard/          # stock toggles + facility profile
│   │   │   └── lookup/             # enter UPSC
│   │   └── api/                    # thin route handlers if not using Edge Functions
│   │
│   ├── features/                   # one folder per capability
│   │   ├── auth/
│   │   ├── registration/
│   │   ├── activation/
│   │   ├── directory/
│   │   ├── formulary/
│   │   ├── availability/
│   │   ├── prescriptions/
│   │   ├── restock-alerts/
│   │   ├── access-plan/
│   │   └── referrals/
│   │
│   ├── components/
│   │   ├── ui/                     # Button, Input, Card, Badge, Modal
│   │   ├── layout/                 # AppShell, role navbars, bottom nav (mobile)
│   │   ├── map/                    # Leaflet wrapper (dynamic import, ssr: false)
│   │   └── feedback/               # StatusBadge, TrustLabel, ProtectedAccessMessage, etc.
│   │
│   ├── lib/                        # Authentication/Supabase helpers
│   └── types/                      # Shared data definitions
├── supabase/
│   ├── migrations/
│   └── fixtures/                   # Fictional input examples
├── docs/                           # Inputs, contracts, pitch/demo
├── tests/                          # Acceptance checklist
└── public/                         # Public icons/images only
```

## Roles

`beneficiary` · `clinic staff` · `doctor` · `pharmacy`.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase values
npm run dev
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — lint
