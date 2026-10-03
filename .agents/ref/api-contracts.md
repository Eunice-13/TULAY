# Proposed integration contract ΓÇö agree before coding

The database migrations now define restricted RPC operations for matching, clinic selection, pending-record lookup, activation, prescription issuance, and UPSC lookup. They are prepared but not yet applied or verified on a Supabase project. Next.js route handlers may wrap them under src/app/api/. Supabase Auth can handle signup/login directly through properly configured clients. Agree on exact HTTP routes before implementation; do not create redundant APIs for every table.

All protected operations validate the authenticated user, trusted role, activation status, and organization/ownership. No operation accepts a caller-selected role as authorization.

| Operation | Proposed route | Authorized caller | Result/rule |
| --- | --- | --- | --- |
| Current profile | GET /api/me | Signed-in user | Own trusted role, status, assigned organization |
| Registry match | POST /api/beneficiary/match | Signed-in beneficiary during onboarding | Minimum match outcome; no arbitrary registry browsing |
| Select/confirm clinic | POST /api/beneficiary/clinic | Matched beneficiary | Assigned clinic confirmation or allowed mock selection; stays pending |
| Pending record lookup | POST /api/clinic/verification/lookup | Assigned clinic staff | Restricted record by random verification reference |
| Activation | POST /api/clinic/activation | Assigned clinic staff | Explicit approval, approving staff, timestamp |
| Issue prescription | POST /api/prescriptions | Assigned doctor | Active assigned patient; backend-generated mock UPSC |
| Own prescriptions | GET /api/prescriptions | Active beneficiary | Only caller's issued prescriptions |
| Pharmacy lookup | POST /api/pharmacy/prescriptions/lookup | Authorized pharmacy/dispensing staff | Exact mock UPSC; necessary fields only; not consumed |
| Find care | GET /api/facilities | Active beneficiary | Public facility details; no private registry fields |
| Medicine availability | GET /api/medicines/availability | Active beneficiary | Provider, medicine, status, last-updated time |
| Update availability | PATCH /api/medicines/availability | Authorized staff for that facility | Available/out_of_stock; no stock count |
| Subscribe | POST /api/restock-subscriptions | Active beneficiary | Own subscription to provider + medicine |
| Notifications | GET /api/notifications | Active beneficiary | Own notices; identify simulation honestly |

Use POST for code/reference lookups so identifiers need not appear in URLs/history. Add validation, rate limits and safe errors; method choice alone is not security. Return private results with no-store caching rules. Do not log identifiers, registry inputs, prescriptions, or secrets.

## Shared response shape

Success: { data: ... }. Failure: { error: { code: string, message: string } }. Shared type in src/types/domain.ts. Do not expose raw database errors or reveal which field matched another person's record.

Record matching handles case/whitespace and consistent dates, not fuzzy identity matching. Prevent duplicate claims of the same mock beneficiary. Restock transition and notification creation should be handled atomically/deduplicated; repeated Available updates do not create another event.


