import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { Card, CardTitle, DetailItem } from "@/components/ui/card";
import { PageHeading } from "@/components/ui/page-heading";
import { BenefitEstimate } from "@/features/patients/benefit-estimate";
import { PrescriptionCard } from "@/features/prescriptions/prescription-card";
import {
  getPatientForDoctor,
  listAppointments,
  listPrescriptionsForPatient,
  listReferrals,
} from "@/lib/data/queries";

export const metadata: Metadata = { title: "Patient profile · TULAY" };

/** Figma M8P — full patient profile and care history. */
export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatientForDoctor(id);
  if (!patient) notFound();
  if (patient.status !== "active") redirect(`/doctor/patients/${patient.id}`);

  const prescriptions = await listPrescriptionsForPatient(patient.id);
  const referrals = (await listReferrals()).filter((r) => r.patientId === patient.id);
  const appointments = (await listAppointments()).appointments.filter((a) => a.patientId === patient.id);

  return (
    <>
      <PageHeading
        title={`${patient.displayName} · Patient record`}
        description="Verified account information and care history."
        actions={
          <LinkButton href={`/doctor/patients/${patient.id}`} variant="secondary">
            <span aria-hidden="true">←</span> E-reseta thread
          </LinkButton>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card labelledBy="pi-heading">
          <CardTitle id="pi-heading">Patient information</CardTitle>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <DetailItem label="Name" value={patient.displayName} />
            <DetailItem label="Birth date" value={patient.birthDate} />
            <DetailItem label="PhilHealth ID" value={patient.philHealthId} />
            <DetailItem label="Account" value="Active · Assigned facility: Your clinic" />
            <DetailItem label="Registered" value={patient.registeredAt} />
          </dl>
          <p className="mt-5 text-sm text-secondary-500">
            TULAY only shows fields returned by the protected clinic-assignment lookup. Additional demographic
            details are not stored in this hackathon MVP.
          </p>
        </Card>

        <div className="flex flex-col gap-6">
          <Card labelledBy="rx-heading">
            <CardTitle id="rx-heading">Prescriptions</CardTitle>
            <div className="mt-4 flex flex-col gap-4">
              {prescriptions.map((rx) => (
                <PrescriptionCard key={rx.id} rx={rx} />
              ))}
              {prescriptions.length === 0 ? (
                <p className="text-sm text-secondary-500">No e-reseta on record.</p>
              ) : null}
            </div>
            <p className="mt-4 text-sm text-secondary-500">
              Referrals · {referrals.length} &nbsp;·&nbsp; Appointments · {appointments.length}
            </p>
          </Card>
          <BenefitEstimate />
        </div>
      </div>
    </>
  );
}
