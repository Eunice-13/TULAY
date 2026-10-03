"use server";

import { AuthorizationError, requireRole } from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type {
  ApiResult,
  CreateLaboratoryReferralRequest,
  LaboratoryReferral,
} from "@/types/domain";

const MAX_SERVICE_NAME_LENGTH = 120;
const MAX_DESTINATION_NAME_LENGTH = 160;
const MAX_REASON_LENGTH = 500;

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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown, maximumLength: number): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();

  return text.length > 0 && text.length <= maximumLength ? text : null;
}

function parseReferral(value: unknown): LaboratoryReferral | null {
  if (
    !isObject(value) ||
    typeof value.referralId !== "string" ||
    typeof value.beneficiaryId !== "string" ||
    typeof value.doctorId !== "string" ||
    typeof value.clinicId !== "string" ||
    typeof value.serviceName !== "string" ||
    typeof value.destinationName !== "string" ||
    typeof value.reason !== "string" ||
    value.status !== "issued" ||
    typeof value.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: value.referralId,
    beneficiaryId: value.beneficiaryId,
    doctorId: value.doctorId,
    clinicId: value.clinicId,
    serviceName: value.serviceName,
    destinationName: value.destinationName,
    reason: value.reason,
    status: "issued",
    createdAt: value.createdAt,
    notice:
      typeof value.notice === "string" ? value.notice : undefined,
  };
}

export async function createLaboratoryReferral(
  request: CreateLaboratoryReferralRequest,
): Promise<ApiResult<LaboratoryReferral>> {
  try {
    await requireRole("doctor");
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const serviceName = isObject(request)
    ? readText(request.serviceName, MAX_SERVICE_NAME_LENGTH)
    : null;
  const reason = isObject(request)
    ? readText(request.reason, MAX_REASON_LENGTH)
    : null;
  const destinationName = isObject(request)
    ? readText(request.destinationName, MAX_DESTINATION_NAME_LENGTH)
    : null;

  if (
    !isObject(request) ||
    typeof request.beneficiaryId !== "string" ||
    !isUuid(request.beneficiaryId) ||
    !serviceName ||
    !reason ||
    !destinationName
  ) {
    return actionError(
      "INVALID_REFERRAL",
      "Provide a patient, laboratory service, destination, and reason within the allowed lengths.",
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_laboratory_referral", {
    p_beneficiary_id: request.beneficiaryId,
    p_service_name: serviceName,
    p_reason: reason,
    p_destination_name: destinationName,
  });

  if (error) {
    if (error.code === "42501") {
      return actionError(
        "PATIENT_NOT_ALLOWED",
        "The patient must be active and assigned to your clinic.",
      );
    }

    if (error.code === "22023") {
      return actionError(
        "INVALID_REFERRAL",
        "Check the laboratory service, destination, and reason.",
      );
    }

    return actionError(
      "REFERRAL_FAILED",
      "Unable to create the laboratory referral.",
    );
  }

  const response = parseReferral(data);

  if (!response) {
    return actionError(
      "INVALID_RESPONSE",
      "The referral operation returned an unexpected response.",
    );
  }

  return { data: response };
}
