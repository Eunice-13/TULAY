"use server";

import {
  AuthorizationError,
  requireActiveBeneficiary,
} from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type {
  ApiResult,
  BeneficiaryPrescription,
} from "@/types/domain";

function actionError<T>(code: string, message: string): ApiResult<T> {
  return {
    error: {
      code,
      message,
    },
  };
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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseIdentity(
  value: unknown,
): { id: string; displayName: string } | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    typeof value.display_name !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    displayName: value.display_name,
  };
}

function parsePrescription(value: unknown): BeneficiaryPrescription | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    typeof value.mock_upsc !== "string" ||
    typeof value.issued_at !== "string" ||
    !isObject(value.clinic) ||
    typeof value.clinic.id !== "string" ||
    typeof value.clinic.name !== "string" ||
    !Array.isArray(value.items)
  ) {
    return null;
  }

  const doctor = parseIdentity(value.doctor);

  if (!doctor) {
    return null;
  }

  const items = value.items.map((item) => {
    if (
      !isObject(item) ||
      typeof item.medicine_id !== "string" ||
      (typeof item.prescribed_quantity !== "number" &&
        item.prescribed_quantity !== null) ||
      typeof item.instructions !== "string" ||
      !isObject(item.medicine) ||
      typeof item.medicine.generic_name !== "string" ||
      typeof item.medicine.strength !== "string" ||
      typeof item.medicine.dosage_form !== "string"
    ) {
      return null;
    }

    return {
      medicineId: item.medicine_id,
      genericName: item.medicine.generic_name,
      strength: item.medicine.strength,
      dosageForm: item.medicine.dosage_form,
      prescribedQuantity: item.prescribed_quantity,
      instructions: item.instructions,
    };
  });

  if (items.some((item) => item === null)) {
    return null;
  }

  return {
    prescriptionId: value.id,
    mockUpsc: value.mock_upsc,
    issuedAt: value.issued_at,
    doctor,
    clinic: {
      id: value.clinic.id,
      name: value.clinic.name,
    },
    items: items as BeneficiaryPrescription["items"],
  };
}

export async function getMyPrescriptions(): Promise<
  ApiResult<BeneficiaryPrescription[]>
> {
  try {
    await requireActiveBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prescriptions")
    .select(
      `
        id,
        mock_upsc,
        issued_at,
        doctor:profiles!prescriptions_doctor_id_fkey(id, display_name),
        clinic:facilities!prescriptions_clinic_id_fkey(id, name),
        items:prescription_items(
          medicine_id,
          prescribed_quantity,
          instructions,
          medicine:medicines!prescription_items_medicine_id_fkey(
            generic_name,
            strength,
            dosage_form
          )
        )
      `,
    )
    .order("issued_at", { ascending: false });

  if (error) {
    return actionError(
      "PRESCRIPTIONS_FAILED",
      "Unable to load your prescriptions.",
    );
  }

  const prescriptions = data.map(parsePrescription);

  if (prescriptions.some((prescription) => prescription === null)) {
    return actionError(
      "INVALID_RESPONSE",
      "The prescription list returned an unexpected response.",
    );
  }

  return {
    data: prescriptions as BeneficiaryPrescription[],
  };
}
