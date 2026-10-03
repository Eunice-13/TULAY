import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PHARMACIES, findPharmacy } from "@/features/availability/mock-data";

export const metadata: Metadata = { title: "Medicine Request Slip • TULAY" };

type Params = Promise<{ id: string }>;

export function generateStaticParams() {
  return PHARMACIES.map((pharmacy) => ({ id: pharmacy.id }));
}

/** TULAY / P5 • Medicine request slip ready (224:2228) */
export default async function RequestSlipReadyPage({ params }: { params: Params }) {
  const { id } = await params;
  const pharmacy = findPharmacy(id);
  if (!pharmacy) notFound();
  const profileHref = `/pharmacy-finder/${pharmacy.id}?stock=low`;

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="narrow">
        <BackLink href={`/pharmacy-finder/${pharmacy.id}/request-note`} />
        <h1 className="w-full text-2xl font-semibold text-primary">Medicine Request Slip</h1>
        <section
          aria-labelledby="slip-medicine"
          role="status"
          className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4"
        >
          <Icon name="user" size={56} />
          <h2 id="slip-medicine" className="text-base font-semibold text-primary">
            Demo medicine A • 500 mg
          </h2>
          <p className="text-sm text-muted">Required: 30 • Reported: 12 • Unfilled: 18 tablets</p>
          <ButtonLink href="/prescriptions/demo-ereseta">View E-Reseta</ButtonLink>
        </section>
        <ButtonLink href={profileHref} variant="secondary">
          Back to Pharmacy
        </ButtonLink>
      </PageContent>
    </AppShell>
  );
}
