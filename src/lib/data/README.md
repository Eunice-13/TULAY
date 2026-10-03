# Professional portal data layer (backend handoff)

All Doctor, Clinic Staff and Pharmacy screens (Figma Page 3) get data **only** through this folder. Pages and components never import `src/lib/preview/*` directly.

| File | What it is | What the backend does |
| --- | --- | --- |
| `queries.ts` | Server-only reads used by pages | Replace each body with an authorized Supabase/RLS query. Keep the signature. |
| `mutations.ts` | Server actions for writes and restricted lookups | Replace each `notConnected(...)` with the real call (RPCs in `supabase/migrations/*_restricted_operations.sql` or routes in `docs/api-contracts.md`). |
| `types.ts` | Request/response types not yet in `src/types/domain.ts` | Confirm, then move into `domain.ts` (shared file). |
| `result.ts` | `ApiResult` helpers and the `NOT_CONNECTED` code | Nothing. |

## How the UI reads a mutation result

Every mutation returns `ApiResult<T>` from `domain.ts`:

- `{ data }` shows the success screen with the real values, such as the generated UPSC or the activation time.
- `{ error: { code: "NOT_CONNECTED" } }` shows the same success screen with local values. Team decision: the demo presents as a finished product, and mock data is disclosed in the pitch. **This means a not-yet-connected write looks successful but saves nothing**, so search for `notConnected(` to see what is still unconnected.
- `{ error: { code, message } }` shows `message`, so keep messages safe for users.

Once a function returns real data, its screen works with no UI changes.

## Operations

| Function | Contract | Notes |
| --- | --- | --- |
| `signInProfessional` | Supabase Auth | Design uses username + staff ID + password. Resolve to email server-side; return `next` from the trusted role. |
| `selectWorkplace` | — | Preview uses a cookie. Replace with the server-side clinic assignment. |
| `issuePrescription` | POST /api/prescriptions | `IssuePrescriptionRequest`; backend generates the UPSC. File attachment not in contract yet. |
| `lookupPrescription` | POST /api/pharmacy/prescriptions/lookup | Returns `PrescriptionLookupResponse` plus proposed `mockPhilHealthId` and `attachmentFileName`. Never consumes the code. |
| `lookupVerificationReference` | POST /api/clinic/verification/lookup | Returns `PendingBeneficiaryLookup`. |
| `activateBeneficiary` | POST /api/clinic/activation | Returns `ActivateBeneficiaryResponse`. |
| `denyActivation` | **Proposed** | In the design (CS2D), not in the contract. |
| `updateAvailability` | PATCH /api/medicines/availability | `available` / `out_of_stock` only. Dedupe restock alerts. |
| `updateStaffProfile`, `changePassword`, `updateFacilityProfile` | **Proposed** | Not in the contract. |

Appointments, time slots, referrals and benefit estimate are **mock-only** (approved as labelled mock UI). They have read functions in `queries.ts` but no writes.

## Still to do for launch

- Each workspace layout (`src/app/(doctor|clinic|pharmacy)/*/layout.tsx`) must call `requireRole(...)` from `src/lib/auth/guards.ts`.
- Remove `getPreviewHints()` and the demo cookie in `src/lib/preview/session.ts`.
- Delete `src/lib/preview/` once nothing imports it.
