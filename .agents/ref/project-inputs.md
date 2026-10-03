# Team inputs to fill before implementation

Keep secrets and demo passwords out of this file. All beneficiary records must be fictional.

## Project decisions ΓÇö Eunice

- Project name: TULAY
- Website format: mobile-first responsive website, one site for all roles
- Stack: Next.js + TypeScript + Tailwind + Supabase + Vercel
- Repository URL: TODO
- Submission deadline and timezone: TODO
- Required competition tools/evidence: TODO ΓÇö verify organizer rules
- Pitch/video time limit: TODO
- Brand colors, logo, typography: TODO
- Consultation scheduling: excluded unless separately approved and implemented
- Offline: optional saved public clinic information/instructions only; not yet implemented
- SMS: simulated by default; real integration only if confirmed and tested

## Public provider inputs ΓÇö JJ

For each fictional clinic/pharmacy: fixture ID, display name, kind, address, hours, public contact, optional coordinates. Clinic dispensing permission is explicit, not assumed for every clinic.

For each fictional medicine: fixture ID, generic name, strength, dosage form. For availability: provider ID, medicine ID, Available / Out of Stock, timestamp. No stock count.

## Private mock registry inputs ΓÇö JJ + Martin

For each fictional beneficiary: mock PhilHealth ID, first name, last name, birth date in YYYY-MM-DD format, nullable assigned clinic fixture ID. Null means the demo beneficiary has no assigned YAKAP clinic; not permission to self-activate.

Never place registry fixtures in public/ or import them into client-side components. Only narrowly authorized backend matching may use them.

## Provider accounts ΓÇö Martin

Prepare clinic staff, clinic doctor, another-clinic staff/doctor for negative tests, and pharmacy staff. Assign each a real Auth user ID, trusted role, and organization ID. Share credentials through a private channel; docs/private/ is ignored.

No public provider signup or real accreditation checks. Demo verified flags are not official accreditation.

## Configuration ΓÇö Martin + Dan

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


