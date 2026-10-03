"use server";

import {
  AuthorizationError,
  requireActiveBeneficiary,
} from "@/lib/auth/guards";
import { createClient } from "@/lib/supabase/server";
import type {
  ApiResult,
  BeneficiaryNotification,
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

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseNotification(value: unknown): BeneficiaryNotification | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    (value.channel !== "in_app" && value.channel !== "simulated_sms") ||
    typeof value.title !== "string" ||
    typeof value.message !== "string" ||
    (typeof value.read_at !== "string" && value.read_at !== null) ||
    typeof value.created_at !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    channel: value.channel,
    title: value.title,
    message: value.message,
    readAt: value.read_at,
    createdAt: value.created_at,
  };
}

export async function getMyNotifications(): Promise<
  ApiResult<BeneficiaryNotification[]>
> {
  try {
    await requireActiveBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("id, channel, title, message, read_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return actionError(
      "NOTIFICATIONS_FAILED",
      "Unable to load your notifications.",
    );
  }

  const notifications = data.map(parseNotification);

  if (notifications.some((notification) => notification === null)) {
    return actionError(
      "INVALID_RESPONSE",
      "The notification list returned an unexpected response.",
    );
  }

  return { data: notifications as BeneficiaryNotification[] };
}

export async function markNotificationRead(
  formData: FormData,
): Promise<ApiResult<{ notificationId: string; readAt: string }>> {
  try {
    await requireActiveBeneficiary();
  } catch (error) {
    return handleAuthorizationError(error);
  }

  const value = formData.get("notificationId");
  const notificationId =
    typeof value === "string" && isUuid(value.trim())
      ? value.trim()
      : null;

  if (!notificationId) {
    return actionError(
      "INVALID_NOTIFICATION",
      "Select a valid notification.",
    );
  }

  const readAt = new Date().toISOString();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: readAt })
    .eq("id", notificationId)
    .is("read_at", null)
    .select("id, read_at")
    .maybeSingle();

  if (error) {
    return actionError(
      "MARK_READ_FAILED",
      "Unable to mark the notification as read.",
    );
  }

  if (!data || typeof data.read_at !== "string") {
    return actionError(
      "NOTIFICATION_NOT_FOUND",
      "The notification was not found or was already read.",
    );
  }

  return {
    data: {
      notificationId: data.id,
      readAt: data.read_at,
    },
  };
}
