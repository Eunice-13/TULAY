"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { registerPatient } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

export function RegistrationForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await registerPatient(formData);
      if (result.data) {
        setMessage(result.data.message);
        router.push(result.data.next);
        router.refresh();
      } else {
        setError(result.error.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <p className="text-sm text-muted">
        Create your secure account first. Your fictional registry information is matched on the next screen.
      </p>
      <TextField tall label="Email address" type="email" name="email" autoComplete="email" required />
      <TextField
        tall
        label="Password"
        type="password"
        name="password"
        autoComplete="new-password"
        minLength={8}
        hint="At least 8 characters."
        required
      />
      {error ? <p role="alert" className="text-sm font-semibold text-danger">{error}</p> : null}
      {message ? <p role="status" className="text-sm font-semibold text-positive">{message}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Creating account…" : "Create account"}</Button>
    </form>
  );
}
