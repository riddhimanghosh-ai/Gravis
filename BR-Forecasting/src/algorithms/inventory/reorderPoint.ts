export const calculateReorderPoint = (averageDailyDemand: number, averageLeadTimeDays: number, safetyStock: number) =>
  averageDailyDemand * averageLeadTimeDays + safetyStock;
