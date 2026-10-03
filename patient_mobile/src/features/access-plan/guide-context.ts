import type { GuideContext } from "./GuideScreens";

/** Guides reached before activation (public + pending accounts). */
export const PUBLIC_GUIDE: GuideContext = {
  variant: "public",
  base: "/eligibility-guide",
  backHref: "/what-is-tulay",
  clinicHref: "/onboarding/clinic",
};

/** Guides reached from the active patient dashboard. */
export const ACTIVE_GUIDE: GuideContext = {
  variant: "active",
  base: "/guide",
  backHref: "/dashboard",
  clinicHref: "/directory",
};
