import { MapIllustration } from "@/components/map/MapIllustration";
import { BackLink } from "@/components/ui/BackLink";
import { ButtonLink } from "@/components/ui/Button";
import { InfoRow } from "@/components/ui/InfoRow";
import { patientAsset } from "@/lib/paths";
import { CLINICS } from "./mock-data";

/** "Care on the Map" body shared by P3 • Pending clinic map (222:4982) and P3 • Provider map (222:3342). */
type CareMapProps = {
  backHref: string;
  clinicHref: string;
  listHref: string;
  /** Active frame (222:3342) uses "Care on the map" / "View Clinic". */
  variant?: "pending" | "active";
};

export function CareMap({ backHref, clinicHref, listHref, variant = "pending" }: CareMapProps) {
  const clinic = CLINICS[0];
  const active = variant === "active";
  const cta = active ? "View Clinic" : "View clinic";
  return (
    <>
      <BackLink href={backHref} />
      <h1 className="w-full text-2xl font-semibold text-primary">{active ? "Care on the map" : "Care on the Map"}</h1>
      <p className="w-full text-sm text-muted">Illustrative locations near your entered address.</p>

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr] lg:items-start lg:gap-8">
        <div className="flex flex-col gap-5">
          <MapIllustration
            src={patientAsset("/icons/map-clinics.svg")}
            alt="Illustrative map showing Demo Community Clinic, a pharmacy and your entered location."
          />
          <p className="w-full text-sm text-muted">Clinic • Pharmacy • Your entered location</p>
        </div>

        <div className="flex flex-col gap-5">
          <article
            aria-labelledby="map-clinic"
            className="flex w-full flex-col gap-3 rounded-tulay border border-canvas bg-surface p-4"
          >
            <InfoRow title={<span id="map-clinic">{clinic.name}</span>}>
              Clinic • Demo facility
              <br />
              {clinic.distanceKm} km • Open until 5:00 PM
            </InfoRow>
            <ButtonLink href={clinicHref} variant="secondary" aria-label={`${cta}: ${clinic.name}`}>
              {cta}
            </ButtonLink>
          </article>
          <ButtonLink href={listHref} variant="secondary">
            List view
          </ButtonLink>
          <p className="w-full text-sm text-muted">Illustrative map. Kiro can replace it with Leaflet and OpenStreetMap.</p>
        </div>
      </div>
    </>
  );
}
