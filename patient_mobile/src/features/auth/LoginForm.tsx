"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { signInPatient } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

/** Login fields • equal spacing (222:2146) + primary CTA (222:2150). Mock only. */
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
      if (result.data) {
        router.push(result.data.next);
        router.refresh();
      } else {
        setError(result.error.message);
      }
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
          placeholder="maria.demo@example.com"
        />
        <TextField
          tone="muted"
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••••••"
        />
        <TextField
          tone="muted"
          label="PhilHealth ID number"
          name="philhealthId"
          inputMode="numeric"
          autoComplete="off"
          placeholder="00-000000000-0"
        />
      </div>
      {error ? <p role="alert" className="text-sm font-semibold text-danger">{error}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Logging in…" : "Log in"}</Button>
    </form>
  );
}
