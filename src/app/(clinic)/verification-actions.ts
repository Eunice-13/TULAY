"use server";

import {
  AuthorizationError,
  requireRole,
} from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type {
  ActivateBeneficiaryResponse,
  ApiResult,
  PendingBeneficiaryLookup,
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

function readVerificationReference(formData: FormData): string | null {
  const value = formData.get("verificationReference");

  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toUpperCase();

  if (!/^TULAY-VERIFY-[A-F0-9]{10}$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePendingBeneficiary(
  value: unknown,
): PendingBeneficiaryLookup | null {
  if (!isObject(value)) {
    return null;
  }

  if (
    typeof value.beneficiaryId !== "string" ||
    typeof value.displayName !== "string" ||
    typeof value.mockPhilHealthId !== "string" ||
    typeof value.birthDate !== "string" ||
    value.accountStatus !== "pending" ||
    typeof value.assignedClinicId !== "string"
  ) {
    return null;
  }

  return {
    beneficiaryId: value.beneficiaryId,
    displayName: value.displayName,
    mockPhilHealthId: value.mockPhilHealthId,
    birthDate: value.birthDate,
    accountStatus: "pending",
    assignedClinicId: value.assignedClinicId,
  };
}

function parseActivationResponse(
  value: unknown,
): ActivateBeneficiaryResponse | null {
  if (!isObject(value)) {
    return null;
  }

  if (
    typeof value.beneficiaryId !== "string" ||
    value.accountStatus !== "active" ||
    typeof value.activatedAt !== "string"
  ) {
    return null;
  }

  return {
    beneficiaryId: value.beneficiaryId,
    accountStatus: "active",
    activatedAt: value.activatedAt,
  };
}

export async function lookupPendingBeneficiary(
  formData: FormData,
): Promise<ApiResult<PendingBeneficiaryLookup>> {
  try {
    await requireRole("clinic_staff");
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const reference = readVerificationReference(formData);

  if (!reference) {
    return actionError(
      "INVALID_REFERENCE",
      "Enter a valid TULAY verification reference.",
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "lookup_pending_beneficiary",
    {
      p_reference: reference,
    },
  );

  if (error) {
    if (error.code === "P0002") {
      return actionError(
        "REFERENCE_NOT_FOUND",
        "No assigned Pending beneficiary was found.",
      );
    }

    if (error.code === "42501") {
      return actionError(
        "FORBIDDEN",
        "Clinic staff permission is required.",
      );
    }

    return actionError(
      "LOOKUP_FAILED",
      "Unable to retrieve the Pending beneficiary.",
    );
  }

  const response = parsePendingBeneficiary(data);

  if (!response) {
    return actionError(
      "INVALID_RESPONSE",
      "The verification lookup returned an unexpected response.",
    );
  }

  return {
    data: response,
  };
}

export async function activateBeneficiary(
  formData: FormData,
): Promise<ApiResult<ActivateBeneficiaryResponse>> {
  try {
    await requireRole("clinic_staff");
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const reference = readVerificationReference(formData);

  if (!reference) {
    return actionError(
      "INVALID_REFERENCE",
      "Enter a valid TULAY verification reference.",
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "activate_beneficiary",
    {
      p_reference: reference,
    },
  );

  if (error) {
    if (error.code === "P0002") {
      return actionError(
        "REFERENCE_NOT_FOUND",
        "No assigned Pending beneficiary was found.",
      );
    }

    if (error.code === "42501") {
      return actionError(
        "FORBIDDEN",
        "Clinic staff permission is required.",
      );
    }

    return actionError(
      "ACTIVATION_FAILED",
      "Unable to activate the beneficiary.",
    );
  }

  const response = parseActivationResponse(data);

  if (!response) {
    return actionError(
      "INVALID_RESPONSE",
      "The activation operation returned an unexpected response.",
    );
  }

  return {
    data: response,
  };
}