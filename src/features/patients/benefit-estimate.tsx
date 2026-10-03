import { StatusBadge } from "@/components/ui/status-badge";

/**
 * Figma M8P "Estimated remaining benefit". Mock-only: no claim values exist,
 * so no balance is calculated. Not an official PhilHealth benefit balance.
 */
export function BenefitEstimate() {
  return (
    <section aria-labelledby="benefit-heading" className="rounded-tulay-12 border border-secondary-100 p-4">
      <h3 id="benefit-heading" className="text-sm font-semibold">
        Estimated remaining benefit
      </h3>
      <p className="mt-2 text-lg font-medium">Awaiting recorded claim values</p>
      <p className="mt-1 text-sm leading-6 text-secondary-500">
        Starting ceiling: ₱20,000. No claim values have been recorded yet, so a remaining balance is not
        calculated.
      </p>
      <div className="mt-3">
        <StatusBadge tone="warning">Estimate only · Not an official PhilHealth balance</StatusBadge>
      </div>
    </section>
  );
}
