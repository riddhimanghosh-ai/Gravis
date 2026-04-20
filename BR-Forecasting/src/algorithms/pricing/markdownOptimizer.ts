import { demandAtPrice, revenueAtPrice } from "./elasticity";

export const optimizeMarkdown = (
  baseDemand: number,
  basePrice: number,
  elasticity: number,
  baseCost: number,
  range: readonly [number, number],
) => {
  let best = { discountPct: range[0], revenue: 0, profit: 0, units: baseDemand };

  for (let discount = range[0]; discount <= range[1]; discount += 5) {
    const newPrice = basePrice * (1 - discount / 100);
    const units = demandAtPrice(baseDemand, basePrice, newPrice, elasticity);
    const revenue = revenueAtPrice(baseDemand, basePrice, newPrice, elasticity);
    const profit = (newPrice - baseCost) * units;
    if (profit > best.profit) {
      best = { discountPct: discount, revenue, profit, units };
    }
  }

  return best;
};
