# Proposed integration contract — agree before coding

The database migrations define restricted RPC operations for matching, nearby-clinic discovery, clinic selection, pending-record lookup, activation, prescription issuance, and UPSC lookup. They are applied and verified on the TULAY Supabase project. Next.js Server Actions currently call the RPCs directly; route handlers may wrap them later if the frontend needs an HTTP boundary. Supabase Auth handles signup/login through the configured server/browser clients. Do not create redundant APIs for every table.

All protected operations validate the authenticated user, trusted role, activation status, and organization/ownership. No operation accepts a caller-selected role as authorization.

| Operation | Proposed route | Authorized caller | Result/rule |
| --- | --- | --- | --- |
| Current profile | GET /api/me | Signed-in user | Own trusted role, status, assigned organization |
| Registry match | POST /api/beneficiary/match | Signed-in beneficiary during onboarding | Minimum match outcome; no arbitrary registry browsing |
| List nearby clinics | POST /api/beneficiary/clinics/nearby | Matched Pending beneficiary | Demo YAKAP clinics within 15 km of transiently supplied coordinates; no coordinates are stored |
| Select/confirm clinic | POST /api/beneficiary/clinic | Matched beneficiary | Existing YAKAP member may confirm only the registry-assigned clinic; a new enrollee must select a nearby clinic within 15 km; stays pending |
| Pending record lookup | POST /api/clinic/verification/lookup | Assigned clinic staff | Restricted record by random verification reference |
| Activation | POST /api/clinic/activation | Assigned clinic staff | Explicit approval, approving staff, timestamp |
| Issue prescription | POST /api/prescriptions | Assigned doctor | Active assigned patient; backend-generated mock UPSC |
| Own prescriptions | GET /api/prescriptions | Active beneficiary | Only caller's issued prescriptions |
| Pharmacy lookup | POST /api/pharmacy/prescriptions/lookup | Authorized pharmacy/dispensing staff | Exact mock UPSC; necessary fields only; not consumed |
| Find care | GET /api/facilities | Active beneficiary | Public facility details; no private registry fields |
| Medicine catalog | GET /api/medicines/catalog | Active beneficiary, assigned doctor, or pharmacy staff | 75 generic-name categories grouped as 21 YAKAP clinic medicines and 54 partner-pharmacy medicines |
| Medicine availability | GET /api/medicines/availability | Active beneficiary | Provider, medicine, status, last-updated time |
| Update availability | PATCH /api/medicines/availability | Authorized staff for that facility | Available/out_of_stock; no stock count |
| Subscribe | POST /api/restock-subscriptions | Active beneficiary | Own subscription to provider + medicine |
| Notifications | GET /api/notifications | Active beneficiary | Own notices; identify simulation honestly |

Use POST for code/reference lookups so identifiers need not appear in URLs/history. Add validation, rate limits and safe errors; method choice alone is not security. Return private results with no-store caching rules. Do not log identifiers, registry inputs, prescriptions, or secrets.

## Shared response shape

Success: { data: ... }. Failure: { error: { code: string, message: string } }. Shared type in src/types/domain.ts. Do not expose raw database errors or reveal which field matched another person's record.

Record matching handles case/whitespace and consistent dates, not fuzzy identity matching. Prevent duplicate claims of the same mock beneficiary. Geolocation is a convenience/proximity check, not proof of residence; clinic staff still perform in-person verification and activation. Restock transition and notification creation should be handled atomically/deduplicated; repeated Available updates do not create another event.


