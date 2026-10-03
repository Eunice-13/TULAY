import Image from "next/image";
import { cn } from "@/lib/cn";

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
        src="/tulay-logo.png"
        alt="TULAY"
        fill
        sizes={`${width}px`}
        priority={priority}
        className="pointer-events-none object-cover"
      />
    </span>
  );
}
