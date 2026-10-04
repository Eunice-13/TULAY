import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { Card, CardTitle, DetailItem } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { AccountStatusBadge } from "@/components/ui/status-badge";
import { BenefitEstimate } from "@/features/patients/benefit-estimate";
import { PrescriptionCard } from "@/features/prescriptions/prescription-card";
import { getPatientForDoctor, listPrescriptionsForPatient } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Patient record · TULAY" };

const tabs = [
  { key: "ereseta", label: "E-reseta" },
  { key: "benefit", label: "Benefit estimate" },
  { key: "history", label: "Prescription history" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

/** Figma M8D / M8L — patient record and e-reseta thread. */
export default async function PatientRecordPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const patient = await getPatientForDoctor(id);
  if (!patient) notFound();

  if (patient.status !== "active") {
    return (
      <>
        <PageHeading
          title={patient.displayName}
          description={`${patient.philHealthId} · Pending activation`}
          actions={
            <LinkButton href="/doctor/patients" variant="secondary">
              <span aria-hidden="true">←</span> All patients
            </LinkButton>
          }
        />
        <Notice>
          This account is pending. Clinic Staff must verify the patient in person and activate the account before
          you can open the record or send an e-reseta.
        </Notice>
      </>
    );
  }

  const activeTab: TabKey = tabs.some((t) => t.key === tab) ? (tab as TabKey) : "ereseta";
  const prescriptions = await listPrescriptionsForPatient(patient.id);

  return (
    <>
      <PageHeading
        title={patient.displayName}
        description={`${patient.philHealthId} · Active patient · Your assigned clinic`}
        actions={
          <>
            <LinkButton href="/doctor/patients" variant="secondary">
              <span aria-hidden="true">←</span> All patients
            </LinkButton>
            <LinkButton href={`/doctor/prescriptions/new?patient=${patient.id}`}>Send e-reseta</LinkButton>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Card labelledBy="info-heading">
          <div className="flex items-center justify-between gap-3">
            <CardTitle id="info-heading">Patient information</CardTitle>
            <AccountStatusBadge status={patient.status} />
          </div>
          <dl className="mt-4 grid gap-4">
            <DetailItem label="Name" value={patient.displayName} />
            <DetailItem label="Date of birth" value={patient.birthDate} />
            <DetailItem label="PhilHealth ID" value={patient.philHealthId} />
            <DetailItem label="Account status" value="Active" />
            <DetailItem label="Registered" value={patient.registeredAt} />
            <DetailItem label="Assigned facility" value="Your clinic" />
          </dl>
          <LinkButton href={`/doctor/patients/${patient.id}/profile`} variant="soft" className="mt-5">
            View verified profile
          </LinkButton>
        </Card>

        <Card labelledBy="thread-heading">
          <h2 id="thread-heading" className="sr-only">
            Patient care tabs
          </h2>
          <nav aria-label="Patient record sections">
            <ul className="flex flex-wrap gap-2 border-b border-secondary-100 pb-3">
              {tabs.map((t) => (
                <li key={t.key}>
                  <Link
                    href={`/doctor/patients/${patient.id}?tab=${t.key}`}
                    aria-current={activeTab === t.key ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-tulay-8 px-3 text-sm font-semibold ${
                      activeTab === t.key ? "bg-tertiary" : "text-secondary-500 hover:bg-canvas"
                    }`}
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-5">
            {activeTab === "benefit" ? (
              <BenefitEstimate />
            ) : (
              <>
                <p className="mb-4 text-sm text-secondary-500">
                  {activeTab === "ereseta"
                    ? "E-reseta shared by doctors appears in the patient's dashboard."
                    : "All e-reseta issued to this patient, newest first."}
                </p>
                {prescriptions.length === 0 ? (
                  <Notice>No e-reseta has been sent to this patient yet.</Notice>
                ) : (
                  <div className="flex flex-col gap-4">
                    {(activeTab === "ereseta" ? prescriptions.slice(0, 1) : prescriptions).map((rx) => (
                      <PrescriptionCard key={rx.id} rx={rx} />
                    ))}
                  </div>
                )}
                {activeTab === "ereseta" ? (
                  <div className="mt-6 rounded-tulay-12 border border-secondary-100 p-4">
                    <h3 className="text-sm font-semibold">Share an e-reseta with {patient.firstName}</h3>
                    <p className="mt-1 text-sm text-secondary-500">
                      Enter the prescription. TULAY generates its unique UPSC when you send it.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <LinkButton href={`/doctor/prescriptions/new?patient=${patient.id}`}>Send e-reseta</LinkButton>
                      <LinkButton href={`/doctor/referrals/escalate?patient=${patient.id}`} variant="secondary">
                        Create referral
                      </LinkButton>
                    </div>
                    <p className="mt-3 text-xs text-secondary-500">
                      Need to escalate care? Create a referral and add a continuation e-reseta when applicable.
                    </p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
