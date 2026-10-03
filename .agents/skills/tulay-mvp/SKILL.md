---
name: tulay-mvp
description: Build or review TULAY's hackathon web app, including beneficiary registration, walk-in clinic activation, role permissions, mock prescriptions and UPSC lookup, medicine availability, and restock notifications. Apply the team's agreed MVP boundaries when implementing frontend or backend features.
---

# TULAY MVP

## Product and delivery

TULAY is a patient-facing healthcare-access prototype for a 10-12 hour hackathon. Use fictional records and clearly labeled demo data. Follow the existing project stack and styling; do not migrate frameworks to use a skill. This repository's agreed stack is Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/Postgres, and Vercel. Keep the beneficiary interface mobile-first and usable on tablets and desktop. Kiro is the development assistant, not the application backend.

## Account roles

Three primary groups: beneficiary, clinic, pharmacy. Clinic has separate staff and doctor accounts linked to a clinic. Provider accounts are pre-created and marked verified for demo purposes; provider accreditation verification and onboarding are outside scope. One login page can route users to their dashboard using trusted account roles and organization assignments.

- Beneficiary: public registration, own activation status and verification QR; after activation, own prescriptions, care/medicine search, and restock notifications.
- Clinic staff: view pending patients assigned to their clinic, verify in person, and activate TULAY accounts. Cannot issue prescriptions.
- Doctor: view relevant patients at the assigned clinic and issue mock prescriptions only for active beneficiaries assigned to that clinic.
- Pharmacy staff: retrieve a prescription by exact mock UPSC through a restricted lookup, review beneficiary details needed for the transaction, and update their pharmacy's medicine availability. Cannot activate accounts or issue prescriptions.
- A clinic with a demo dispensing service may grant designated staff the dispensing lookup and availability permissions. Do not grant every clinic user every role.

## Beneficiary activation

Compare submitted mock PhilHealth ID, birth date, and names against a seeded mock registry. Normalize ordinary whitespace/case and dates consistently; do not use fuzzy identity matching. Reject a mismatch without revealing another record's personal information. Prevent multiple accounts claiming the same seeded beneficiary record.

After matching, support two paths:

1. Not registered with a YAKAP clinic: select a demo clinic for mock enrollment.
2. Already registered: display and confirm the clinic assigned in the seeded registry; do not allow switching through registration.

The account remains pending. Display clinic address, operating hours if seeded, a verification QR/reference, walk-in instructions, and logout. Verification appointment scheduling is removed. Pending accounts cannot access main beneficiary features, including via direct API calls.

The verification QR contains a random lookup reference, not personal information. Assigned clinic staff scans or enters the reference, reviews the record in person, and explicitly approves activation. Record approving staff and activation time. A match or QR scan never activates an account automatically. Actual YAKAP enrollment and clinic transfers are outside scope.

## Mock prescriptions

The authorized doctor opens an assigned active patient's record and saves/issues a structured mock prescription. Link it to patient, issuing doctor, and clinic. The backend generates a random mock UPSC such as `DEMO-UPSC-A7K9Q2`, enforces a unique constraint, and retries on collision. Patients and pharmacy users cannot issue prescriptions or set codes themselves.

An issued prescription appears in Medicines > My Prescriptions for its beneficiary. Refresh/open-page fetching is sufficient; realtime updates are optional. Keep draft prescriptions private to their authorized authoring workflow. A prescription can contain the doctor's prescribed quantities and instructions, but the app does not track stock counts, quantities dispensed, or quantities remaining.

Pharmacy staff enters the mock UPSC to retrieve and review the prescription. A code is a lookup identifier, not automatic proof of authenticity or authorization to dispense. It is reusable for viewing; do not mark it consumed when entered or viewed. No automatic medicine-release or duplicate-claim prevention logic is included.

Include the patient-facing reminder: "If the full prescribed medicine is unavailable, ask dispensing staff for a note/slip stating what was provided and what is still needed. Keep your prescription and mock UPSC for your next visit." Staff provides this note manually outside the app; there is no automatic dispensing slip.

