import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { ButtonLink } from "@/components/ui/Button";
import { ClinicProfile } from "@/features/directory/ClinicProfile";
import { CLINICS, findClinic } from "@/features/directory/mock-data";

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return CLINICS.map((clinic) => ({ id: clinic.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${findClinic(id)?.name ?? "Clinic"} • TULAY` };
}

/** TULAY / P3 • Clinic profile (222:2950) — pending account. */
export default async function PendingClinicProfilePage({ params }: { params: Params }) {
  const { id } = await params;
  const clinic = findClinic(id);
  if (!clinic) notFound();

  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="none" navVariant="pending">
      <PageContent gap="gap-5" width="wide">
        <ClinicProfile facility={clinic} backHref="/onboarding/clinic">
          <section aria-labelledby="in-person" className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4">
            <h2 id="in-person" className="text-base font-semibold text-primary">
              Enrollment is in person
            </h2>
            <p className="text-sm text-muted">
              Selecting this clinic does not activate your account. Clinic staff complete verification.
            </p>
            <ButtonLink href={`/onboarding/clinic/${clinic.id}/plan`}>Select this registered clinic</ButtonLink>
          </section>
          <ButtonLink href="/onboarding/clinic/map" variant="secondary">
            View map and directions
          </ButtonLink>
        </ClinicProfile>
      </PageContent>
    </AppShell>
  );
}
