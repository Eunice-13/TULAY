import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** Clinic activation heading • lock and subtext (Pending • Protected access, 222:3060). */
export function ProtectedAccessMessage({
  ctaHref = "/onboarding/clinic",
  ctaLabel = "Browse Nearby Clinics",
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <>
      <div className="flex w-full items-center gap-3">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-tulay bg-soft">
          <Icon name="lock" size={36} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1 break-words-safe">
          <h1 className="text-xl font-bold text-primary [line-height:1.45]">Clinic Activation Required</h1>
          <p className="text-sm text-black">This feature becomes available after your in-person verification.</p>
        </div>
      </div>
      <p className="w-full text-sm text-black">
        Browse available clinics based on your address for walk-in registration.
      </p>
      <ButtonLink href={ctaHref}>{ctaLabel}</ButtonLink>
    </>
  );
}
