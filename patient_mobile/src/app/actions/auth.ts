"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/domain";

export interface AuthDestination {
  next: string;
  message: string;
}

function credentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@") || password.length < 8) return null;
  return { email, password };
}

async function destinationForUser(userId: string): Promise<ActionResult<AuthDestination>> {
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, account_status, registry_record_id, assigned_clinic_id")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return { error: { code: "PROFILE_MISSING", message: "Your database profile could not be loaded." } };
  }
  if (profile.role !== "beneficiary") {
    await supabase.auth.signOut();
    return { error: { code: "PATIENT_ONLY", message: "Use the medical professional portal for this account." } };
  }

  const next = profile.account_status === "active"
    ? "/dashboard"
    : profile.assigned_clinic_id
      ? "/onboarding/pending"
      : profile.registry_record_id
        ? "/onboarding/clinic"
        : "/onboarding/philhealth";

  return { data: { next, message: "Signed in successfully." } };
}

export async function signInPatient(formData: FormData): Promise<ActionResult<AuthDestination>> {
  const input = credentials(formData);
  if (!input) {
    return { error: { code: "INVALID_CREDENTIALS", message: "Enter a valid email and a password of at least 8 characters." } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(input);
  if (error || !data.user) {
    return { error: { code: "SIGN_IN_FAILED", message: "Invalid email or password." } };
  }
  return destinationForUser(data.user.id);
}

export async function registerPatient(formData: FormData): Promise<ActionResult<AuthDestination>> {
  const input = credentials(formData);
  if (!input) {
    return { error: { code: "INVALID_CREDENTIALS", message: "Enter a valid email and a password of at least 8 characters." } };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(input);
  if (error || !data.user) {
    return { error: { code: "SIGN_UP_FAILED", message: "Unable to create the account. The email may already be registered." } };
  }
  if (!data.session) {
    return { data: { next: "/login", message: "Check your email to confirm the account, then log in." } };
  }
  return { data: { next: "/onboarding/philhealth", message: "Account created. Match your demo registry record next." } };
}

export async function signOutPatient(): Promise<ActionResult<{ next: string }>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: { code: "SIGN_OUT_FAILED", message: "Unable to sign out." } };
  return { data: { next: "/login" } };
}
