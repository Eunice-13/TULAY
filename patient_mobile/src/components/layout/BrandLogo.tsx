import Image from "next/image";
import { cn } from "@/lib/cn";
import logo from "@/assets/tulay-logo.png";

/** TULAY / Phone / Brand logo (57:92) — original LOCAL REPO transparent logo. */
export function BrandLogo({
  width = 116,
  height = 44,
  className,
  priority,
}: {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden rounded-tulay", className)}
      style={{ width, height }}
    >
      <Image
        src={logo}
        alt="TULAY"
        fill
        sizes={`${width}px`}
        priority={priority}
        unoptimized
        className="pointer-events-none object-cover object-[center_44%]"
      />
    </span>
  );
}
