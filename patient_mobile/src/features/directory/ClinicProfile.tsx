import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { BackLink } from "@/components/ui/BackLink";
import { Divider } from "@/components/ui/Divider";
import { InfoRow } from "@/components/ui/InfoRow";
import type { Facility } from "./mock-data";

/**
 * Clinic profile body shared by P3 • Clinic profile (222:2950, pending) and
 * P3 • Active clinic profile (222:4856). `children` renders the
 * state-specific call-to-action block below the clinic notice.
 */
type ClinicProfileProps = {
  facility: Facility;
  backHref: string;
  /** Active frame (222:4856) title-cases "Clinic Notice" and the contact line. */
  variant?: "pending" | "active";
  children: ReactNode;
};

export function ClinicProfile({ facility, backHref, variant = "pending", children }: ClinicProfileProps) {
  const active = variant === "active";
  const profile = facility.profile;
  return (
    <>
      <BackLink href={backHref} />
      <h1 className="w-full text-2xl font-semibold text-primary">{facility.name}</h1>
      <p className="w-full text-sm text-muted">Clinic profile • Illustrative facility</p>
      {profile ? (
        <>
          <Badge tone="black">{profile.openToday}</Badge>
          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col gap-5">
              <InfoRow title="Address">
                {profile.fullAddress}
                <br />
                {facility.distanceKm} km from your entered address
              </InfoRow>
              <InfoRow title="Contact">{active ? "Demo Contact Information" : profile.contact}</InfoRow>
              <Divider />
              <InfoRow title="Services">
                <ul>
                  {profile.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
              </InfoRow>
              <InfoRow title={active ? "Clinic Notice" : "Clinic notice"}>{profile.notice}</InfoRow>
            </div>
            <div className="flex flex-col gap-5">
              {children}
              <p className="w-full text-sm text-muted">
                {profile.source}
                <br />
                {profile.updatedAt}
              </p>
            </div>
          </div>
        </>
      ) : (
        <InfoRow title="Address">
          {facility.distanceKm} km • {facility.address}
          <br />
          {facility.hours}
        </InfoRow>
      )}
    </>
  );
}
