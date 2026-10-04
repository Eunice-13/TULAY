"use server";

import { getPatientProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/domain";

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

async function pendingPatient() {
  const profile = await getPatientProfile();
  return profile?.role === "beneficiary" && profile.accountStatus === "pending" ? profile : null;
}

export async function matchRegistryRecord(formData: FormData): Promise<ActionResult<{ next: string }>> {
  if (!(await pendingPatient())) {
    return { error: { code: "FORBIDDEN", message: "A signed-in Pending patient account is required." } };
  }

  const philHealthId = text(formData, "philHealthId");
  const birthDate = text(formData, "birthDate");
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  if (!philHealthId || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || !firstName || !lastName) {
    return { error: { code: "INVALID_DETAILS", message: "Enter the mock PhilHealth ID, birth date, first name, and last name." } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("match_mock_beneficiary", {
    p_mock_philhealth_id: philHealthId,
    p_birth_date: birthDate,
    p_first_name: firstName,
    p_last_name: lastName,
  });

  if (error) {
    return { error: { code: "MATCH_FAILED", message: "Unable to check the fictional registry record." } };
  }
  const result = data as { matched?: boolean; clinicPath?: string } | null;
  if (!result?.matched) {
    return { error: { code: "NO_MATCH", message: "Those details did not match a fictional registry record." } };
  }
  return { data: { next: result.clinicPath === "confirm_assigned_clinic" ? "/onboarding/clinic" : "/onboarding/clinic" } };
}

export async function selectPatientClinic(formData: FormData): Promise<ActionResult<{ next: string; verificationReference: string }>> {
  if (!(await pendingPatient())) {
    return { error: { code: "FORBIDDEN", message: "A signed-in Pending patient account is required." } };
  }
  const clinicId = text(formData, "clinicId");
  if (!/^[0-9a-f-]{36}$/i.test(clinicId)) {
    return { error: { code: "INVALID_CLINIC", message: "Select a valid clinic from the database." } };
  }

  const latitudeText = text(formData, "latitude");
  const longitudeText = text(formData, "longitude");
  const latitude = latitudeText ? Number(latitudeText) : null;
  const longitude = longitudeText ? Number(longitudeText) : null;
  if ((latitudeText || longitudeText) && (!Number.isFinite(latitude) || !Number.isFinite(longitude))) {
    return { error: { code: "INVALID_LOCATION", message: "Unable to validate your location." } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("set_beneficiary_clinic", {
    p_clinic_id: clinicId,
    ...(latitude === null ? {} : { p_latitude: latitude }),
    ...(longitude === null ? {} : { p_longitude: longitude }),
  });
  if (error) {
    return { error: { code: "CLINIC_NOT_ALLOWED", message: "That clinic is not allowed for this record or requires a location within 15 km." } };
  }
  const result = data as { verificationReference?: string } | null;
  if (!result?.verificationReference) {
    return { error: { code: "INVALID_RESPONSE", message: "The clinic selection was not saved." } };
  }
  return { data: { next: "/onboarding/pending", verificationReference: result.verificationReference } };
}
