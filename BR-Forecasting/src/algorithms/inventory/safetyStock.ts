export const calculateSafetyStock = (
  zScore: number,
  averageLeadTimeDays: number,
  demandStdDev: number,
  averageDailyDemand: number,
  leadTimeStdDev: number,
) => zScore * Math.sqrt(averageLeadTimeDays * demandStdDev ** 2 + averageDailyDemand ** 2 * leadTimeStdDev ** 2);
