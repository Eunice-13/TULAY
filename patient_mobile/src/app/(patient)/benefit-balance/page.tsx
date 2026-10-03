import type { Metadata } from "next";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { InfoRow } from "@/components/ui/InfoRow";

export const metadata: Metadata = { title: "Your Estimated Balance • TULAY" };

type SearchParams = Promise<{ view?: string }>;

const CEILING = 20000;
const DEMO_CLAIMS = [
  { title: "Demo medicine A • ₱1,200", amount: 1200, lines: ["30 tablets • October 4, 2026", "Illustrative price"] },
  { title: "Example laboratory test • ₱800", amount: 800, lines: ["1 test • October 4, 2026", "Illustrative price"] },
] as const;

const peso = (value: number) => `₱${value.toLocaleString("en-PH")}`;

/**
 * TULAY / P8 • Balance — full (222:4052) and
 * TULAY / P8 • Balance — demo deductions (222:4108) via `?view=deductions`.
 */
export default async function BenefitBalancePage({ searchParams }: { searchParams: SearchParams }) {
  const { view } = await searchParams;
  const deductions = view === "deductions";
  const deducted = DEMO_CLAIMS.reduce((sum, claim) => sum + claim.amount, 0);
  const remaining = CEILING - deducted;
  const remainingPct = Math.round((remaining / CEILING) * 100);

  return (
    <AppShell menuHref="/account" homeHref="/dashboard" nav="balance">
      <PageContent gap="gap-5" width="wide">
        <BackLink href="/dashboard" />
        <h1 className="w-full text-2xl font-semibold text-primary">Your Estimated Balance</h1>
        <p className="w-full text-sm text-muted">{deductions ? "Example Deductions" : "No claims recorded"}</p>

        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col gap-5">
            <section aria-label="Estimated balance" className="flex w-full flex-col gap-3 rounded-tulay bg-primary p-4 text-surface">
              <p className="text-[32px] leading-[1.45] font-medium">{peso(deductions ? remaining : CEILING)}</p>
              <p className="text-sm font-semibold">
                {deductions ? `${peso(deducted)} in illustrative deductions` : "Full demo balance"}
              </p>
              <p className="text-sm">
                {deductions
                  ? `${peso(CEILING)} − ${DEMO_CLAIMS.map((claim) => peso(claim.amount)).join(" − ")}`
                  : "Illustrative starting ceiling"}
              </p>
              {deductions ? (
                <div
                  role="progressbar"
                  aria-label="Remaining balance"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={remainingPct}
                  className="h-2 w-full overflow-hidden rounded-[4px] bg-muted"
                >
                  <div className="h-2 bg-success" style={{ width: `${remainingPct}%` }} />
                </div>
              ) : null}
            </section>

            {deductions ? null : (
              <InfoRow title="You have no reported claims">
                Add a demo claim to preview the recorded-cost interface.
              </InfoRow>
            )}
          </div>

          <div className="flex flex-col gap-5">
            {deductions ? (
              <>
                <h2 className="text-sm text-primary">Example reported costs</h2>
                <ul className="flex flex-col gap-5">
                  {DEMO_CLAIMS.map((claim, index) => (
                    <li key={claim.title} className="flex flex-col gap-5">
                      <InfoRow title={claim.title}>
                        {claim.lines[0]}
                        <br />
                        {claim.lines[1]}
                      </InfoRow>
                      {index === 0 ? <Divider /> : null}
                    </li>
                  ))}
                </ul>
                <section aria-labelledby="design-example" className="flex w-full flex-col gap-3 rounded-tulay bg-soft p-4">
                  <h3 id="design-example" className="text-base font-semibold text-primary">
                    Design example only
                  </h3>
                  <p className="text-sm text-muted">
                    Medicine and laboratory prices are used here only to illustrate a deducted interface. Laboratory
                    benefits are separate from the GAMOT medicine ceiling; this is not an official coverage rule.
                  </p>
                </section>
                <ButtonLink href="/benefit-balance/add-claim">Add a demo claim</ButtonLink>
                <ButtonLink href="/benefit-balance" variant="secondary">
                  View full balance state
                </ButtonLink>
              </>
            ) : (
              <>
                <ButtonLink href="/benefit-balance/add-claim">Add a Demo Claim</ButtonLink>
                <ButtonLink href="/benefit-balance?view=deductions" variant="secondary">
                  Preview Deducted Balance
                </ButtonLink>
                <p className="w-full text-sm text-muted">
                  Frontend illustration only. This is not your official PhilHealth balance.
                </p>
              </>
            )}
          </div>
        </div>
      </PageContent>
    </AppShell>
  );
}
