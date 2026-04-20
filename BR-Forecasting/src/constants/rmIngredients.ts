import { RMIngredient } from "@/types/rmInventory";

const MONTHS = ["May '25", "Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25", "Nov '25", "Dec '25", "Jan '26", "Feb '26", "Mar '26", "Apr '26"];

function buildDepletionPlan(initialStock: number, monthlyConsumption: number, monthlyReplenishment: number) {
  const plan = [];
  let stock = initialStock;
  for (let i = 0; i < 12; i++) {
    const opening = Math.max(0, stock);
    const consumed = monthlyConsumption * (1 + (i < 4 ? 0.15 : 0)); // summer surge Apr–Jul
    const replenish = i % 2 === 1 ? monthlyReplenishment : 0; // replenish every 2 months
    const closing = Math.max(0, opening - consumed + replenish);
    plan.push({ month: MONTHS[i], openingStock: Math.round(opening), consumed: Math.round(consumed), closingStock: Math.round(closing) });
    stock = closing;
  }
  return plan;
}

export const rmIngredients: RMIngredient[] = [
  {
    id: "milk-fat",
    name: "Milk Fat",
    unit: "kg",
    currentStockKg: 12400,
    expiringSoonKg: 800,
    costPerKg: 580,
    priceTrend30d: "up",
    priceTrendPct: 6,
    forecastedDemandLiters: 14000,
    depletionPlan: buildDepletionPlan(12400, 1400, 3200),
  },
  {
    id: "smp",
    name: "Skimmed Milk Powder",
    unit: "kg",
    currentStockKg: 8200,
    expiringSoonKg: 300,
    costPerKg: 210,
    priceTrend30d: "stable",
    priceTrendPct: 0,
    forecastedDemandLiters: 9500,
    depletionPlan: buildDepletionPlan(8200, 950, 2000),
  },
  {
    id: "fresh-cream",
    name: "Fresh Cream",
    unit: "kg",
    currentStockKg: 3600,
    expiringSoonKg: 1200,
    costPerKg: 180,
    priceTrend30d: "up",
    priceTrendPct: 3,
    forecastedDemandLiters: 4800,
    depletionPlan: buildDepletionPlan(3600, 480, 1100),
  },
  {
    id: "sugar",
    name: "Sugar",
    unit: "kg",
    currentStockKg: 22000,
    expiringSoonKg: 0,
    costPerKg: 42,
    priceTrend30d: "down",
    priceTrendPct: -2,
    forecastedDemandLiters: 18000,
    depletionPlan: buildDepletionPlan(22000, 1800, 4000),
  },
  {
    id: "stabilizer",
    name: "Stabilizer Mix",
    unit: "kg",
    currentStockKg: 1800,
    expiringSoonKg: 0,
    costPerKg: 320,
    priceTrend30d: "up",
    priceTrendPct: 11,
    forecastedDemandLiters: 1400,
    depletionPlan: buildDepletionPlan(1800, 140, 320),
  },
  {
    id: "flavor-compounds",
    name: "Flavor Compounds",
    unit: "kg",
    currentStockKg: 980,
    expiringSoonKg: 120,
    costPerKg: 1200,
    priceTrend30d: "stable",
    priceTrendPct: 0,
    forecastedDemandLiters: 860,
    depletionPlan: buildDepletionPlan(980, 86, 200),
  },
];
