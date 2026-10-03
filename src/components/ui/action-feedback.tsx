import type { ReactNode } from "react";

import { NOT_CONNECTED } from "@/lib/data/result";
import type { ApiResult } from "@/types/domain";

import { PreviewNotice } from "./notice";

/**
 * Renders the outcome of a mutation from src/lib/data/mutations.ts:
 * - NOT_CONNECTED -> honest preview notice
 * - other error   -> alert with the server's safe message
 * - success       -> `success` content (or nothing)
 */
export function ActionFeedback({
  result,
  success,
  previewMessage,
}: {
  result: ApiResult<unknown> | null;
  success?: ReactNode;
  previewMessage?: string;
}) {
  if (!result) return null;
  if (result.error?.code === NOT_CONNECTED) {
    return <PreviewNotice>{previewMessage ?? result.error.message}</PreviewNotice>;
  }
  if (result.error) {
    return (
      <p role="alert" className="rounded-tulay-12 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
        {result.error.message}
      </p>
    );
  }
  return success ? <div role="status">{success}</div> : null;
}
