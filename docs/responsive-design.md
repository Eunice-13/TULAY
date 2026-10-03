# Mobile-first responsive website — Dan

This is one website, one set of routes, and one backend. Layout adapts to available width; it does not select a different application based on device type.

## Design and folder mapping

- src/components/ui/: shared buttons, inputs, status badges, dialogs.
- src/components/layout/: page containers, adaptive navigation, header, sidebar/bottom-nav variants driven by CSS.
- src/features/: domain-specific forms/cards; do not duplicate phone/desktop business logic.
- src/app/: thin page/layout composition. Keep session/role enforcement server-side, not in a client navigation toggle.

## Layout rules

- Default narrow-screen styles: single column, readable text, full-width forms, no unintended horizontal scrolling.
- Apply Tailwind responsive variants to enhance the layout at larger widths. Exact breakpoints should match the generated Tailwind configuration.
- Patient navigation: Home, Find Care, Medicines, Profile. Restock notices may live in Home. No nonworking Appointments tab.
- Phone navigation may use an accessible bottom bar; tablet/desktop can use a sidebar/header with the same destinations. Keep fixed navigation from covering content or the keyboard.
- Clinic/pharmacy workflows must work on phones too. On desktop, use the extra width for patient lists, forms, and prescription details.
- Use cards or deliberate scroll regions for wide provider tables. Never hide necessary information just to fit the screen.
- Label every input; provide field errors, visible focus, loading/empty/error states, and practical touch targets (aim for 44 x 44 CSS px or larger).
- Do not rely on color alone for Pending, Active, Available, or Out of Stock.
- Avoid hover-only actions; test keyboard access and text zoom.

## Test widths

Check at approximately 360px phone, 768px tablet, and 1280px desktop, plus an actual phone. Verify forms, long names, keyboard opening, navigation, and prescription lookup. These are test widths, not required Tailwind breakpoint definitions.

## Offline is separate

Responsive design does not imply offline access. Optional service-worker caching must be implemented/tested separately. Start with public clinic information and instructions; never blanket-cache authenticated API responses, registry data, activation operations, or prescriptions. Explain initial online loading and stale timestamps.


