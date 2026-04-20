export const promotionImpact = (baseDemand: number, discountPct: number, visibilityBoost: number, elasticity: number) => {
  const priceFactor = (1 - discountPct / 100) ** elasticity;
  return baseDemand * priceFactor * visibilityBoost;
};
