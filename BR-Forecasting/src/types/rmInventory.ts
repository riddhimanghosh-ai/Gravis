export type PriceTrend = "up" | "down" | "stable";

export interface DepletionMonth {
  month: string;
  openingStock: number;
  consumed: number;
  closingStock: number;
}

export interface RMIngredient {
  id: string;
  name: string;
  unit: "kg" | "L";
  currentStockKg: number;
  expiringSoonKg: number;
  costPerKg: number;
  priceTrend30d: PriceTrend;
  priceTrendPct: number;
  forecastedDemandLiters: number;
  depletionPlan: DepletionMonth[];
}

export interface PurchaseOrderLineItem {
  ingredientId: string;
  ingredientName: string;
  quantityKg: number;
  unitCostInr: number;
  totalCostInr: number;
  suggestedSupplier: string;
  deliveryLeadDays: number;
  urgency: "critical" | "planned";
}
