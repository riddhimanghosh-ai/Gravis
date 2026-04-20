import type { InventorySnapshot } from "@/types";
import HeatmapCell from "@/components/common/HeatmapCell";

export default function InventoryHeatmap({ inventory }: { inventory: InventorySnapshot[] }) {
  return (
    <div className="panel p-5">
      <p className="label">Days of stock heatmap</p>
      <div className="mt-4 grid grid-cols-3 gap-3 lg:grid-cols-5">
        {inventory.slice(0, 15).map((item) => (
          <HeatmapCell key={`${item.storeId}-${item.productId}`} value={item.daysOfStock} />
        ))}
      </div>
    </div>
  );
}
