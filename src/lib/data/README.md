# Professional portal data layer (backend handoff)

All Doctor, Clinic Staff and Pharmacy screens (Figma Page 3) get data **only** through this folder. Pages and components never import `src/lib/preview/*` directly.

| File | What it is | What the backend does |
| --- | --- | --- |
| `queries.ts` | Server-only reads used by pages | Core identity, facility and activation reads use Supabase; explicitly mock-only demo screens retain fixtures. |
| `mutations.ts` | Server actions for writes and restricted lookups | Auth, activation, prescription and availability operations delegate to role-checked server actions. |
| `types.ts` | Request/response types not yet in `src/types/domain.ts` | Confirm, then move into `domain.ts` (shared file). |
| `result.ts` | `ApiResult` helpers and the `NOT_CONNECTED` code | Nothing. |

## How the UI reads a mutation result

Every mutation returns `ApiResult<T>` from `domain.ts`:

- `{ data }` shows the success screen with the real values, such as the generated UPSC or the activation time.
- `{ error: { code: "NOT_CONNECTED" } }` identifies an explicitly preview-only operation and must remain visibly unsaved.
- `{ error: { code, message } }` shows `message`, so keep messages safe for users.

Once a function returns real data, its screen works with no UI changes.

## Operations

| Function | Contract | Notes |
| --- | --- | --- |
| `signInProfessional` | Supabase Auth | Email/password is verified, then `next` comes from the trusted profile role. |
| `selectWorkplace` | — | Compatibility route that accepts only the facility already stored on the trusted profile. |
| `issuePrescription` | POST /api/prescriptions | `IssuePrescriptionRequest`; backend generates the UPSC. File attachment not in contract yet. |
| `lookupPrescription` | POST /api/pharmacy/prescriptions/lookup | Returns `PrescriptionLookupResponse` plus proposed `mockPhilHealthId` and `attachmentFileName`. Never consumes the code. |
| `lookupVerificationReference` | POST /api/clinic/verification/lookup | Returns `PendingBeneficiaryLookup`. |
| `activateBeneficiary` | POST /api/clinic/activation | Returns `ActivateBeneficiaryResponse`. |
| `denyActivation` | **Proposed** | In the design (CS2D), not in the contract. |
| `updateAvailability` | PATCH /api/medicines/availability | `available` / `out_of_stock` only. Dedupe restock alerts. |
| `updateStaffProfile`, `changePassword`, `updateFacilityProfile` | **Proposed** | Not in the contract. |

Appointments, time slots and benefit estimates are **mock-only** and must remain labelled as demo data. Laboratory referral creation has its own connected doctor server action.

## Remaining preview-only scope

- Activation denial and account/facility settings do not have approved MVP database contracts.
- Appointments and time-slot management remain presentation fixtures.
- `getPreviewHints()` exists only to make fictional demo codes discoverable; remove it when seeded demo references are supplied another way.
