"use server";

import {
  AuthorizationError,
  requireRole,
} from "@/lib/auth/guards";
import { loadMedicineCatalog } from "@/lib/medicine-catalog";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.generated";
import type {
  ApiResult,
  IssuePrescriptionRequest,
  IssuePrescriptionResponse,
  MedicineCatalogItem,
} from "@/types/domain";

const MAX_PRESCRIPTION_ITEMS = 10;
const MAX_INSTRUCTIONS_LENGTH = 500;

export async function getPrescriptionMedicineCatalog(): Promise<
  ApiResult<MedicineCatalogItem[]>
> {
  try {
    await requireRole("doctor");
  } catch (error) {
    return handleAuthorizationError(error);
  }

  return loadMedicineCatalog();
}

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

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseIssueResponse(
  value: unknown,
): IssuePrescriptionResponse | null {
  if (!isObject(value)) {
    return null;
  }

  if (
    typeof value.prescriptionId !== "string" ||
    typeof value.mockUpsc !== "string" ||
    typeof value.issuedAt !== "string"
  ) {
    return null;
  }

  return {
    prescriptionId: value.prescriptionId,
    mockUpsc: value.mockUpsc,
    issuedAt: value.issuedAt,
  };
}

function validateRequest(
  request: IssuePrescriptionRequest,
): ApiResult<never> | null {
  if (
    !isObject(request) ||
    typeof request.beneficiaryId !== "string" ||
    !isUuid(request.beneficiaryId)
  ) {
    return actionError("INVALID_BENEFICIARY", "Select a valid beneficiary.");
  }

  if (
    !Array.isArray(request.items) ||
    request.items.length === 0 ||
    request.items.length > MAX_PRESCRIPTION_ITEMS
  ) {
    return actionError(
      "INVALID_ITEMS",
      `Add between 1 and ${MAX_PRESCRIPTION_ITEMS} prescription items.`,
    );
  }

  const medicineIds = new Set<string>();

  for (const item of request.items) {
    if (
      !isObject(item) ||
      typeof item.medicineId !== "string" ||
      typeof item.instructions !== "string" ||
      (item.prescribedQuantity !== undefined &&
        typeof item.prescribedQuantity !== "number")
    ) {
      return actionError(
        "INVALID_ITEMS",
        "Each prescription item must include a medicine and instructions.",
      );
    }

    const instructions = item.instructions.trim();

    if (
      !isUuid(item.medicineId) ||
      instructions.length === 0 ||
      instructions.length > MAX_INSTRUCTIONS_LENGTH ||
      (item.prescribedQuantity !== undefined &&
        (!Number.isInteger(item.prescribedQuantity) ||
          item.prescribedQuantity <= 0)) ||
      medicineIds.has(item.medicineId)
    ) {
      return actionError(
        "INVALID_ITEMS",
        "Each medicine must be unique and include valid instructions and an optional positive quantity.",
      );
    }

    medicineIds.add(item.medicineId);
  }

  return null;
}

export async function issuePrescription(
  request: IssuePrescriptionRequest,
): Promise<ApiResult<IssuePrescriptionResponse>> {
  try {
    await requireRole("doctor");
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const validationError = validateRequest(request);

  if (validationError) {
    return validationError;
  }

  const items: Json = request.items.map((item) => ({
    medicineId: item.medicineId,
    instructions: item.instructions.trim(),
    ...(item.prescribedQuantity === undefined
      ? {}
      : { prescribedQuantity: item.prescribedQuantity }),
  }));

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("issue_mock_prescription", {
    p_beneficiary_id: request.beneficiaryId,
    p_items: items,
  });

  if (error) {
    if (error.code === "42501") {
      return actionError(
        "PATIENT_NOT_ALLOWED",
        "The patient must be active and assigned to your clinic.",
      );
    }

    if (["22023", "22P02", "23503", "23514"].includes(error.code)) {
      return actionError(
        "INVALID_PRESCRIPTION",
        "Check the selected medicines, quantities, and instructions.",
      );
    }

    return actionError(
      "PRESCRIPTION_FAILED",
      "Unable to issue the prescription.",
    );
  }

  const response = parseIssueResponse(data);

  if (!response) {
    return actionError(
      "INVALID_RESPONSE",
      "The prescription operation returned an unexpected response.",
    );
  }

  return {
    data: response,
  };
}
