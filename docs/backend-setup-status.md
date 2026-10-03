# Martin backend setup status

Updated: 2026-10-03

## Prepared locally

- [x] Blank environment-variable template with browser-safe and server-only names.
- [x] Versioned core schema/RLS migration: `supabase/migrations/202610030001_core_schema.sql`.
- [x] Versioned restricted-operations migration: `supabase/migrations/202610030002_restricted_operations.sql`.
- [x] Idempotent fictional seed script: `supabase/seed.sql`.
- [x] Shared request/response types in `src/types/domain.ts`.
- [x] Restricted database operations prepared for matching, clinic selection, pending lookup, activation, prescription issuance, and exact mock-UPSC lookup.
- [x] Restock transition trigger prepared with duplicate prevention.

## Awaiting project creation

- [ ] Confirm the Supabase organization and region.
- [ ] Review and confirm the project cost returned by Supabase.
- [ ] Create the TULAY Supabase project and wait until healthy.
- [ ] Apply both migrations in order.
- [ ] Run the fictional seed script.
- [ ] Retrieve project URL and active publishable key into untracked `.env.local`.
- [ ] Generate `src/types/database.generated.ts` from the live schema.
- [ ] Run security and performance advisors; fix relevant findings.
- [ ] Provision private demo Auth accounts and assign trusted provider roles/facilities server-side.
- [ ] Run positive and negative role tests from `tests/acceptance.md`.

Nothing in the local migration files is considered deployed or verified until the live-project steps pass. Never commit `.env.local`, passwords, secret keys, or real patient records.


