import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { EResetaComposer } from "@/features/prescriptions/ereseta-composer";
import { getPatientForDoctor, listPrescribableMedicines } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Send an e-reseta · TULAY" };

/** Figma M4 / M4R. Only active patients assigned to the doctor's clinic. */
export default async function NewPrescriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ patient?: string }>;
}) {
  const { patient: patientId } = await searchParams;
  const patient = patientId ? await getPatientForDoctor(patientId) : null;
  if (!patient) redirect("/doctor/patients");
  const medicines = await listPrescribableMedicines();

  return (
    <>
      <PageHeading
        title="Send an e-reseta"
        description="Enter the prescription from the physical checkup and share it with the selected patient."
        actions={
          <LinkButton href={`/doctor/patients/${patient.id}`} variant="secondary">
            <span aria-hidden="true">←</span> Patient record
          </LinkButton>
        }
      />
      {patient.status === "active" ? (
        <EResetaComposer
          patient={{
            id: patient.id,
            displayName: patient.displayName,
            firstName: patient.firstName,
            philHealthId: patient.philHealthId,
          }}
          medicines={medicines}
        />
      ) : (
        <Notice>
          {patient.displayName}'s account is pending. An e-reseta can only be sent after Clinic Staff activate the
          account in person.
        </Notice>
      )}
    </>
  );
}
