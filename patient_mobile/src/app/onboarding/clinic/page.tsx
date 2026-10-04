import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { FacilityCard } from "@/features/directory/FacilityCard";
import { requirePatient } from "@/lib/auth";
import { listFacilities } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Select your registered clinic • TULAY" };

export default async function SelectClinicPage() {
  const [profile, clinics] = await Promise.all([requirePatient("pending"), listFacilities("clinic")]);
  const allowed = profile.assignedClinicId ? clinics.filter((clinic) => clinic.id === profile.assignedClinicId) : clinics;
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="clinics">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/onboarding/philhealth" />
        <h1 className="w-full text-2xl font-semibold text-primary">{profile.assignedClinicId ? "Confirm your registry clinic" : "Select a nearby demo clinic"}</h1>
        <p className="w-full text-sm text-muted">Clinic choices come from Supabase. Selection does not activate the account.</p>
        {allowed.length === 0 ? <p className="w-full rounded-tulay bg-canvas p-4 text-sm">No eligible clinic is available for this record.</p> : (
          <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
            {allowed.map((clinic) => <li key={clinic.id}><FacilityCard id={clinic.id} name={clinic.name} lines={[clinic.address, clinic.operatingHours ?? "Hours not provided"]} href={`/onboarding/clinic/${clinic.id}`} /></li>)}
          </ul>
        )}
      </PageContent>
    </AppShell>
  );
}
