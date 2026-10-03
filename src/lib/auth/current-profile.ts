import { createClient } from "@/lib/supabase/server";
import type { CurrentProfile } from "@/types/domain";

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id, role, account_status, facility_id, assigned_clinic_id",
    )
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error("Unable to load the authenticated user profile.");
  }

  if (!profile) {
    throw new Error("Authenticated user profile is missing.");
  }

  return {
    id: profile.id,
    role: profile.role,
    accountStatus: profile.account_status,
    facilityId: profile.facility_id,
    assignedClinicId: profile.assigned_clinic_id,
  };
}