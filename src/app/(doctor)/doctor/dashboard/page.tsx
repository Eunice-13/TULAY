import type { Metadata } from "next";
import Link from "next/link";

import { LinkButton } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TableRegion, tdClass, thClass } from "@/components/ui/data-table";
import { Notice } from "@/components/ui/notice";
import { PageHeading } from "@/components/ui/page-heading";
import { getDoctorDashboard } from "@/lib/data/queries";

export const metadata: Metadata = { title: "Doctor overview · TULAY" };

export default async function DoctorDashboardPage() {
  const summary = await getDoctorDashboard();
  const today = summary.todayAppointments;

  const metrics = [
    { label: "Today's appointments", value: today.length, caption: "Appointments scheduled at your facility" },
    { label: "Patients with records today", value: new Set(today.map((a) => a.patientId)).size, caption: "Consultations in your facility" },
    { label: "Incoming referrals", value: summary.incomingReferrals, caption: `${summary.awaitingReview} awaiting review` },
    { label: "E-reseta sent today", value: summary.eresetaSentToday, caption: "Shared through patient records" },
  ];

  return (
    <>
      <PageHeading
        title="Good morning, Dr. Reyes"
        description="Your clinic's care activity at a glance."
        actions={<LinkButton href="/doctor/patients">Find a patient</LinkButton>}
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <li key={m.label} className="rounded-tulay-16 border border-secondary-100 bg-surface p-5">
            <p className="text-sm text-secondary-500">{m.label}</p>
            <p className="mt-2 text-[32px] leading-10 font-medium">{String(m.value).padStart(2, "0")}</p>
            <p className="mt-2 text-xs text-quaternary">{m.caption}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card labelledBy="today-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <CardTitle id="today-heading">Today's appointments</CardTitle>
            <LinkButton href="/doctor/appointments" variant="secondary">
              View all
            </LinkButton>
          </div>
          <TableRegion label="Today's appointments">
            <thead>
              <tr>
                <th scope="col" className={thClass}>Patient</th>
                <th scope="col" className={thClass}>Time / service</th>
              </tr>
            </thead>
            <tbody>
              {today.map((a) => (
                <tr key={a.id} className="hover:bg-canvas">
                  <td className={tdClass}>
                    {a.patientId ? (
                      <Link href={`/doctor/patients/${a.patientId}`} className="underline-offset-4 hover:underline">
                        {a.patientName}
                      </Link>
                    ) : (
                      a.patientName
                    )}
                  </td>
                  <td className={tdClass}>
                    {a.time} · {a.service}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableRegion>
        </Card>

        <Card labelledBy="care-heading">
          <CardTitle id="care-heading">Keep care moving</CardTitle>
          <ul className="mt-4 flex flex-col gap-5">
            {[
              { t: "Review patient records", b: "Prescriptions and patient care history", h: "/doctor/patients" },
              { t: "Review incoming referrals", b: "Screening findings and urgency", h: "/doctor/referrals" },
              { t: "Send an e-reseta", b: "Open a patient and attach their prescription", h: "/doctor/patients" },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="text-sm font-semibold">{item.t}</h3>
                <p className="mt-1 text-sm text-secondary-500">{item.b}</p>
                <LinkButton href={item.h} variant="soft" className="mt-2" aria-label={`Open: ${item.t}`}>
                  Open
                </LinkButton>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Notice className="mt-6">
        Only patients assigned to your clinic or hospital appear in this workspace.
      </Notice>
    </>
  );
}
