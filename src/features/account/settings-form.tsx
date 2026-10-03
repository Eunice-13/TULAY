"use client";

import { type FormEvent, useState, useTransition } from "react";

import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { SelectField, TextField } from "@/components/ui/field";
import { changePassword } from "@/lib/data/mutations";
import { notConnected } from "@/lib/data/result";
import type { ApiResult } from "@/types/domain";

const notConnectedLocal = notConnected<never>("Display preferences");

type Errors = Partial<Record<"current" | "next" | "confirm", string>>;

/** Figma SettingsDoctor / SettingsPharmacy / StaffSettings. Preview: nothing is sent. */
export function SettingsForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<ApiResult<unknown> | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const current = String(data.get("current") ?? "");
    const next = String(data.get("next") ?? "");
    const confirm = String(data.get("confirm") ?? "");
    const e: Errors = {};
    if (current || next || confirm) {
      if (!current) e.current = "Enter your current password.";
      if (next.length < 8) e.next = "Use at least 8 characters.";
      if (confirm !== next) e.confirm = "Passwords do not match.";
    }
    setErrors(e);
    setResult(null);
    if (Object.keys(e).length > 0) return;
    if (!current) {
      // Only display preferences changed; stored on this device later, nothing to send.
      setResult(notConnectedLocal);
      return;
    }
    startTransition(async () => setResult(await changePassword({ currentPassword: current, newPassword: next })));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid max-w-2xl gap-6">
      <Card labelledBy="password-heading">
        <CardTitle id="password-heading">Change password</CardTitle>
        <div className="mt-4 grid gap-5">
          <TextField id="current" name="current" type="password" label="Current password" placeholder="Enter current password" autoComplete="current-password" error={errors.current} />
          <TextField id="next" name="next" type="password" label="New password" placeholder="Enter new password" autoComplete="new-password" error={errors.next} />
          <TextField id="confirm" name="confirm" type="password" label="Confirm new password" placeholder="Re-enter new password" autoComplete="new-password" error={errors.confirm} />
        </div>
      </Card>
      <Card labelledBy="display-heading">
        <CardTitle id="display-heading">Display preferences</CardTitle>
        <div className="mt-4 max-w-xs">
          <SelectField id="text-size" label="Text size" defaultValue="standard">
            <option value="standard">Standard</option>
            <option value="large">Large</option>
          </SelectField>
        </div>
      </Card>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </div>
      <ActionFeedback
        result={result}
        success={<p className="text-sm font-medium text-success">Password changed.</p>}
        previewMessage="Settings are not saved until accounts are connected."
      />
    </form>
  );
}
