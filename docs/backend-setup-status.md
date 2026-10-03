# Martin backend setup status

Updated: 2026-10-04

## Prepared locally

- [x] Blank environment-variable template with browser-safe and server-only names.
- [x] Versioned core schema/RLS migration: `supabase/migrations/202610030001_core_schema.sql`.
- [x] Versioned restricted-operations migration: `supabase/migrations/202610030002_restricted_operations.sql`.
- [x] Versioned coverage/proximity migration: `supabase/migrations/20261003200105_add_medicine_groups_and_clinic_proximity.sql`.
- [x] Versioned laboratory-referral migrations: `supabase/migrations/20261004100000_add_laboratory_referrals.sql`, `supabase/migrations/20261004100001_referral_policy_indexes.sql`, and `supabase/migrations/20261004100002_harden_laboratory_referral_rpc.sql`.
- [x] Idempotent fictional seed script: `supabase/seed.sql`.
- [x] Shared request/response types in `src/types/domain.ts`.
- [x] Restricted database operations prepared for matching, nearby-clinic discovery, clinic selection, pending lookup, activation, prescription issuance, and exact mock-UPSC lookup.
- [x] Next.js browser/server clients, session proxy, authentication actions, and trusted role guards.
- [x] Server Actions for beneficiary onboarding, clinic activation, prescriptions, availability, subscriptions, and notifications.
- [x] Doctor laboratory-referral action for active same-clinic patients, with beneficiary read access and no external-provider integration.
- [x] Role-guarded medicine-catalog actions for active beneficiaries, assigned doctors, and pharmacy staff.
- [x] Restock transition trigger with duplicate prevention and clearly labeled simulated-SMS output.

## Live Supabase project completed

- [x] Created `TULAY` in Mateeoow's Org, Singapore (`ap-southeast-1`), project ref `uropffsfqyhhgkxnkxrd`.
- [x] Confirmed project cost: $0/month at creation time.
- [x] Applied `core_schema`, `restricted_operations`, `add_foreign_key_indexes`, and `add_simulated_sms_restock_notifications` migrations.
- [x] Loaded the fictional seed script: 2 fictional YAKAP clinics, 1 fictional GAMOT partner pharmacy, 75 medicine categories (21 YAKAP + 54 partner-pharmacy), and 2 private mock registry records.
- [x] Saved the project URL and active publishable key in ignored `.env.local`; no privileged key is stored.
- [x] Generated `src/types/database.generated.ts` from the live schema.
- [x] Ran security and performance advisors.
- [x] Verified all 9 public application tables have RLS, anonymous callers cannot execute sensitive RPCs, and neither anonymous nor ordinary authenticated callers can read the private registry directly.
- [x] Provisioned confirmed beneficiary, clinic-staff, doctor, and pharmacy-staff demo Auth accounts with trusted roles and facility assignments.
- [x] Verified match → Pending → clinic activation with an activation audit record.
- [x] Verified doctor issuance → unique mock UPSC → reusable pharmacy lookup while direct pharmacy table access remains blocked.
- [x] Verified out-of-stock subscription → Available transition → one in-app and one simulated-SMS notification, with no duplicate on repeated Available saves.
- [x] Verified new-enrollee clinic selection requires coordinates and a clinic within 15 km; existing members remain limited to their assigned clinic.
- [x] Added the laboratory-referral table, RLS policies, and doctor-only creation RPC; referrals remain navigation records rather than diagnoses or hospital connections.

## Advisor notes

- Supabase warns that six authenticated RPCs use `SECURITY DEFINER`. This is intentional: each RPC validates the authenticated user and trusted database role, facility/ownership assignment, and account state before touching otherwise inaccessible records.
- The RPC grants were rechecked after testing: `anon` cannot execute them, while signed-in callers reach the functions and are then checked by trusted role, facility, ownership, and account-state rules.
- All missing foreign-key index findings were fixed in the third migration.
- Newly created indexes are reported as unused because the project has not received application traffic yet. Reassess after realistic demo usage rather than removing them immediately.
- Leaked-password protection is currently disabled for this demo project; use fictional accounts and stronger private demo passwords.

## Still pending

- [ ] Complete the remaining negative-role tests from `tests/acceptance.md`.
- [ ] Dan reviews and agrees to the shared contracts in `src/types/domain.ts`, `src/types/database.generated.ts`, and `docs/api-contracts.md`.
- [ ] Dan wires the nearby-clinic action to the enrollment UI and displays the returned distance and 15 km limit.
- [ ] Dan wires the doctor referral form and beneficiary referral view to the completed Server Actions.
- [ ] Connect Dan's responsive pages and forms to the completed Server Actions.
- [ ] Test the integrated UI on phone, tablet, and desktop, then repeat the role tests against the deployed link.

The schema, seed data, role accounts, and core backend workflows are deployed and verified. Frontend integration, remaining negative-role checks, and deployed-device testing are still pending. Never commit `.env.local`, passwords, secret keys, or real patient records.


