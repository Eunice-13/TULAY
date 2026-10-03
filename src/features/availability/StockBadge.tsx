import { Badge } from "@/components/ui/Badge";
import type { StockStatus } from "./mock-data";

/** In Stock: bold green, no fill · Out of Stock: regular teal on light blue (222:3860 / 222:3866). */
export function StockBadge({ status }: { status: StockStatus }) {
  return status === "in-stock" ? (
    <Badge tone="positive" filled={false} align="left">
      In Stock
    </Badge>
  ) : (
    <Badge weight="normal" align="left">
      Out of Stock
    </Badge>
  );
}
