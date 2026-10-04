import type { ApiResult } from "@/types/domain";

/**
 * Error code returned by explicitly preview-only operations. Security-critical
 * flows must show this as an error and must never treat it as saved data.
 */
export const NOT_CONNECTED = "NOT_CONNECTED";

export function ok<T>(data: T): ApiResult<T> {
  return { data };
}

export function fail<T>(code: string, message: string): ApiResult<T> {
  return { error: { code, message } };
}

export function notConnected<T>(operation: string): ApiResult<T> {
  return fail(NOT_CONNECTED, `${operation} is not connected to the backend yet.`);
}

export function isNotConnected(result: ApiResult<unknown>): boolean {
  return result.error?.code === NOT_CONNECTED;
}
