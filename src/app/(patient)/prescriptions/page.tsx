import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { PRESCRIPTIONS } from "@/features/prescriptions/mock-data";

export const metadata: Metadata = { title: "Your E-Reseta • TULAY" };

/** TULAY / P7 • E-reseta list (222:3686) */
export default function PrescriptionListPage() {
  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="ereseta">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Your E-Reseta</h1>
        <p className="w-full text-sm text-muted">Prescriptions issued by your clinic.</p>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <ul className="flex flex-col gap-5">
            {PRESCRIPTIONS.map((rx) => (
              <li key={rx.id}>
                <article
                  aria-labelledby={`rx-${rx.id}`}
                  className="flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4"
                >
                  <h2 id={`rx-${rx.id}`} className="text-base font-semibold text-primary">
                    {rx.title}
                  </h2>
                  <p className="text-sm text-muted">
                    Issued {rx.issuedOn}
                    <br />
                    {rx.doctor} • {rx.clinic}
                  </p>
                  <Badge filled={false}>{rx.status}</Badge>
                  <ButtonLink href={`/prescriptions/${rx.id}`}>View prescription</ButtonLink>
                </article>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-5">
            <InfoRow title="A new prescription starts with a consultation">
              Your doctor issues the e-reseta after your clinic visit.
            </InfoRow>
            <ButtonLink href="/appointments" variant="secondary">
              Book a consultation
            </ButtonLink>
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
}
