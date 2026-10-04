import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PatientProfile } from "@/types/domain";

export async function getPatientProfile(): Promise<PatientProfile | null> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const id = claims?.claims?.sub;
  if (typeof id !== "string") return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, role, account_status, assigned_clinic_id, registry_record_id")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) throw new Error("Unable to load your patient profile.");

  return {
    id: data.id,
    displayName: data.display_name,
    role: data.role,
    accountStatus: data.account_status,
    assignedClinicId: data.assigned_clinic_id,
    registryRecordId: data.registry_record_id,
  } as PatientProfile;
}

export async function requirePatient(status?: "pending" | "active") {
  const profile = await getPatientProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "beneficiary") redirect("/login?error=patient-only");
  if (status && profile.accountStatus !== status) {
    redirect(profile.accountStatus === "active" ? "/dashboard" : "/onboarding/pending");
  }
  return profile;
}
