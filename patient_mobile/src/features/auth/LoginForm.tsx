"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { signInPatient } from "@/app/(auth)/actions";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

/** Beneficiary login backed by Supabase Auth and the trusted profiles row. */
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await signInPatient(formData);
      if (result.success) router.push(result.next);
      else setError(result.message);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5" noValidate>
      <div className="flex w-full flex-col gap-3">
        <TextField
          tone="muted"
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <TextField
          tone="muted"
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
          required
        />
      </div>
      {error ? <p role="alert" className="text-sm font-semibold text-danger">{error}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
      <ButtonLink href="/register" variant="secondary">Create a TULAY account</ButtonLink>
    </form>
  );
}
