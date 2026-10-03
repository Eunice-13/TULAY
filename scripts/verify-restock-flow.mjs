import { createClient } from "@supabase/supabase-js";

const requiredEnvironmentVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "TULAY_BENEFICIARY_EMAIL",
  "TULAY_BENEFICIARY_PASSWORD",
  "TULAY_PHARMACY_EMAIL",
  "TULAY_PHARMACY_PASSWORD",
];

for (const variableName of requiredEnvironmentVariables) {
  if (!process.env[variableName]) {
    throw new Error(`Missing environment variable: ${variableName}`);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const pharmacyId = "20000000-0000-4000-8000-000000000001";
const medicineId = "40000000-0000-4000-8000-000000000002";

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
const pharmacyClient = createTestClient();

async function verifyRestockFlow() {
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

  console.log("[PASS] Active beneficiary signed in.");

  const {
    data: pharmacyAuth,
    error: pharmacySignInError,
  } = await pharmacyClient.auth.signInWithPassword({
    email: process.env.TULAY_PHARMACY_EMAIL,
    password: process.env.TULAY_PHARMACY_PASSWORD,
  });

  failOnError("Pharmacy-staff sign-in failed", pharmacySignInError);

  const pharmacyStaffId = pharmacyAuth.user?.id;

  if (!pharmacyStaffId) {
    throw new Error("Pharmacy sign-in returned no user ID.");
  }

  console.log("[PASS] Pharmacy staff signed in.");

  const { error: outOfStockError } = await pharmacyClient
    .from("medicine_availability")
    .upsert(
      {
        facility_id: pharmacyId,
        medicine_id: medicineId,
        status: "out_of_stock",
        updated_by: pharmacyStaffId,
      },
      { onConflict: "facility_id,medicine_id" },
    );

  failOnError("Out-of-stock update failed", outOfStockError);
  console.log("[PASS] Pharmacy reported the medicine out of stock.");

  const { error: subscriptionError } = await beneficiaryClient
    .from("restock_subscriptions")
    .insert({
      beneficiary_id: beneficiaryId,
      facility_id: pharmacyId,
      medicine_id: medicineId,
    });

  failOnError("Restock subscription failed", subscriptionError);
  console.log("[PASS] Beneficiary subscribed to the restock alert.");

  const { error: availableError } = await pharmacyClient
    .from("medicine_availability")
    .update({
      status: "available",
      updated_by: pharmacyStaffId,
    })
    .eq("facility_id", pharmacyId)
    .eq("medicine_id", medicineId);

  failOnError("Available update failed", availableError);
  console.log("[PASS] Pharmacy reported the medicine available.");

  const { data: notifications, error: notificationError } =
    await beneficiaryClient
      .from("notifications")
      .select("id, channel, title, message, read_at, source_key")
      .order("created_at", { ascending: true });

  failOnError("Notification lookup failed", notificationError);

  const channels = new Set(
    notifications.map((notification) => notification.channel),
  );

  if (
    notifications.length !== 2 ||
    !channels.has("in_app") ||
    !channels.has("simulated_sms") ||
    !notifications.some((notification) =>
      notification.message.startsWith("[SIMULATED SMS]"),
    )
  ) {
    throw new Error("Expected in-app and simulated-SMS alerts were not created.");
  }

  console.log("[PASS] In-app and simulated-SMS alerts were created.");

  const { error: repeatedAvailableError } = await pharmacyClient
    .from("medicine_availability")
    .update({
      status: "available",
      updated_by: pharmacyStaffId,
    })
    .eq("facility_id", pharmacyId)
    .eq("medicine_id", medicineId);

  failOnError("Repeated available update failed", repeatedAvailableError);

  const { count, error: countError } = await beneficiaryClient
    .from("notifications")
    .select("id", { count: "exact", head: true });

  failOnError("Notification count failed", countError);

  if (count !== 2) {
    throw new Error("Repeated Available status created duplicate alerts.");
  }

  console.log("[PASS] Repeated Available status created no duplicate alerts.");
  console.log("[PASS] Complete restock-notification backend flow verified.");
}

try {
  await verifyRestockFlow();
} catch (error) {
  console.error(
    "[FAIL]",
    error instanceof Error ? error.message : "Unknown test failure.",
  );
  process.exitCode = 1;
} finally {
  await beneficiaryClient.auth.signOut();
  await pharmacyClient.auth.signOut();
}
