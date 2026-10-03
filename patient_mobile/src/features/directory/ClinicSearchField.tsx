import { TextField } from "@/components/ui/TextField";

/** "Search clinics" input (222:2901). The empty hint line in Figma keeps a 20px spacer. */
export function ClinicSearchField({ className, label = "Search clinics" }: { className?: string; label?: string }) {
  return (
    <div className={className}>
      <TextField
        tone="muted"
        label={label}
        type="search"
        name="q"
        defaultValue="Quezon City"
        autoComplete="address-level2"
      />
      <span aria-hidden="true" className="mt-2 block h-5" />
    </div>
  );
}
