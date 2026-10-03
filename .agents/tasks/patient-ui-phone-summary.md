# PATIENT-UI-PHONE build summary

Figma: `ttDrSONMlfEWIxvZsrp2Hz`, page `199:3307` (61 frames). Stack: Next.js 15 App Router, React 19, TypeScript, Tailwind v4.

## Verification
- `npm run typecheck`, `npm run lint`, `npm run build`: pass (63 static/SSG pages + dynamic routes).
- Playwright smoke run of 58 routes at 390×844 and 1280×800: all 200, no console errors, no broken images, no horizontal overflow.
- Visual comparison against Figma screenshots done for: dashboard (390/320 ref), active clinic profile, active guides, active filters/map, edit dependents (pending), settings (pending), SMS On. Other screens were built from `get_design_context` output but not screenshot-compared one by one.

## Tokens (`src/app/globals.css` `@theme`)
surface #fff · primary/action/primary-700 #0c1431 · muted #465961 · teal #1f5e65 · success/soft #a4cbdb · canvas/tertiary-100 #dbeaf1 · secondary-400 #647d88 · grey-200 #c3c3c5 · danger #c62828 · positive #15803d · Inter (next/font) 12/14/16/20/24 px, line-height 1.45 (20px: 1.2) · radius 12px (`rounded-tulay`) · header 68px · bottom nav 76px · spacing = Tailwind 4px scale (Figma space-4…24).

## Frame → route
| Frame | Route |
|---|---|
| Start • Membership choice | `/` |
| Log in | `/login` |
| P0 What is TULAY? | `/what-is-tulay` |
| Menu • Before login | `/menu` |
| P1 Registration / Membership category / Birth date calendar / Dependents | `/register`, `/register/membership-category`, `/register/birth-date`, `/register/dependents` |
| P1 Edit dependents • Active / • Pending | `/account/dependents`, `/onboarding/dependents` |
| P2 Mock record matching / Match needs review | `/onboarding/philhealth`, `?result=review` |
| Pending • Next steps / Protected access | `/onboarding/pending`, `/onboarding/protected` |
| P3 Select clinic / Clinic profile / Walk-in plan / Pending filters / Pending map | `/onboarding/clinic`, `/[id]`, `/[id]/plan`, `/filters`, `/map` |
| P4 guides (public) / (active) | `/eligibility-guide{,/benefits,/enrollment}`, `/guide{,/benefits,/enrollment}` |
| P6 Active dashboard (+320/430) | `/dashboard` (fluid) |
| P3 Provider directory / Search filters / Provider map / Active clinic profile | `/directory`, `/directory/filters`, `/directory/map`, `/facilities/[id]` |
| P4 Formulary checker | `/medicines` |
| P5 Book / Visit type / Date & time / Confirmed | `/appointments`, `/visit-type`, `/schedule`, `/confirmed` |
| P7 E-reseta list / details / full-screen QR | `/prescriptions`, `/prescriptions/[id]`, `/prescriptions/[id]/qr` |
| P3 Pharmacy finder / profile / insufficient stock | `/pharmacy-finder`, `/pharmacy-finder/[id]`, `?stock=low` |
| P5 Request note / Slip ready | `/pharmacy-finder/[id]/request-note`, `/ready` |
| SMS Visual preference / On | `/notifications`, `?sms=on` (interactive switch) |
| P8 Balance full / deductions / Add claim | `/benefit-balance`, `?view=deductions`, `/benefit-balance/add-claim` |
| P10 No referrals / Referral details | `/referrals`, `/referrals/demo-referral` |
| Account menu / Edit profile / Switch / Settings / Log out | `/account`, `/account/profile`, `/account/switch`, `/account/settings`, `/account/logout` |
| Menu / Profile / Settings • Pending | `/onboarding/menu`, `/onboarding/profile`, `/onboarding/settings` |

## Responsive decisions (no new UI paradigms)
- 390px frame is the base; content column widens to `max-w-2xl/3xl/5xl` at md/lg.
- Bottom nav (active and pending variants) becomes a left rail at `lg`; header spans the viewport.
- Long screens split into two columns at `lg` (dashboard, clinic profile, booking, e-reseta, balance); card lists become 2–3 column grids at `md`/`lg`; paired buttons sit side by side at `md`.

## Deviations / notes
- Pages live under `src/app` (App Router), not `src/pages`, to match the README structure.
- Map stays the Figma illustrative SVG (design says it is a placeholder for Leaflet); QR is the Figma mock vector.
- Dropdown-looking fields in filters use native `<select>` for accessibility; visuals match the input style.
- Remaining-balance bar width is computed from data (90%) rather than the Figma pixel width (≈92%).
- All data is mock; forms navigate to the next screen and nothing is stored or sent.
