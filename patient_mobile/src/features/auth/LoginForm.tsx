"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";

/** Login fields • equal spacing (222:2146) + primary CTA (222:2150). Mock only. */
export function LoginForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
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
      <Button type="submit">Log in</Button>
    </form>
  );
}
