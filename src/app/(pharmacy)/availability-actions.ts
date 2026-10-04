"use server";

import {
  AuthorizationError,
  requireRole,
} from "@/lib/auth/guards";
import { loadMedicineCatalog } from "@/lib/medicine-catalog";
import { createClient } from "@/lib/supabase/server";
import type {
  ApiResult,
  MedicineCatalogItem,
  MedicineAvailability,
  UpdateMedicineAvailabilityRequest,
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

export async function getPharmacyMedicineCatalog(): Promise<
  ApiResult<MedicineCatalogItem[]>
> {
  try {
    await requireRole("pharmacy_staff");
  } catch (error) {
    return handleAuthorizationError(error);
  }

  return loadMedicineCatalog();
}

export async function setMedicineAvailability(
  request: UpdateMedicineAvailabilityRequest,
): Promise<ApiResult<MedicineAvailability>> {
  let pharmacyId: string;
  let staffId: string;

  try {
    const profile = await requireRole("pharmacy_staff", "clinic_staff");

    if (!profile.facilityId) {
      return actionError(
        "FACILITY_REQUIRED",
        "Your pharmacy account is not assigned to a facility.",
      );
    }

    pharmacyId = profile.facilityId;
    staffId = profile.id;
  } catch (error) {
    return handleAuthorizationError(error);
  }

  if (
    typeof request !== "object" ||
    request === null ||
    !isUuid(request.medicineId) ||
    (request.status !== "available" && request.status !== "out_of_stock")
  ) {
    return actionError(
      "INVALID_AVAILABILITY",
      "Select a valid medicine and availability status.",
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("medicine_availability")
    .upsert(
      {
        facility_id: pharmacyId,
        medicine_id: request.medicineId,
        status: request.status,
        updated_by: staffId,
      },
      { onConflict: "facility_id,medicine_id" },
    )
    .select(
      "facility_id, medicine_id, status, updated_at, status_changed_at",
    )
    .single();

  if (error) {
    if (error.code === "23503") {
      return actionError(
        "MEDICINE_NOT_FOUND",
        "Select a medicine from the demo catalog.",
      );
    }

    return actionError(
      "AVAILABILITY_UPDATE_FAILED",
      "Unable to update the reported medicine availability.",
    );
  }

  return {
    data: {
      facilityId: data.facility_id,
      medicineId: data.medicine_id,
      status: data.status,
      updatedAt: data.updated_at,
    },
  };
}
