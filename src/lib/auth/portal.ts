import "server-only";

import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/current-profile";
import type { PortalRole } from "@/lib/preview/types";
import type { CurrentProfile } from "@/types/domain";

/** Protect a professional route with a freshly verified Supabase identity. */
export async function requirePortalRole(role: PortalRole): Promise<CurrentProfile> {
  const profile = await getCurrentProfile();

  if (!profile || profile.role !== role) {
    redirect(`/login?role=${role}&error=unauthorized`);
  }

  if (!profile.facilityId) {
    redirect(`/login?role=${role}&error=facility`);
  }

  return profile;
}
