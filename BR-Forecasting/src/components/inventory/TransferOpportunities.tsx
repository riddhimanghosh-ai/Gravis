import { ArrowRight, PackageCheck } from "lucide-react";
import { dataApi } from "@/data";

interface TransferSuggestion {
  productId: string;
  productName: string;
  fromStore: string;
  fromStoreId: string;
  toStore: string;
  toStoreId: string;
  transferQty: number;
  coverageDaysGained: number;
  costSavedInr: number;
}

function buildTransferSuggestions(): TransferSuggestion[] {
  const productMap = new Map(dataApi.products.map((p) => [p.id, p]));
  const storeMap = new Map(dataApi.stores.map((s) => [s.id, s]));

  // Group inventory by productId
  const byProduct = new Map<string, typeof dataApi.inventory>();
  for (const item of dataApi.inventory) {
    const list = byProduct.get(item.productId) ?? [];
    list.push(item);
    byProduct.set(item.productId, list);
  }

  const suggestions: TransferSuggestion[] = [];

  for (const [productId, items] of byProduct.entries()) {
    const excessItems = items.filter((i) => i.status === "excess" && i.quantityOnHand > i.safetyStockLevel * 2);
    const criticalItems = items.filter((i) => i.status === "critical");
    if (excessItems.length === 0 || criticalItems.length === 0) continue;

    const product = productMap.get(productId);
    if (!product) continue;

    // Match excess sources to critical destinations
    for (const critical of criticalItems.slice(0, 2)) {
      const source = excessItems[0];
      if (!source) break;

      const fromStore = storeMap.get(source.storeId);
      const toStore = storeMap.get(critical.storeId);
      if (!fromStore || !toStore || fromStore.id === toStore.id) continue;

      // Transfer enough to bring critical store to 80% of safety stock
      const needed = Math.round(critical.safetyStockLevel * 1.5 - critical.quantityOnHand);
      const available = Math.round(source.quantityOnHand - source.safetyStockLevel * 1.2);
      if (needed <= 0 || available <= 0) continue;

      const qty = Math.min(needed, available);
      const dailyDemand = critical.safetyStockLevel / 7; // rough estimate
      const daysGained = dailyDemand > 0 ? Math.round(qty / dailyDemand) : 7;
      const costSaved = qty * product.costPrice * 0.15; // 15% of ordering a fresh batch

      suggestions.push({
        productId,
        productName: product.name,
        fromStore: fromStore.name,
        fromStoreId: fromStore.id,
        toStore: toStore.name,
        toStoreId: toStore.id,
        transferQty: qty,
        coverageDaysGained: daysGained,
        costSavedInr: Math.round(costSaved),
      });
    }

    if (suggestions.length >= 5) break;
  }

  return suggestions.sort((a, b) => b.costSavedInr - a.costSavedInr);
}

const suggestions = buildTransferSuggestions();

export default function TransferOpportunities() {
  if (suggestions.length === 0) return null;

  const totalSaving = suggestions.reduce((s, t) => s + t.costSavedInr, 0);

  return (
    <section className="panel p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="label">Transfer Opportunities</p>
          <p className="subtle mt-0.5 text-xs">
            Rebalance before reordering — saves{" "}
            <span className="font-semibold text-green-700">₹{totalSaving.toLocaleString()}</span> in avoided procurement costs
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          <PackageCheck size={12} />
          {suggestions.length} suggestions
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-2xl border border-brown/10 bg-white px-4 py-3"
          >
            {/* Product */}
            <div className="w-36 flex-shrink-0">
              <p className="text-xs font-semibold text-brown">{s.productName}</p>
              <p className="text-xs text-brown/50">{s.transferQty} units</p>
            </div>

            {/* Route */}
            <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
              <span className="truncate rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                Excess: {s.fromStore}
              </span>
              <ArrowRight size={14} className="flex-shrink-0 text-brown/40" />
              <span className="truncate rounded-xl bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800">
                Critical: {s.toStore}
              </span>
            </div>

            {/* Impact */}
            <div className="flex-shrink-0 text-right">
              <p className="text-xs font-semibold text-green-700">+{s.coverageDaysGained}d coverage</p>
              <p className="text-[10px] text-brown/50">saves ₹{s.costSavedInr.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
