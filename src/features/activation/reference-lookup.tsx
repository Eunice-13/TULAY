"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { lookupVerificationReference } from "@/lib/data/mutations";

/**
 * Enter the random reference from the patient's verification QR to locate the
 * pending record. Locating a record never activates it.
 */
export function ReferenceLookup({ demoHint }: { demoHint?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const reference = String(new FormData(event.currentTarget).get("reference") ?? "");
    if (!reference.trim()) {
      setError("Enter or scan the patient's verification reference.");
      return;
    }
    startTransition(async () => {
      const result = await lookupVerificationReference(reference);
      if (result.data) {
        setError(null);
        router.push(`/clinic/activations/${result.data.beneficiaryId}`);
      } else {
        setError(result.error?.message ?? "Unable to find that reference.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <TextField
          id="reference"
          name="reference"
          label="Verification reference"
          placeholder="e.g. VREF-XXXX-XXXX"
          autoComplete="off"
          autoCapitalize="characters"
          hint={demoHint ? `From the patient's QR, e.g. ${demoHint}` : "From the patient's QR."}
          error={error ?? undefined}
        />
      </div>
      <Button type="submit" disabled={pending} className="sm:mb-0">
        {pending ? "Finding…" : "Find record"}
      </Button>
    </form>
  );
}
