# Setup report (baseline before PATIENT-UI-PHONE build)

Branch: `Dan-front`. Nothing committed.

## Already present (from the interrupted run, verified correct)
- `package.json` devDependencies pinned exact: `tailwindcss@4.1.13`, `@tailwindcss/postcss@4.1.13`, `@playwright/test@1.55.0` (installed in node_modules at those versions; `package-lock.json` updated).
- `typecheck` script (`tsc --noEmit`) already in package.json; `dev`, `build`, `start`, `lint` unchanged.
- `postcss.config.mjs`: `plugins: { "@tailwindcss/postcss": {} }`.
- `src/app/globals.css`: `@import "tailwindcss";` + empty `@theme {}` block (placeholder comment only, no token values).
- `src/app/layout.tsx`: `import "./globals.css";` added.

## Installed / fixed in this run
- Playwright Chromium: the cached browser was build 1234 (wrong for 1.55.0). Ran `npx playwright install chromium` → installed `chromium-1187` + `chromium_headless_shell-1187` (removed unused 1234).
- Lint was broken (pre-existing): no ESLint config existed, so `next lint` opened an interactive setup prompt and exited 1. Added `eslint.config.mjs` (flat config via `FlatCompat`, extends `next/core-web-vitals` + `next/typescript`) and pinned `@eslint/eslintrc@3.3.7` as a devDependency.
- Removed stale scratch scripts/logs left by the interrupted run.

## Installed versions (resolved)
next 15.5.27, react 19.3.0, typescript 5.9.3, eslint 9.39.5, eslint-config-next 15.5.27, tailwindcss 4.1.13, @tailwindcss/postcss 4.1.13, @playwright/test 1.55.0, @eslint/eslintrc 3.3.7.

## Baseline results (full log: `.agents/tasks/baseline.log`)
| Command | Result |
|---|---|
| `npx playwright install chromium` | exit 0 |
| `npm run typecheck` | exit 0 |
| `npm run lint` | exit 0, "No ESLint warnings or errors" |
| `npm run build` | exit 0, routes `/` and `/_not-found` static |
| `npx playwright install --list` | 1.55.0 → chromium-1187 available |

## Notes
- `next lint` prints a deprecation notice (removed in Next 16); harmless on 15.5.
- npm warns that `@tailwindcss/oxide` and `unrs-resolver` postinstall scripts aren't approved under allowScripts; build works regardless (native binaries come from optional deps).
- `npm audit` reports 9 vulnerabilities (1 moderate, 8 high) in existing deps; not addressed.