Official UPSCs and prescription validation belong to GAMOT. TULAY's codes and provider verification flags are demo-only, with no official integration.

## Medicine availability and notifications

Store per-provider/per-medicine status as Available or Out of Stock, with last-updated time. No exact inventory count, stock reservation, dispensing ledger, or remaining-quantity calculation. Explain that availability can change before arrival.

Notify subscribed active beneficiaries when a tracked provider/medicine changes from Out of Stock to Available. Repeated saves of Available must not resend an alert. Use in-app notifications and explicitly simulated SMS by default. Actual SMS is an optional integration only when trial access is confirmed; keep credentials on the server and distinguish simulated, queued, delivered, and failed states honestly.

## Frontend and integration

Use the agreed beneficiary tabs Home, Find Care, Medicines, Appointments, Profile only for implemented features; verification scheduling stays excluded. If consultation appointments are not implemented, do not invent their functionality. Use clear labels, accessible forms and focus states, readable status text, loading/empty/error states, and layouts that work around 360px, 768px, and desktop widths. Keep sensitive patient details off public provider-search pages.

Agree on shared types and API contracts before connecting the dashboards. Preserve real backend state across reloads rather than using UI-only role toggles or fake success messages. Keep signup/login controls separate from clinic activation status.

## Backend access rules

Enforce permissions in the backend and RLS, not only by hiding buttons. Store clinic/pharmacy assignments, roles, and activation state where ordinary users cannot edit them. Do not authorize using client-supplied roles or user-editable auth metadata. Patients read only their records; clinic users access assigned patients; pharmacy users cannot browse all prescriptions or the beneficiary registry.

Implement exact-code pharmacy lookup through a narrowly authorized backend operation that returns only required fields. Use standard cryptographic randomness for codes. Keep service-role keys out of frontend bundles. Enable and verify RLS for exposed data and private file access where applicable. Preserve existing data and use versioned schema changes.

## Verify before handoff

Test the full demo path: registration and both clinic paths, pending lock, staff activation, doctor issuance, patient viewing, pharmacy lookup, availability update, restock notification. Also test mismatched registry details, another clinic issuing a prescription, patient viewing another patient's record, pharmacy issuing a prescription, invalid mock UPSC, repeat availability updates, and direct API access by pending users. Run project build, type checks, and relevant lint/tests. Review mobile and desktop layout. Report which checks actually ran.

## Scope boundaries

Do not reintroduce verification scheduling, exact inventory counts, dispensed/remaining quantity tracking, automatic dispensing slips, single-use prescription claims, reimbursement/payments, accreditation verification, official PhilHealth/GAMOT integration, or clinical diagnosis. CHW screening/referral, if separately requested or already implemented, supports navigation and referral tracking; it does not diagnose or activate accounts. Follow newer explicit team decisions if the scope changes.

## Skill routing

When separately installed and relevant, use frontend-design for visual work, vercel-react-best-practices for React implementation, web-design-guidelines for accessibility review, supabase for integration, supabase-postgres-best-practices for SQL/RLS, webapp-testing for browser checks, and deploy-to-vercel for an authorized preview deployment. A skill does not grant credentials or establish an MCP connection. Preserve TULAY's scope when applying general-purpose guidance.

## Repository workflow

This repository is initially a structure/template package, not a runnable app. Do not claim placeholder routes or permissions work. Read AGENTS.md and the relevant docs/project-inputs.md, docs/responsive-design.md, docs/api-contracts.md, and docs/build-checklist.md from the repository root before implementation. Keep phone-first layouts shared with tablet/desktop enhancements; do not create separate sites or a native mobile app.

Limited offline support is optional: start with explicitly saved public clinic information and instructions, label stale content, and explain that initial loading requires internet. Keep activation, prescription issuance/lookup, and fresh availability online. Do not blanket-cache authenticated responses or private records.

The canonical project copy is .agents/skills/tulay-mvp/SKILL.md. The .kiro/skills/tulay-mvp/SKILL.md copy is its identical portable mirror for Kiro. Maintain both together; do not change globally installed skills as part of repository edits.



