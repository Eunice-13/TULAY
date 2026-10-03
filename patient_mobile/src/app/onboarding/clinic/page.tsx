import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { FacilityCard, clinicSelectionLines } from "@/features/directory/FacilityCard";
import { ClinicSearchField } from "@/features/directory/ClinicSearchField";
import { CLINICS } from "@/features/directory/mock-data";

export const metadata: Metadata = { title: "Select your registered clinic • TULAY" };

/** TULAY / P3 • Select registered clinic (222:2892) */
export default function SelectClinicPage() {
  return (
    <AppShell menuHref="/onboarding/menu" homeHref="/onboarding/pending" nav="clinics">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/onboarding/pending" />
        <h1 className="w-full text-2xl font-semibold text-primary">Select your registered clinic</h1>
        <p className="w-full text-sm text-muted">Choose where you’ll enroll, then visit in person.</p>

        <div className="flex w-full flex-col gap-5 md:flex-row md:items-start md:gap-4">
          <ClinicSearchField className="md:flex-1" />
          <ButtonLink href="/onboarding/clinic/filters" variant="secondary" className="md:mt-[29px] md:w-auto md:px-6">
            Location, distance and hours
          </ButtonLink>
        </div>

        <ul className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
          {CLINICS.map((clinic) => (
            <li key={clinic.id}>
              <FacilityCard
                id={clinic.id}
                name={clinic.name}
                lines={clinicSelectionLines(clinic)}
                href={`/onboarding/clinic/${clinic.id}`}
              />
            </li>
          ))}
        </ul>

        <p className="w-full text-sm text-muted">
          These are illustrative facility records, not verified accreditation claims.
        </p>
      </PageContent>
    </AppShell>
  );
}
