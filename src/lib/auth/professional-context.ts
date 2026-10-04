import "server-only";

import { requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/domain";

export async function getProfessionalContext(role: Exclude<UserRole, "beneficiary">) {
  const profile = await requireRole(role);
  if (!profile.facilityId) throw new Error("This professional account has no assigned facility.");
  const supabase = await createClient();
  const [{ data: account, error: accountError }, { data: facility, error: facilityError }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", profile.id).single(),
    supabase.from("facilities").select("id, name, kind").eq("id", profile.facilityId).single(),
  ]);
  if (accountError || facilityError || !facility) throw new Error("Unable to load the assigned professional workspace.");
  return { profile, userName: account?.display_name ?? "Authorized staff", facilityName: facility.name };
}
