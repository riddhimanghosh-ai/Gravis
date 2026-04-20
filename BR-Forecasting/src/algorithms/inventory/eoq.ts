export const calculateEOQ = (
  annualDemand: number,
  orderCost: number,
  holdingCost: number,
  shelfLifeDays: number,
  reorderCycleDays: number,
) => {
  const raw = Math.sqrt((2 * annualDemand * orderCost) / Math.max(holdingCost, 0.01));
  return raw * Math.min(1, shelfLifeDays / Math.max(reorderCycleDays, 1));
};
