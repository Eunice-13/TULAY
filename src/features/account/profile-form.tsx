"use client";

import { type FormEvent, useState, useTransition } from "react";

import { ActionFeedback } from "@/components/ui/action-feedback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextField } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { updateStaffProfile } from "@/lib/data/mutations";
import type { PreviewStaffAccount } from "@/lib/preview/types";
import type { ApiResult } from "@/types/domain";

/** Figma ProfileDoctor / ProfilePharmacy / StaffProfile. Role and facility are read-only. */
export function ProfileForm({ account, idLabel }: { account: PreviewStaffAccount; idLabel: string }) {
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [result, setResult] = useState<ApiResult<unknown> | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fullName = String(data.get("fullName") ?? "");
    const email = String(data.get("email") ?? "");
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    setErrors(next);
    setResult(null);
    if (Object.keys(next).length > 0) return;
    startTransition(async () => setResult(await updateStaffProfile({ fullName: fullName.trim(), email: email.trim() })));
  }

  return (
    <Card className="max-w-2xl">
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <TextField id="fullName" name="fullName" label="Full name" defaultValue={account.fullName} error={errors.fullName} autoComplete="name" />
        <TextField id="username" label="Username" defaultValue={account.username} disabled hint="Managed by your administrator." />
        <TextField id="staffId" label={idLabel} defaultValue={account.staffId} disabled hint="Managed by your administrator." />
        <TextField id="email" name="email" type="email" label="Email" defaultValue={account.email} error={errors.email} autoComplete="email" />
        <Notice>Role and facility assignment are managed by your administrator.</Notice>
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save changes"}
          </Button>
        </div>
        <ActionFeedback
          result={result}
          success={<p className="text-sm font-medium text-success">Profile saved.</p>}
          previewMessage="Profile changes are not saved until accounts are connected."
        />
      </form>
    </Card>
  );
}
