"use server";

import {
  AuthorizationError,
  requireActiveBeneficiary,
} from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type { ApiResult, LaboratoryReferral } from "@/types/domain";

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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseReferral(value: unknown): LaboratoryReferral | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    typeof value.beneficiary_id !== "string" ||
    typeof value.doctor_id !== "string" ||
    typeof value.clinic_id !== "string" ||
    typeof value.service_name !== "string" ||
    typeof value.destination_name !== "string" ||
    typeof value.reason !== "string" ||
    value.status !== "issued" ||
    typeof value.created_at !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    beneficiaryId: value.beneficiary_id,
    doctorId: value.doctor_id,
    clinicId: value.clinic_id,
    serviceName: value.service_name,
    destinationName: value.destination_name,
    reason: value.reason,
    status: "issued",
    createdAt: value.created_at,
  };
}

export async function getMyLaboratoryReferrals(): Promise<
  ApiResult<LaboratoryReferral[]>
> {
  try {
    await requireActiveBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("laboratory_referrals")
    .select(
      "id, beneficiary_id, doctor_id, clinic_id, service_name, destination_name, reason, status, created_at",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return actionError(
      "REFERRALS_FAILED",
      "Unable to load your laboratory referrals.",
    );
  }

  const referrals = data.map(parseReferral);

  if (referrals.some((referral) => referral === null)) {
    return actionError(
      "INVALID_RESPONSE",
      "The referral list returned an unexpected response.",
    );
  }

  return { data: referrals as LaboratoryReferral[] };
}
