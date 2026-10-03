// Checks every route at 360/768/1280: HTTP status, horizontal overflow, unlabeled form controls,
// interactive elements without an accessible name, and targets smaller than 44x44 CSS px.
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "http://localhost:3123";
const routes = readFileSync(new URL("./routes.txt", import.meta.url), "utf8").trim().split(",");
const widths = [360, 768, 1280];
const lines = [];
const smallTargets = new Map();

const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  for (const route of routes) {
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    const result = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      const controls = [...document.querySelectorAll("input, select, textarea")];
      const unlabeled = controls
        .filter((el) => {
          const id = el.getAttribute("id");
          const hasFor = id && document.querySelector(`label[for="${CSS.escape(id)}"]`);
          return !hasFor && !el.closest("label") && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby");
        })
        .map((el) => el.getAttribute("name") || el.tagName);
      const interactive = [...document.querySelectorAll("a[href], button")];
      const nameless = interactive
        .filter((el) => !(el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") || el.textContent?.trim() || el.querySelector("img[alt]:not([alt=''])")))
        .map((el) => el.outerHTML.slice(0, 80));
      const small = interactive
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.height < 44 || r.width < 44);
        })
        .map((el) => (el.textContent?.trim() || el.getAttribute("aria-label") || "?").slice(0, 30));
      return { overflow, unlabeled, nameless, small };
    });
    for (const label of result.small) smallTargets.set(label, (smallTargets.get(label) ?? 0) + 1);
    if (res?.status() !== 200 || result.overflow || result.unlabeled.length || result.nameless.length) {
      lines.push(
        `${width} ${route} status=${res?.status()} overflow=${result.overflow} unlabeled=${result.unlabeled.join("|")} nameless=${result.nameless.join("|")}`,
      );
    }
  }
  await page.close();
}
await browser.close();
lines.push(`TOTAL route checks: ${routes.length * widths.length}`);
lines.push("Targets under 44px (label: occurrences):");
for (const [label, count] of [...smallTargets.entries()].sort((a, b) => b[1] - a[1])) lines.push(`  ${label}: ${count}`);
writeFileSync(new URL("./a11y-report.txt", import.meta.url), lines.join("\n"));
