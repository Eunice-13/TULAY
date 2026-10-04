"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { selectPatientClinic } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/Button";

export function ClinicSelectionButton({ clinicId }: { clinicId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  function select(formData: FormData) {
    const run = (latitude?: number, longitude?: number) => startTransition(async () => {
      if (latitude !== undefined && longitude !== undefined) {
        formData.set("latitude", String(latitude));
        formData.set("longitude", String(longitude));
      }
      setError(null);
      const result = await selectPatientClinic(formData);
      if (result.data) { router.push(result.data.next); router.refresh(); }
      else setError(result.error.message);
    });
    if (!navigator.geolocation) return run();
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => run(coords.latitude, coords.longitude),
      () => run(),
      { enableHighAccuracy: false, timeout: 8000 },
    );
  }

  return (
    <form action={select} className="flex w-full flex-col gap-3">
      <input type="hidden" name="clinicId" value={clinicId} />
      {error ? <p role="alert" className="text-sm font-semibold text-danger">{error}</p> : null}
      <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Select this registered clinic"}</Button>
    </form>
  );
}
