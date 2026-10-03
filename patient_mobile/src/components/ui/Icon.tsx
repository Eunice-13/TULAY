import Image from "next/image";
import { patientAsset } from "@/lib/paths";

/**
 * TULAY / Icon / * — 24px editable stroke SVGs exported from Figma into
 * /public/icons. Icons are decorative by default; pass `label` when an icon
 * carries meaning on its own.
 */
export type IconName =
  | "arrow"
  | "back"
  | "calendar"
  | "check"
  | "guide"
  | "home"
  | "hospital"
  | "menu"
  | "pin"
  | "rx"
  | "wallet"
  | (string & {});

type IconProps = {
  name: IconName;
  size?: number;
  label?: string;
  className?: string;
};

export function Icon({ name, size = 24, label, className }: IconProps) {
  return (
    <Image
      src={patientAsset(`/icons/${name}.svg`)}
      width={size}
      height={size}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      className={["shrink-0", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
    />
  );
}
