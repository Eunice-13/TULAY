"use server";

import { createClient } from "@/lib/supabase/server";

export type PatientAuthResult =
  | { success: true; next: string }
  | { success: false; message: string };

export type PatientRegistrationResult =
  | { success: true; next: string }
  | { success: false; message: string };

function required(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export async function registerAndMatchPatient(formData: FormData): Promise<PatientRegistrationResult> {
  const email = required(formData, "email").toLowerCase();
  const password = required(formData, "password");
  const firstName = required(formData, "firstName");
  const lastName = required(formData, "lastName");
  const philHealthId = required(formData, "philhealthId");
  const birthDate = required(formData, "birthDate");

  if (!email.includes("@") || password.length < 8) {
    return { success: false, message: "Enter a valid email and a password with at least 8 characters." };
  }
  if (!firstName || !lastName || !philHealthId || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return { success: false, message: "Complete the name, birth date, and mock PhilHealth ID fields." };
  }

  const supabase = await createClient();
  const signUp = await supabase.auth.signUp({ email, password });

  if (signUp.error) {
    const retry = await supabase.auth.signInWithPassword({ email, password });
    if (retry.error || !retry.data.user) {
      return { success: false, message: "Unable to create the account. The email may already be in use." };
    }
  } else if (!signUp.data.session) {
    return { success: false, message: "Account created. Confirm the email, then log in to continue matching." };
  }

  const { data, error } = await supabase.rpc("match_mock_beneficiary", {
    p_mock_philhealth_id: philHealthId,
    p_birth_date: birthDate,
    p_first_name: firstName,
    p_last_name: lastName,
  });

  if (error) {
    return {
      success: false,
      message: error.code === "23505"
        ? "That mock beneficiary record is already linked to an account."
        : "Unable to check the submitted mock beneficiary information.",
    };
  }

  if (!data || typeof data !== "object" || !("matched" in data) || data.matched !== true) {
    return { success: false, message: "The information did not match the mock PhilHealth registry." };
  }

  return { success: true, next: "/register/dependents" };
}

export async function signInPatient(formData: FormData): Promise<PatientAuthResult> {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");
  const email = typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const password = typeof passwordValue === "string" ? passwordValue : "";

  if (!email.includes("@") || !password) {
    return { success: false, message: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { success: false, message: "Email or password does not match." };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "beneficiary") {
    await supabase.auth.signOut();
    return { success: false, message: "Use a beneficiary account in the patient portal." };
  }

  return {
    success: true,
    next: profile.account_status === "active" ? "/dashboard" : "/onboarding/pending",
  };
}
