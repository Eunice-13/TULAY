import { LinkButton } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";

/** Shown when a Clinic Staff workspace without a dispensary opens a dispensing route. */
export function DispensaryRequired() {
  return (
    <div className="max-w-2xl">
      <Notice>
        Medicine dispensing is unavailable at this clinic. Your workspace is limited to account verification and
        activation.
      </Notice>
      <LinkButton href="/clinic/dashboard" variant="secondary" className="mt-4">
        Back to overview
      </LinkButton>
    </div>
  );
}
