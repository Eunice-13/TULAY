"use server";

import {
  AuthorizationError,
  requirePendingBeneficiary,
} from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type {
  ApiResult,
  MatchBeneficiaryResponse,
  SetBeneficiaryClinicResponse,
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

function readRequiredText(formData: FormData, field: string): string | null {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
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

function parseMatchResponse(
  value: unknown,
): MatchBeneficiaryResponse | null {
  if (!isObject(value) || typeof value.matched !== "boolean") {
    return null;
  }

  if (!value.matched) {
    return {
      matched: false,
      message:
        typeof value.message === "string"
          ? value.message
          : "The submitted information did not match the mock registry.",
    };
  }

  const clinicPath = value.clinicPath;
  const assignedClinicId = value.assignedClinicId;

  if (
    clinicPath !== "select_clinic" &&
    clinicPath !== "confirm_assigned_clinic"
  ) {
    return null;
  }

  if (
    typeof assignedClinicId !== "string" &&
    assignedClinicId !== null
  ) {
    return null;
  }

  if (value.accountStatus !== "pending") {
    return null;
  }

  return {
    matched: true,
    clinicPath,
    assignedClinicId,
    accountStatus: "pending",
  };
}

function parseClinicResponse(
  value: unknown,
): SetBeneficiaryClinicResponse | null {
  if (!isObject(value)) {
    return null;
  }

  if (
    typeof value.assignedClinicId !== "string" ||
    value.accountStatus !== "pending" ||
    typeof value.verificationReference !== "string"
  ) {
    return null;
  }

  return {
    assignedClinicId: value.assignedClinicId,
    accountStatus: "pending",
    verificationReference: value.verificationReference,
  };
}

export async function matchBeneficiary(
  formData: FormData,
): Promise<ApiResult<MatchBeneficiaryResponse>> {
  try {
    await requirePendingBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const philHealthId = readRequiredText(formData, "philHealthId");
  const birthDate = readRequiredText(formData, "birthDate");
  const firstName = readRequiredText(formData, "firstName");
  const lastName = readRequiredText(formData, "lastName");

  if (!philHealthId || !birthDate || !firstName || !lastName) {
    return actionError(
      "INVALID_INPUT",
      "Complete all beneficiary information fields.",
    );
  }

  if (!isValidIsoDate(birthDate)) {
    return actionError(
      "INVALID_BIRTH_DATE",
      "Enter the birth date using YYYY-MM-DD.",
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("match_mock_beneficiary", {
    p_mock_philhealth_id: philHealthId,
    p_birth_date: birthDate,
    p_first_name: firstName,
    p_last_name: lastName,
  });

  if (error) {
    if (error.code === "23505") {
      return actionError(
        "REGISTRY_UNAVAILABLE",
        "Unable to link the submitted mock beneficiary record.",
      );
    }

    return actionError(
      "MATCH_FAILED",
      "Unable to check the submitted information.",
    );
  }

  const response = parseMatchResponse(data);

  if (!response) {
    return actionError(
      "INVALID_RESPONSE",
      "The registry returned an unexpected response.",
    );
  }

  return {
    data: response,
  };
}

export async function setBeneficiaryClinic(
  formData: FormData,
): Promise<ApiResult<SetBeneficiaryClinicResponse>> {
  try {
    await requirePendingBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const clinicId = readRequiredText(formData, "clinicId");

  if (!clinicId || !isUuid(clinicId)) {
    return actionError(
      "INVALID_CLINIC",
      "Select a valid demo clinic.",
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "set_beneficiary_clinic",
    {
      p_clinic_id: clinicId,
    },
  );

  if (error) {
    if (error.code === "22023") {
      return actionError(
        "INVALID_CLINIC",
        "Select a valid demo clinic.",
      );
    }

    if (error.code === "42501") {
      return actionError(
        "CLINIC_NOT_ALLOWED",
        "Existing members must confirm their assigned clinic.",
      );
    }

    return actionError(
      "CLINIC_SELECTION_FAILED",
      "Unable to save the clinic selection.",
    );
  }

  const response = parseClinicResponse(data);

  if (!response) {
    return actionError(
      "INVALID_RESPONSE",
      "The clinic operation returned an unexpected response.",
    );
  }

  return {
    data: response,
  };
}