export const demandAtPrice = (baseDemand: number, basePrice: number, newPrice: number, elasticity: number) =>
  baseDemand * (newPrice / Math.max(basePrice, 0.01)) ** elasticity;

export const revenueAtPrice = (baseDemand: number, basePrice: number, newPrice: number, elasticity: number) =>
  newPrice * demandAtPrice(baseDemand, basePrice, newPrice, elasticity);
