export interface ShiftNeed {
  hour: number;
  demand: number;
  recommendedStaff: number;
}

export const optimizeShifts = (hourlyDemand: number[], productiveRate = 12, floorStaff = 2): ShiftNeed[] =>
  hourlyDemand.map((demand, index) => ({
    hour: index,
    demand,
    recommendedStaff: Math.max(floorStaff, Math.ceil(demand / productiveRate) * 1.15),
  }));
