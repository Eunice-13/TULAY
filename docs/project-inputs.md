# Team inputs to fill before implementation

Keep secrets and demo passwords out of this file. All beneficiary records must be fictional.

## Project decisions — Eunice

- Project name: TULAY
- Website format: mobile-first responsive website, one site for all roles
- Stack: Next.js + TypeScript + Tailwind + Supabase + Vercel
- Repository URL: TODO
- Submission deadline and timezone: TODO
- Required competition tools/evidence: TODO — verify organizer rules
- Pitch/video time limit: TODO
- Brand colors, logo, typography: TODO
- Consultation scheduling: excluded unless separately approved and implemented
- Offline: optional saved public clinic information/instructions only; not yet implemented
- SMS: simulated by default; real integration only if confirmed and tested

## Public provider inputs — JJ

For each fictional clinic/pharmacy: fixture ID, display name, kind, address, hours, public contact, optional coordinates. The current demo uses `Demo Bayanihan YAKAP Clinic`, `Demo Malasakit YAKAP Clinic`, and `Demo Lingap GAMOT Partner Pharmacy`. These are fictional demo facilities, not claims of accreditation. Clinic dispensing permission is explicit, not assumed for every clinic. New YAKAP enrollment uses the facility coordinates for a 15 km proximity rule; browser coordinates are used transiently and are not stored.

For each fictional medicine: fixture ID, generic name, coverage group, strength, and dosage form. The seed contains 75 official generic-name categories: 21 `yakap_essential_21` medicines dispensed at YAKAP clinics and 54 `gamot_additional_54` medicines available through partner pharmacies. Because the source list is category-level rather than a product SKU list, the demo labels strength as `Varies by preparation` and dosage form as `See prescription`. For availability: provider ID, medicine ID, Available / Out of Stock, timestamp. No stock count.

## Private mock registry inputs — JJ + Martin

For each fictional beneficiary: mock PhilHealth ID, first name, last name, birth date in YYYY-MM-DD format, nullable assigned clinic fixture ID. Null means the demo beneficiary has no assigned YAKAP clinic; not permission to self-activate.

Never place registry fixtures in public/ or import them into client-side components. Only narrowly authorized backend matching may use them.

## Laboratory referral inputs — Eunice + JJ

Use fictional laboratory service names, destination text, and referral reasons. A doctor may create a referral when the assigned YAKAP clinic cannot cover or complete the laboratory service. The referral is a navigation record only; do not imply diagnosis, hospital acceptance, test completion, or a live hospital integration.

## Provider accounts — Martin

Prepare clinic staff, clinic doctor, another-clinic staff/doctor for negative tests, and pharmacy staff. Assign each a real Auth user ID, trusted role, and organization ID. Share credentials through a private channel; docs/private/ is ignored.

No public provider signup or real accreditation checks. Demo verified flags are not official accreditation.

## Configuration — Martin + Dan

- Supabase URL and publishable key: .env.local
- Server-only secret, only if needed: .env.local or deployment secret settings
- Auth redirects/site URL: actual local and deployed URLs
- Vercel demo URL: TODO
- Environment owner and backup operator: TODO

## Before frontend/backend integration

- Confirm field casing and domain types in src/types/domain.ts.
- Confirm operations/error responses in docs/api-contracts.md.
- Dan owns page files; Martin owns backend and database files.
- Both coordinate changes to shared types and dependency/config files.


