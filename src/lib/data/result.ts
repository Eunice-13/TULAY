import type { ApiResult } from "@/types/domain";

/**
 * Error code returned by every write that the backend has not implemented yet.
 * Team decision: the UI treats it like success (the demo presents as a finished
 * product; mock data is disclosed in the pitch). It is still a distinct code so
 * the backend can find unconnected operations by searching for notConnected(.
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
