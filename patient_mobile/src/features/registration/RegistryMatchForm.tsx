"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { matchRegistryRecord } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function RegistryMatchForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await matchRegistryRecord(formData);
      if (result.data) {
        router.push(result.data.next);
        router.refresh();
      } else {
        setError(result.error.message);
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-4" noValidate>
      <TextField label="Mock PhilHealth ID" name="philHealthId" autoComplete="off" required />
      <TextField label="Birth date" name="birthDate" type="date" required />
      <TextField label="First name" name="firstName" autoComplete="given-name" required />
      <TextField label="Last name" name="lastName" autoComplete="family-name" required />
      {error ? <p role="alert" className="text-sm font-semibold text-danger">{error}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Checking…" : "Check fictional registry"}</Button>
      <p className="text-xs text-muted">Matching only locates your demo record. Clinic staff must still activate the account in person.</p>
    </form>
  );
}
