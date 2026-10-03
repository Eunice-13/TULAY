import { createClient } from "@supabase/supabase-js";

const requiredEnvironmentVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "TULAY_DOCTOR_EMAIL",
  "TULAY_DOCTOR_PASSWORD",
  "TULAY_PHARMACY_EMAIL",
  "TULAY_PHARMACY_PASSWORD",
  "TULAY_BENEFICIARY_ID",
];

for (const variableName of requiredEnvironmentVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const beneficiaryId = process.env.TULAY_BENEFICIARY_ID;
const medicineId = "40000000-0000-4000-8000-000000000001";

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

const doctorClient = createTestClient();
const pharmacyClient = createTestClient();

async function verifyPrescriptionFlow() {
  const { error: doctorSignInError } =
    await doctorClient.auth.signInWithPassword({
      email: process.env.TULAY_DOCTOR_EMAIL,
      password: process.env.TULAY_DOCTOR_PASSWORD,
    });

  failOnError("Doctor sign-in failed", doctorSignInError);
  console.log("[PASS] Doctor signed in.");

  const { data: issuedPrescription, error: issueError } =
    await doctorClient.rpc("issue_mock_prescription", {
      p_beneficiary_id: beneficiaryId,
      p_items: [
        {
          medicineId,
          prescribedQuantity: 15,
          instructions: "Take one tablet as directed by the demo doctor.",
        },
      ],
    });

  failOnError("Prescription issuance failed", issueError);

  if (
    typeof issuedPrescription?.prescriptionId !== "string" ||
    typeof issuedPrescription?.mockUpsc !== "string" ||
    !/^DEMO-UPSC-[A-F0-9]{10}$/.test(issuedPrescription.mockUpsc)
  ) {
    throw new Error("Prescription issuance returned an unexpected result.");
  }

  console.log("[PASS] Doctor issued a prescription with a unique mock UPSC.");

  const { error: pharmacySignInError } =
    await pharmacyClient.auth.signInWithPassword({
      email: process.env.TULAY_PHARMACY_EMAIL,
      password: process.env.TULAY_PHARMACY_PASSWORD,
    });

  failOnError("Pharmacy-staff sign-in failed", pharmacySignInError);
  console.log("[PASS] Pharmacy staff signed in.");

  const { data: directRead } = await pharmacyClient
    .from("prescriptions")
    .select("id")
    .eq("id", issuedPrescription.prescriptionId)
    .maybeSingle();

  if (directRead !== null) {
    throw new Error("Pharmacy staff unexpectedly bypassed prescription RLS.");
  }

  console.log("[PASS] Direct pharmacy table access remained blocked by RLS.");

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const { data: lookup, error: lookupError } =
      await pharmacyClient.rpc("lookup_prescription_by_upsc", {
        p_mock_upsc: issuedPrescription.mockUpsc,
      });

    failOnError(`UPSC lookup ${attempt} failed`, lookupError);

    if (
      lookup?.prescriptionId !== issuedPrescription.prescriptionId ||
      lookup?.mockUpsc !== issuedPrescription.mockUpsc ||
      lookup?.beneficiary?.id !== beneficiaryId ||
      lookup?.items?.length !== 1 ||
      lookup.items[0]?.medicineId !== medicineId
    ) {
      throw new Error(`UPSC lookup ${attempt} returned unexpected data.`);
    }

    console.log(`[PASS] Exact UPSC lookup ${attempt} returned the prescription.`);
  }

  console.log("[PASS] Lookup did not consume or invalidate the mock UPSC.");
  console.log("[PASS] Complete doctor-to-pharmacy backend flow verified.");
}

try {
  await verifyPrescriptionFlow();
} catch (error) {
  console.error(
    "[FAIL]",
    error instanceof Error ? error.message : "Unknown test failure.",
  );
  process.exitCode = 1;
} finally {
  await doctorClient.auth.signOut();
  await pharmacyClient.auth.signOut();
}
