import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TableRegion, tdClass, thClass } from "@/components/ui/data-table";
import { Notice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { StatusBadge, StockBadge } from "@/components/ui/status-badge";
import { listOwnAvailability } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Pharmacy overview · TULAY" };

/** Figma PH1 — pharmacy dashboard. Counts are numbers of medicine reports, not stock quantities. */
export default async function PharmacyDashboardPage() {
  const { medicines } = await listOwnAvailability("pharmacy");
  const total = medicines.length;
  const inStock = medicines.filter((m) => m.status === "available").length;
  const outOfStock = medicines.filter((m) => m.status === "out_of_stock").length;

  const metrics = [
    { label: "Supported medicines", value: total, caption: `${total} supported medicines` },
    { label: "Reported in stock", value: inStock, caption: "Your pharmacy reports" },
    { label: "Reported out of stock", value: outOfStock, caption: "Check status before updating" },
  ];

  return (
    <>
      <PageHeading
        title="Pharmacy overview"
        description="Keep your pharmacy's medicine availability current."
        actions={
          <>
            <LinkButton href="/pharmacy/lookup" variant="secondary">
              Look up a UPSC
            </LinkButton>
            <LinkButton href="/pharmacy/stock">Update medicine stock</LinkButton>
          </>
        }
      />
      <ul className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <li key={m.label} className="rounded-tulay-16 border border-secondary-100 bg-surface p-5">
            <p className="text-sm text-secondary-500">{m.label}</p>
            <p className="mt-2 text-[32px] leading-10 font-medium">{String(m.value).padStart(2, "0")}</p>
            <p className="mt-2 text-xs text-quaternary">{m.caption}</p>
          </li>
        ))}
      </ul>

      <Card labelledBy="recent-heading" className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <CardTitle id="recent-heading">Latest reports</CardTitle>
          <p className="text-xs text-secondary-500">Provider-reported · Updated 04 Oct, 10:15 AM</p>
        </div>
        <TableRegion label="Latest medicine availability reports">
          <thead>
            <tr>
              <th scope="col" className={thClass}>Medicine / form</th>
              <th scope="col" className={thClass}>Status</th>
              <th scope="col" className={thClass}>Last report</th>
            </tr>
          </thead>
          <tbody>
            {medicines.slice(0, 4).map((m) => (
              <tr key={m.id}>
                <td className={tdClass}>
                  {m.genericName} {m.strength} · {m.dosageForm}
                </td>
                <td className={tdClass}>
                  {m.status === "unreported" ? <StatusBadge>Not reported</StatusBadge> : <StockBadge status={m.status} />}
                </td>
                <td className={tdClass}>{m.lastReport}</td>
              </tr>
            ))}
          </tbody>
        </TableRegion>
        <LinkButton href="/pharmacy/stock" variant="soft" className="mt-4">
          Update status
        </LinkButton>
      </Card>

      <Notice className="mt-6">
        Availability is provider-reported and does not guarantee supply.
      </Notice>
    </>
  );
}
