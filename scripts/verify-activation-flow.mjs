import { createClient } from "@supabase/supabase-js";

const requiredEnvironmentVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "TULAY_BENEFICIARY_EMAIL",
  "TULAY_BENEFICIARY_PASSWORD",
  "TULAY_CLINIC_EMAIL",
  "TULAY_CLINIC_PASSWORD",
];

for (const variableName of requiredEnvironmentVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const clinicAId = "10000000-0000-4000-8000-000000000001";

function createTestClient() {
  return createClient(supabaseUrl, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function failOnError(label, error) {
  if (error) {
    throw new Error(`${label}: ${error.message}`);
  }
}

const beneficiaryClient = createTestClient();
const clinicClient = createTestClient();

async function verifyActivationFlow() {
  const {
    data: beneficiaryAuth,
    error: beneficiarySignInError,
  } = await beneficiaryClient.auth.signInWithPassword({
    email: process.env.TULAY_BENEFICIARY_EMAIL,
    password: process.env.TULAY_BENEFICIARY_PASSWORD,
  });

  failOnError("Beneficiary sign-in failed", beneficiarySignInError);

  const beneficiaryId = beneficiaryAuth.user?.id;

  if (!beneficiaryId) {
    throw new Error("Beneficiary sign-in returned no user ID.");
  }

  console.log("[PASS] Beneficiary signed in.");

  const { data: matchResult, error: matchError } =
    await beneficiaryClient.rpc("match_mock_beneficiary", {
      p_mock_philhealth_id: "DEMO-PH-001",
      p_birth_date: "2000-01-15",
      p_first_name: "Sample",
      p_last_name: "Beneficiary One",
    });

  failOnError("Beneficiary matching failed", matchError);

  if (
    matchResult?.matched !== true ||
    matchResult?.clinicPath !== "select_clinic" ||
    matchResult?.accountStatus !== "pending"
  ) {
    throw new Error("Beneficiary matching returned an unexpected result.");
  }

  console.log("[PASS] Mock beneficiary matched and remained Pending.");

  const { data: clinicSelection, error: clinicSelectionError } =
    await beneficiaryClient.rpc("set_beneficiary_clinic", {
      p_clinic_id: clinicAId,
    });

  failOnError("Clinic selection failed", clinicSelectionError);

  const verificationReference =
    clinicSelection?.verificationReference;

  if (
    clinicSelection?.assignedClinicId !== clinicAId ||
    clinicSelection?.accountStatus !== "pending" ||
    typeof verificationReference !== "string"
  ) {
    throw new Error("Clinic selection returned an unexpected result.");
  }

  console.log(
    "[PASS] Clinic selected and verification reference created.",
  );

  const { error: clinicSignInError } =
    await clinicClient.auth.signInWithPassword({
      email: process.env.TULAY_CLINIC_EMAIL,
      password: process.env.TULAY_CLINIC_PASSWORD,
    });

  failOnError("Clinic-staff sign-in failed", clinicSignInError);

  console.log("[PASS] Clinic staff signed in.");

  const { data: lookupResult, error: lookupError } =
    await clinicClient.rpc("lookup_pending_beneficiary", {
      p_reference: verificationReference,
    });

  failOnError("Pending beneficiary lookup failed", lookupError);

  if (
    lookupResult?.beneficiaryId !== beneficiaryId ||
    lookupResult?.accountStatus !== "pending" ||
    lookupResult?.assignedClinicId !== clinicAId
  ) {
    throw new Error(
      "Pending beneficiary lookup returned an unexpected result.",
    );
  }

  console.log(
    "[PASS] Assigned clinic staff retrieved the Pending beneficiary.",
  );

  const { data: activationResult, error: activationError } =
    await clinicClient.rpc("activate_beneficiary", {
      p_reference: verificationReference,
    });

  failOnError("Beneficiary activation failed", activationError);

  if (
    activationResult?.beneficiaryId !== beneficiaryId ||
    activationResult?.accountStatus !== "active"
  ) {
    throw new Error("Activation returned an unexpected result.");
  }

  console.log("[PASS] Clinic staff explicitly activated the beneficiary.");

  const { data: activeProfile, error: profileError } =
    await beneficiaryClient
      .from("profiles")
      .select("account_status, activated_at")
      .eq("id", beneficiaryId)
      .single();

  failOnError("Active profile verification failed", profileError);

  if (
    activeProfile.account_status !== "active" ||
    typeof activeProfile.activated_at !== "string"
  ) {
    throw new Error("Beneficiary profile was not activated correctly.");
  }

  console.log("[PASS] Active status persisted in the beneficiary profile.");

  const { data: auditRecord, error: auditError } =
    await beneficiaryClient
      .from("activation_audit")
      .select("beneficiary_id, clinic_id, approved_by, approved_at")
      .eq("beneficiary_id", beneficiaryId)
      .single();

  failOnError("Activation audit verification failed", auditError);

  if (
    auditRecord.clinic_id !== clinicAId ||
    typeof auditRecord.approved_by !== "string" ||
    typeof auditRecord.approved_at !== "string"
  ) {
    throw new Error("Activation audit record is incomplete.");
  }

  console.log("[PASS] Activation audit record was created.");
  console.log("[PASS] Complete Pending-to-Active backend flow verified.");
}

try {
  await verifyActivationFlow();
} catch (error) {
  console.error(
    "[FAIL]",
    error instanceof Error ? error.message : "Unknown test failure.",
  );
  process.exitCode = 1;
} finally {
  await beneficiaryClient.auth.signOut();
  await clinicClient.auth.signOut();
}