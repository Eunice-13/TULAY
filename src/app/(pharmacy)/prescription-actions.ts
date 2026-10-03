"use server";

import {
  AuthorizationError,
  requireRole,
} from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type {
  ApiResult,
  PrescriptionLookupResponse,
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

function readMockUpsc(formData: FormData): string | null {
  const value = formData.get("mockUpsc");

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toUpperCase();

  if (!/^DEMO-UPSC-[A-F0-9]{10}$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

function hasIdentity(
  value: unknown,
): value is { id: string; displayName: string } {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    typeof value.displayName === "string"
  );
}

function parseLookupResponse(
  value: unknown,
): PrescriptionLookupResponse | null {
  if (
    !isObject(value) ||
    typeof value.prescriptionId !== "string" ||
    typeof value.mockUpsc !== "string" ||
    typeof value.issuedAt !== "string" ||
    !hasIdentity(value.beneficiary) ||
    !hasIdentity(value.doctor) ||
    !isObject(value.clinic) ||
    typeof value.clinic.id !== "string" ||
    typeof value.clinic.name !== "string" ||
    !Array.isArray(value.items) ||
    typeof value.notice !== "string"
  ) {
    return null;
  }

  const items = value.items.map((item) => {
    if (
      !isObject(item) ||
      typeof item.medicineId !== "string" ||
      typeof item.genericName !== "string" ||
      typeof item.strength !== "string" ||
      typeof item.dosageForm !== "string" ||
      (typeof item.prescribedQuantity !== "number" &&
        item.prescribedQuantity !== null) ||
      typeof item.instructions !== "string"
    ) {
      return null;
    }

    return {
      medicineId: item.medicineId,
      genericName: item.genericName,
      strength: item.strength,
      dosageForm: item.dosageForm,
      prescribedQuantity: item.prescribedQuantity,
      instructions: item.instructions,
    };
  });

  if (items.some((item) => item === null)) {
    return null;
  }

  return {
    prescriptionId: value.prescriptionId,
    mockUpsc: value.mockUpsc,
    issuedAt: value.issuedAt,
    beneficiary: value.beneficiary,
    doctor: value.doctor,
    clinic: {
      id: value.clinic.id,
      name: value.clinic.name,
    },
    items: items as PrescriptionLookupResponse["items"],
    notice: value.notice,
  };
}

export async function lookupPrescriptionByUpsc(
  formData: FormData,
): Promise<ApiResult<PrescriptionLookupResponse>> {
  try {
    await requireRole("pharmacy_staff");
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const mockUpsc = readMockUpsc(formData);

  if (!mockUpsc) {
    return actionError(
      "INVALID_UPSC",
      "Enter a valid mock UPSC in the DEMO-UPSC format.",
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc(
    "lookup_prescription_by_upsc",
    {
      p_mock_upsc: mockUpsc,
    },
  );

  if (error) {
    if (error.code === "P0002") {
      return actionError(
        "PRESCRIPTION_NOT_FOUND",
        "No prescription was found for that mock UPSC.",
      );
    }

    if (error.code === "42501") {
      return actionError(
        "FORBIDDEN",
        "Pharmacy staff permission is required.",
      );
    }

    return actionError(
      "LOOKUP_FAILED",
      "Unable to retrieve the prescription.",
    );
  }

  const response = parseLookupResponse(data);

  if (!response) {
    return actionError(
      "INVALID_RESPONSE",
      "The prescription lookup returned an unexpected response.",
    );
  }

  return {
    data: response,
  };
}
