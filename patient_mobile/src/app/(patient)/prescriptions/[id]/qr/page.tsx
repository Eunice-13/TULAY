import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell, PageContent } from "@/components/layout/AppShell";
import { BackLink } from "@/components/ui/BackLink";
import { requirePatient } from "@/lib/auth";
import { getMyPrescription } from "@/lib/data/patient";

export const metadata: Metadata = { title: "Electronic prescription • TULAY" };

export default async function EResetaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [profile, rx] = await Promise.all([requirePatient("active"), getMyPrescription(id)]);
  if (!rx) notFound();

  return (
    <AppShell menuHref="/account" homeHref="/dashboard">
      <PageContent gap="gap-5" width="wide">
        <BackLink href={`/prescriptions/${rx.id}`} />
        <article className="w-full overflow-hidden rounded-[16px] border border-grey-200 bg-white p-4 text-black shadow-sm sm:p-7" aria-labelledby="ereseta-title">
          <header className="rounded-xl bg-primary px-4 py-6 text-center text-white sm:px-8">
            <p className="text-4xl font-bold tracking-wide sm:text-6xl">TULAY</p>
            <h1 id="ereseta-title" className="mt-1 text-xl font-bold sm:text-3xl">Sample Electronic Prescription</h1>
          </header>

          <p className="my-5 rounded-lg border-2 border-danger bg-canvas px-3 py-3 text-center text-base font-bold text-danger sm:text-xl">
            DEMO ONLY — NOT VALID FOR DISPENSING
          </p>

          <section className="border-b border-grey-200 pb-5">
            <h2 className="text-2xl font-bold sm:text-3xl">{rx.clinicName}</h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 sm:text-base">
              <div><dt className="font-bold">Patient</dt><dd>{profile.displayName ?? "Patient"} (Fictional)</dd></div>
              <div><dt className="font-bold">Date</dt><dd>{new Date(rx.issuedAt).toLocaleDateString()}</dd></div>
              <div><dt className="font-bold">Beneficiary ID</dt><dd className="font-mono break-all">{profile.id}</dd></div>
              <div><dt className="font-bold">Prescription ID</dt><dd className="font-mono break-all">{rx.id}</dd></div>
            </dl>
          </section>

          <section className="my-5 rounded-xl border-4 border-teal bg-soft p-4 text-center sm:p-6">
            <h2 className="text-base font-bold text-primary sm:text-xl">Mock Unique Prescription Security Code (UPSC)</h2>
            <p className="mt-2 font-mono text-2xl font-bold text-primary break-all sm:text-4xl">{rx.mockUpsc}</p>
            <p className="mt-2 text-sm font-semibold">For TULAY prototype testing only</p>
          </section>

          <section>
            <h2 className="border-b border-grey-200 pb-2 text-4xl font-bold">℞</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead><tr className="bg-canvas"><th className="border border-grey-200 p-3">Medicine</th><th className="border border-grey-200 p-3">Strength / Form</th><th className="border border-grey-200 p-3">Prescribed quantity</th><th className="border border-grey-200 p-3">Instructions</th></tr></thead>
                <tbody>{rx.items.map((item) => <tr key={item.medicineId}><td className="border border-grey-200 p-3 font-semibold">{item.genericName}</td><td className="border border-grey-200 p-3">{item.strength} • {item.dosageForm}</td><td className="border border-grey-200 p-3">{item.prescribedQuantity ?? "Not specified"}</td><td className="border border-grey-200 p-3">{item.instructions}</td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 border-y border-grey-200 py-5 text-sm sm:text-base">
            <p><strong>Prescriber:</strong> {rx.doctorName} (Fictional demo account)</p>
            <p className="mt-2"><strong>Signature:</strong> Not collected by this prototype</p>
          </section>

          <footer className="mt-5 rounded-xl border-2 border-teal bg-soft p-4 text-center text-sm font-semibold text-primary">
            Dispensing staff enters the mock UPSC to retrieve and review this prescription. Lookup does not authorize dispensing or consume the code.
          </footer>
          <p className="mt-4 text-center text-xs text-muted">All details are fictional. Official UPSCs are outside TULAY and belong to GAMOT.</p>
        </article>
      </PageContent>
    </AppShell>
  );
}
