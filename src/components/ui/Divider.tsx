import { cn } from "@/lib/cn";

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("h-px w-full border-0 bg-canvas", className)} />;
}
