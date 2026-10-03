import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { StockBadge } from "@/features/availability/StockBadge";
import { PHARMACIES, findPharmacy } from "@/features/availability/mock-data";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ stock?: string }>;

export function generateStaticParams() {
  return PHARMACIES.map((pharmacy) => ({ id: pharmacy.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return { title: `${findPharmacy(id)?.name ?? "Pharmacy"} • TULAY` };
}

/**
 * TULAY / P3 • Pharmacy profile (222:3925) and
 * TULAY / P3 • Pharmacy profile — insufficient stock (224:2111) via `?stock=low`.
 */
export default async function PharmacyProfilePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { stock } = await searchParams;
  const pharmacy = findPharmacy(id);
  if (!pharmacy) notFound();
  const insufficient = stock === "low";

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="none" navVariant="active">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/pharmacy-finder" />
        <h1 className="w-full text-2xl font-semibold text-primary">{pharmacy.name}</h1>
        <p className="w-full text-sm text-muted">Pharmacy profile • Illustrative facility.</p>
        {insufficient ? (
          <Badge weight="normal" align="left">
            Low stock • 12 of 30 reported
          </Badge>
        ) : (
          <StockBadge status={pharmacy.stock} />
        )}

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-5">
            {insufficient ? (
              <>
                <InfoRow title="Your selected medicine">
                  Demo medicine A • 500 mg
                  <br />
                  Required: 30 tablets • Reported: 12
                </InfoRow>
                <InfoRow title="Address and hours">
                  Sample Avenue, Quezon City • 0.8 km
                  <br />
                  Daily • 8:00 AM–8:00 PM
                </InfoRow>
                <InfoRow title="Quantity notice">
                  Reported quantity may not meet your prescription.
                  <br />
                  Confirm with staff before travel.
                </InfoRow>
              </>
            ) : (
              <>
                <InfoRow title="Your Selected Medicine">
                  Demo medicine A • 500 mg
                  <br />
                  Provider-reported • Updated Oct 4, 9:00 AM
                </InfoRow>
                <InfoRow title="Address and Hours">
                  Sample Avenue, Quezon City • 0.8 km
                  <br />
                  Daily • 8:00 AM–8:00 PM
                </InfoRow>
                <InfoRow title="Services and Notices">
                  Medicine dispensing with a prescription
                  <br />
                  Confirm availability before travel.
                </InfoRow>
              </>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <ButtonLink href="/directory/map">{insufficient ? "View directions" : "View Directions"}</ButtonLink>
            <ButtonLink href="/notifications" variant="secondary">
              SMS restock preference
            </ButtonLink>
            {insufficient ? (
              <Link
                href={`/pharmacy-finder/${pharmacy.id}/request-note`}
                className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4 text-left hover:shadow-md"
              >
                <span className="text-base font-semibold text-primary">Request a medicine note / slip</span>
                <span className="text-sm text-muted">
                  Ask staff for a written note showing the unfilled quantity and recommended next step.
                </span>
              </Link>
            ) : (
              <section aria-labelledby="before-dispensing" className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4">
                <h2 id="before-dispensing" className="text-base font-semibold text-primary">
                  Before dispensing
                </h2>
                <p className="text-sm text-muted">
                  Present your prescription and ask staff to confirm the required medicine and amount.
                </p>
              </section>
            )}
          </div>
        </div>

        <p className="w-full text-sm text-muted">
          Source: illustrative demo listing. No accreditation check is performed by this prototype.
        </p>
      </PageContent>
    </AppShell>
  );
}
