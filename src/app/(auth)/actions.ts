"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthActionResult } from "@/types/domain";

type CredentialsResult =
  | {
      success: true;
      email: string;
      password: string;
    }
  | {
      success: false;
      error: string;
    };

function readCredentials(formData: FormData): CredentialsResult {
  const emailValue = formData.get("email");
  const passwordValue = formData.get("password");

  if (typeof emailValue !== "string" || typeof passwordValue !== "string") {
    return {
      success: false,
      error: "Email and password are required.",
    };
  }

  const email = emailValue.trim().toLowerCase();
  const password = passwordValue;

  if (!email.includes("@")) {
    return {
      success: false,
      error: "Enter a valid email address.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must contain at least 8 characters.",
    };
  }

  return {
    success: true,
    email,
    password,
  };
}

export async function signUp(
  formData: FormData,
): Promise<AuthActionResult> {
  const credentials = readCredentials(formData);

  if (!credentials.success) {
    return {
      success: false,
      message: credentials.error,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return {
      success: false,
      message: "Unable to create the account. Please check your details.",
    };
  }

  const requiresEmailConfirmation = data.session === null;

  return {
    success: true,
    requiresEmailConfirmation,
    message: requiresEmailConfirmation
      ? "Account created. Check your email to confirm your account."
      : "Account created successfully.",
  };
}

export async function signIn(
  formData: FormData,
): Promise<AuthActionResult> {
  const credentials = readCredentials(formData);

  if (!credentials.success) {
    return {
      success: false,
      message: credentials.error,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  return {
    success: true,
    message: "Signed in successfully.",
  };
}

export async function signOut(): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: "Unable to sign out. Please try again.",
    };
  }

  return {
    success: true,
    message: "Signed out successfully.",
  };
}