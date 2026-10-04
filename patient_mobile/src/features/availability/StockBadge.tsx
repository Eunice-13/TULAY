import { Badge } from "@/components/ui/Badge";
import type { AvailabilityRecord } from "@/types/domain";

/** In Stock: bold green, no fill · Out of Stock: regular teal on light blue (222:3860 / 222:3866). */
export function StockBadge({ status }: { status: AvailabilityRecord["status"] }) {
  return status === "available" ? (
    <Badge tone="positive" filled={false} align="left">
      In Stock
    </Badge>
  ) : (
    <Badge weight="normal" align="left">
      Out of Stock
    </Badge>
  );
}
