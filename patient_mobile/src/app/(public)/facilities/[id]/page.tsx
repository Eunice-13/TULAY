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

/** TULAY / P3 • Active clinic profile (222:4856) */
export default async function ActiveClinicProfilePage({ params }: { params: Params }) {
  const { id } = await params;
  const clinic = findClinic(id);
  if (!clinic) notFound();

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="care">
      <PageContent gap="gap-5" width="wide">
        <ClinicProfile facility={clinic} backHref="/directory" variant="active">
          <section aria-labelledby="in-person" className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4">
            <h2 id="in-person" className="text-base font-semibold text-primary">
              Enrollment is In-Person
            </h2>
            <p className="text-sm text-muted">
              Selecting this clinic does not activate your account. Clinic staff complete verification.
            </p>
            <ButtonLink href="/appointments">Book a clinic appointment</ButtonLink>
          </section>
          <ButtonLink href="/directory/map" variant="secondary">
            View map and directions
          </ButtonLink>
        </ClinicProfile>
      </PageContent>
    </AppShell>
  );
}
