"use server";

import {
  AuthorizationError,
  requireActiveBeneficiary,
} from "@/lib/auth/guards";
import { loadMedicineCatalog } from "@/lib/medicine-catalog";
import { createClient } from "@/lib/supabase/server";
import type {
  ApiResult,
  AvailabilityListing,
  RestockSubscription,
} from "@/types/domain";

function actionError<T>(code: string, message: string): ApiResult<T> {
  return { error: { code, message } };
}

function handleAuthorizationError<T>(error: unknown): ApiResult<T> {
  if (error instanceof AuthorizationError) {
    return actionError(error.code, error.message);
  }

  return actionError(
    "UNEXPECTED_ERROR",
    "Unable to complete the request. Please try again.",
  );
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function readUuid(formData: FormData, field: string): string | null {
  const value = formData.get(field);

  return typeof value === "string" && isUuid(value.trim())
    ? value.trim()
    : null;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseAvailability(value: unknown): AvailabilityListing | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    !isObject(value.facility) ||
    typeof value.facility.id !== "string" ||
    typeof value.facility.name !== "string" ||
    (value.facility.kind !== "clinic" && value.facility.kind !== "pharmacy") ||
    typeof value.facility.address !== "string" ||
    !isObject(value.medicine) ||
    typeof value.medicine.id !== "string" ||
    typeof value.medicine.generic_name !== "string" ||
    typeof value.medicine.strength !== "string" ||
    typeof value.medicine.dosage_form !== "string" ||
    (value.medicine.coverage_group !== "yakap_essential_21" &&
      value.medicine.coverage_group !== "gamot_additional_54") ||
    (value.status !== "available" && value.status !== "out_of_stock") ||
    typeof value.updated_at !== "string" ||
    typeof value.status_changed_at !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    facility: {
      id: value.facility.id,
      name: value.facility.name,
      kind: value.facility.kind,
      address: value.facility.address,
    },
    medicine: {
      id: value.medicine.id,
      genericName: value.medicine.generic_name,
      strength: value.medicine.strength,
      dosageForm: value.medicine.dosage_form,
      coverageGroup: value.medicine.coverage_group,
    },
    status: value.status,
    updatedAt: value.updated_at,
    statusChangedAt: value.status_changed_at,
  };
}

function parseSubscription(value: unknown): RestockSubscription | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    typeof value.facility_id !== "string" ||
    typeof value.medicine_id !== "string" ||
    typeof value.created_at !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    facilityId: value.facility_id,
    medicineId: value.medicine_id,
    createdAt: value.created_at,
  };
}

export async function getMedicineCatalog() {
  try {
    await requireActiveBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  return loadMedicineCatalog();
}

export async function getMedicineAvailability(): Promise<
  ApiResult<AvailabilityListing[]>
> {
  try {
    await requireActiveBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("medicine_availability")
    .select(
      `
        id,
        status,
        updated_at,
        status_changed_at,
        facility:facilities!medicine_availability_facility_id_fkey(
          id,
          name,
          kind,
          address
        ),
        medicine:medicines!medicine_availability_medicine_id_fkey(
          id,
          generic_name,
          strength,
          dosage_form,
          coverage_group
        )
      `,
    )
    .order("updated_at", { ascending: false });

  if (error) {
    return actionError(
      "AVAILABILITY_FAILED",
      "Unable to load reported medicine availability.",
    );
  }

  const availability = data.map(parseAvailability);

  if (availability.some((entry) => entry === null)) {
    return actionError(
      "INVALID_RESPONSE",
      "The availability list returned an unexpected response.",
    );
  }

  return { data: availability as AvailabilityListing[] };
}

export async function getMyRestockSubscriptions(): Promise<
  ApiResult<RestockSubscription[]>
> {
  try {
    await requireActiveBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restock_subscriptions")
    .select("id, facility_id, medicine_id, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return actionError(
      "SUBSCRIPTIONS_FAILED",
      "Unable to load your restock subscriptions.",
    );
  }

  const subscriptions = data.map(parseSubscription);

  if (subscriptions.some((subscription) => subscription === null)) {
    return actionError(
      "INVALID_RESPONSE",
      "The subscription list returned an unexpected response.",
    );
  }

  return { data: subscriptions as RestockSubscription[] };
}

export async function subscribeToRestock(
  formData: FormData,
): Promise<ApiResult<RestockSubscription>> {
  let beneficiaryId: string;

  try {
    beneficiaryId = (await requireActiveBeneficiary()).id;
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const facilityId = readUuid(formData, "facilityId");
  const medicineId = readUuid(formData, "medicineId");

  if (!facilityId || !medicineId) {
    return actionError(
      "INVALID_SUBSCRIPTION",
      "Select a valid facility and medicine.",
    );
  }

  const supabase = await createClient();
  const { data: availability, error: availabilityError } = await supabase
    .from("medicine_availability")
    .select("status")
    .eq("facility_id", facilityId)
    .eq("medicine_id", medicineId)
    .maybeSingle();

  if (availabilityError || !availability) {
    return actionError(
      "AVAILABILITY_NOT_FOUND",
      "No availability report exists for that facility and medicine.",
    );
  }

  if (availability.status !== "out_of_stock") {
    return actionError(
      "MEDICINE_AVAILABLE",
      "This medicine is already reported available.",
    );
  }

  const { data, error } = await supabase
    .from("restock_subscriptions")
    .insert({
      beneficiary_id: beneficiaryId,
      facility_id: facilityId,
      medicine_id: medicineId,
    })
    .select("id, facility_id, medicine_id, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return actionError(
        "ALREADY_SUBSCRIBED",
        "You are already subscribed to this restock alert.",
      );
    }

    return actionError(
      "SUBSCRIPTION_FAILED",
      "Unable to create the restock subscription.",
    );
  }

  const subscription = parseSubscription(data);

  if (!subscription) {
    return actionError(
      "INVALID_RESPONSE",
      "The subscription operation returned an unexpected response.",
    );
  }

  return { data: subscription };
}

export async function unsubscribeFromRestock(
  formData: FormData,
): Promise<ApiResult<{ subscriptionId: string }>> {
  try {
    await requireActiveBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const subscriptionId = readUuid(formData, "subscriptionId");

  if (!subscriptionId) {
    return actionError(
      "INVALID_SUBSCRIPTION",
      "Select a valid restock subscription.",
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restock_subscriptions")
    .delete()
    .eq("id", subscriptionId)
    .select("id")
    .maybeSingle();

  if (error) {
    return actionError(
      "UNSUBSCRIBE_FAILED",
      "Unable to remove the restock subscription.",
    );
  }

  if (!data) {
    return actionError(
      "SUBSCRIPTION_NOT_FOUND",
      "That restock subscription was not found.",
    );
  }

  return { data: { subscriptionId: data.id } };
}
