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

## Live Supabase project completed

- [x] Created `TULAY` in Mateeoow's Org, Singapore (`ap-southeast-1`), project ref `uropffsfqyhhgkxnkxrd`.
- [x] Confirmed project cost: $0/month at creation time.
- [x] Applied `core_schema`, `restricted_operations`, and `add_foreign_key_indexes` migrations.
- [x] Loaded the fictional seed script: 3 facilities, 2 medicines, and 2 private mock registry records.
- [x] Saved the project URL and active publishable key in ignored `.env.local`; no privileged key is stored.
- [x] Generated `src/types/database.generated.ts` from the live schema.
- [x] Ran security and performance advisors.
- [x] Verified all 9 public application tables have RLS, anonymous callers cannot execute sensitive RPCs, and neither anonymous nor ordinary authenticated callers can read the private registry directly.

## Advisor notes

- Supabase warns that six authenticated RPCs use `SECURITY DEFINER`. This is intentional: each RPC validates the authenticated user and trusted database role, facility/ownership assignment, and account state before touching otherwise inaccessible records.
- All missing foreign-key index findings were fixed in the third migration.
- Newly created indexes are reported as unused because the project has not received application traffic yet. Reassess after realistic demo usage rather than removing them immediately.

## Still pending

- [ ] Provision private demo Auth accounts and assign trusted provider roles/facilities server-side.
- [ ] Run positive and negative role tests from `tests/acceptance.md`.
- [ ] Dan reviews and agrees to the shared contracts in `src/types/domain.ts`, `src/types/database.generated.ts`, and `docs/api-contracts.md`.
- [ ] Add the framework dependencies and Supabase browser/server clients after the Next.js package setup exists.

The schema and seed data are deployed. Full workflow verification still depends on provisioned demo Auth accounts and role-based tests. Never commit `.env.local`, passwords, secret keys, or real patient records.


