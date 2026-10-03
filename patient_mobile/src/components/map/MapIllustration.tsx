import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Illustrative map exported from Figma (334×280). The design marks it as a
 * placeholder for a future Leaflet/OpenStreetMap map, so it is rendered as a
 * static image with a text alternative and scales to the container width.
 */
export function MapIllustration({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-3 rounded-tulay bg-canvas p-4", className)}>
      <Image src={src} alt={alt} width={334} height={280} className="h-auto w-full" priority />
    </div>
  );
}
