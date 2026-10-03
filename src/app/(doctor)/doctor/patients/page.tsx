import type { Metadata } from "next";

import { Notice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { PatientList } from "@/features/patients/patient-list";
import { listDoctorPatients } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Your patients · TULAY" };

export default async function DoctorPatientsPage() {
  const rows = (await listDoctorPatients()).map(({ id, displayName, philHealthId, status, lastVisit }) => ({
    id,
    displayName,
    philHealthId,
    status,
    lastVisit,
  }));

  return (
    <>
      <PageHeading
        title="Your patients"
        description="Find a patient in your clinic or hospital, then open their record to share an e-reseta."
      />
      <PatientList patients={rows} />
      <Notice className="mt-6">
        Open active patient records for care. Pending accounts must be verified and activated by Clinic Staff.
      </Notice>
    </>
  );
}
