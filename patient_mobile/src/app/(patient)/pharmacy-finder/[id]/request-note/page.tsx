import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PHARMACIES, findPharmacy } from "@/features/availability/mock-data";

export const metadata: Metadata = { title: "Request a medicine note • TULAY" };

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return PHARMACIES.map((pharmacy) => ({ id: pharmacy.id }));
}

/** TULAY / P5 • Request medicine note (224:2174) */
export default async function RequestNotePage({ params }: { params: Params }) {
  const { id } = await params;
  const pharmacy = findPharmacy(id);
  if (!pharmacy) notFound();
  const profileHref = `/pharmacy-finder/${pharmacy.id}?stock=low`;

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href={profileHref} />
        <h1 className="w-full text-2xl font-semibold text-primary">Request a medicine note</h1>
        <p className="w-full text-sm text-muted">For a reported medicine shortage.</p>
        <section aria-labelledby="shortage" className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4">
          <Icon name="user" size={56} />
          <h2 id="shortage" className="text-base font-semibold text-primary">
            Required: 30 tablets • Reported: 12
          </h2>
          <p className="text-sm text-muted">18 tablets remain unfilled. Confirm the shortage with pharmacy staff.</p>
          <ButtonLink href={`/pharmacy-finder/${pharmacy.id}/request-note/ready`}>Request Note / Slip</ButtonLink>
        </section>
        <ButtonLink href={profileHref} variant="secondary">
          Back to Pharmacy
        </ButtonLink>
      </PageContent>
    </AppShell>
  );
}
