import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import KPICard from "@/components/common/KPICard";
import IngredientMatrixTable from "@/components/rmInventory/IngredientMatrixTable";
import RMDepletionWaterfall from "@/components/charts/RMDepletionWaterfall";
import PurchaseOrderModal from "@/components/rmInventory/PurchaseOrderModal";
import { rmIngredients } from "@/constants/rmIngredients";
import type { PurchaseOrderLineItem } from "@/types/rmInventory";

const SUPPLIERS: Record<string, string> = {
  "milk-fat": "Parag Milk Foods",
  smp: "Gujarat Co-op Milk",
  "fresh-cream": "Amul Dairy",
  sugar: "Shree Renuka Sugars",
  stabilizer: "Kerry Ingredients India",
  "flavor-compounds": "Givaudan India",
};

const LEAD_DAYS: Record<string, number> = {
  "milk-fat": 5,
  smp: 7,
  "fresh-cream": 2,
  sugar: 10,
  stabilizer: 14,
  "flavor-compounds": 21,
};

function buildPOLineItems(): PurchaseOrderLineItem[] {
  return rmIngredients
    .filter((ing) => ing.currentStockKg < ing.forecastedDemandLiters * 1.1)
    .map((ing) => {
      const qty = Math.round(ing.forecastedDemandLiters * 1.3 - ing.currentStockKg);
      const total = qty * ing.costPerKg;
      return {
        ingredientId: ing.id,
        ingredientName: ing.name,
        quantityKg: qty,
        unitCostInr: ing.costPerKg,
        totalCostInr: total,
        suggestedSupplier: SUPPLIERS[ing.id] ?? "TBD",
        deliveryLeadDays: LEAD_DAYS[ing.id] ?? 7,
        urgency: ing.currentStockKg < ing.forecastedDemandLiters * 0.8 ? "critical" : "planned",
      };
    });
}

export default function RMInventoryPage() {
  const [selectedId, setSelectedId] = useState("milk-fat");
  const [isPOOpen, setIsPOOpen] = useState(false);

  const selectedIngredient = rmIngredients.find((i) => i.id === selectedId) ?? rmIngredients[0];
  const poLineItems = buildPOLineItems();

  const totalRMValueInr = rmIngredients.reduce((sum, ing) => sum + ing.currentStockKg * ing.costPerKg, 0);
  const expiryRiskInr = rmIngredients.reduce((sum, ing) => sum + ing.expiringSoonKg * ing.costPerKg, 0);
  const shortfallCount = rmIngredients.filter((ing) => ing.currentStockKg < ing.forecastedDemandLiters * 0.8).length;

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <section className="grid gap-4 md:grid-cols-3">
        <KPICard
          label="Total RM Inventory Value"
          value={`₹${(totalRMValueInr / 100000).toFixed(1)}L`}
          detail="Across 6 raw material categories"
        />
        <KPICard
          label="Expiry Risk Value"
          value={`₹${(expiryRiskInr / 100000).toFixed(1)}L`}
          detail="Stock expiring within 30 days"
        />
        <KPICard
          label="Coverage Shortfalls"
          value={shortfallCount.toString()}
          detail="Ingredients below 80% of forecasted demand"
        />
      </section>

      {/* Ingredient matrix */}
      <IngredientMatrixTable
        ingredients={rmIngredients}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* Depletion chart */}
      <RMDepletionWaterfall ingredient={selectedIngredient} />

      {/* Execute PO */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsPOOpen(true)}
          className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-semibold text-white shadow-md transition hover:bg-primary/80"
        >
          <ShoppingCart size={18} />
          Execute AI-Recommended Purchase Order
        </button>
      </div>

      <PurchaseOrderModal isOpen={isPOOpen} onClose={() => setIsPOOpen(false)} lineItems={poLineItems} />
    </div>
  );
}
