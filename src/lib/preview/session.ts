import "server-only";

import { cookies } from "next/headers";

import { previewClinics } from "./mock-data";
import type { PreviewClinic } from "./types";

/**
 * PREVIEW ONLY. Remembers which demo clinic the reviewer picked so the
 * Clinic Staff screens can show the "with dispensary" or "without dispensary"
 * workspace. This cookie is NOT an authorization source: in the real app the
 * clinic assignment and dispensing permission come from the server profile
 * (getCurrentProfile + RLS), never from a browser-editable value.
 */
export const PREVIEW_CLINIC_COOKIE = "tulay_preview_clinic";

export async function getPreviewClinic(): Promise<PreviewClinic | null> {
  const store = await cookies();
  const value = store.get(PREVIEW_CLINIC_COOKIE)?.value;
  return previewClinics.find((c) => c.id === value) ?? null;
}
