# TULAY implementation instructions

- For TULAY implementation/review, read .agents/skills/tulay-mvp/SKILL.md (or its identical .kiro/skills/tulay-mvp/SKILL.md mirror in Kiro).
- Keep both project skill copies identical after any scope update. Do not modify personal/global installed skills as part of repo changes.
- This is a structure-only starter until Next.js and database implementation are completed; do not present placeholders as functioning features.
- Keep the agreed Next.js, TypeScript, Tailwind, Supabase stack unless the team explicitly changes it.
- Build one mobile-first responsive website. Test phone, tablet, and desktop layouts. Prioritize accessible labels, keyboard use, readable text, and visible focus.
- Read docs/project-inputs.md, docs/responsive-design.md, and docs/api-contracts.md before implementation.
- Keep fictional registry/medical fixtures out of public/ and browser bundles. No real patient data.
- Match does not activate. Assigned clinic staff must approve activation in person. A QR/reference only locates a record.
- Existing mock YAKAP members confirm the registry clinic; other mock beneficiaries select a clinic. No verification scheduling.
- Clinic staff cannot prescribe. Assigned clinic doctors issue prescriptions for active patients. Pharmacy cannot activate/prescribe.
- Generate unique mock UPSCs on the backend. Lookup does not automatically authorize dispensing or consume the code.
- No exact stock counts, dispensed/remaining quantities, automatic slips, reimbursement, official integration, or diagnosis.
- Enforce roles/status/organization assignments on the server and through RLS. Never authorize with editable user metadata.
- Offline and actual SMS are optional. Label mock data and simulated SMS honestly.
- Run relevant build, type, lint, and access-control checks. Report implemented vs placeholder work accurately.


