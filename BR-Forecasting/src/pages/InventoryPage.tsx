import InventoryHeatmap from "@/components/charts/InventoryHeatmap";
import StatusBadge from "@/components/common/StatusBadge";
import TransferOpportunities from "@/components/inventory/TransferOpportunities";
import { useInventoryHealth } from "@/hooks/useInventoryHealth";
import { dataApi } from "@/data";

export default function InventoryPage() {
  const { inventory } = useInventoryHealth();
  const productMap = new Map(dataApi.products.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <InventoryHeatmap inventory={inventory} />

      {/* Transfer before reorder */}
      <TransferOpportunities />

      <section className="panel overflow-hidden p-5">
        <p className="label mb-1">Reorder queue</p>
        <p className="subtle mb-4 text-xs">
          {inventory.filter((i) => i.status === "critical").length} critical ·{" "}
          {inventory.filter((i) => i.status === "watch").length} watch ·{" "}
          {inventory.filter((i) => i.status === "excess").length} excess for this store
        </p>
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-brown/60">
              <tr>
                <th className="pb-3 pr-4">Product</th>
                <th className="pb-3 pr-4">QOH</th>
                <th className="pb-3 pr-4">Days Cover</th>
                <th className="pb-3 pr-4">Reorder Point</th>
                <th className="pb-3 pr-4">EOQ</th>
                <th className="pb-3 pr-4">Unit Margin</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.slice(0, 12).map((item) => {
                const product = productMap.get(item.productId);
                const margin = product ? product.basePrice - product.costPrice : 0;
                return (
                  <tr key={item.productId} className="border-t border-brown/10">
                    <td className="py-3 pr-4 font-medium text-brown">
                      {product?.name ?? item.productId}
                    </td>
                    <td className="pr-4">{Math.round(item.quantityOnHand)}</td>
                    <td className="pr-4">
                      <span className={
                        item.daysOfStock < 5 ? "font-semibold text-rose-600" :
                        item.daysOfStock < 14 ? "font-semibold text-amber-600" :
                        "text-green-700"
                      }>
                        {Math.round(item.daysOfStock)}d
                      </span>
                    </td>
                    <td className="pr-4">{Math.round(item.reorderPoint)}</td>
                    <td className="pr-4">{Math.round(item.eoqQuantity)}</td>
                    <td className="pr-4 text-brown/70">₹{margin}</td>
                    <td><StatusBadge status={item.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
