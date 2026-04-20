export const thresholds = {
  serviceLevelZScore: 1.65,
  anomalyWatchZ: 2,
  anomalyCriticalZ: 3,
  productiveRatePerHour: 12,
  markdownDiscountRange: [10, 60] as const,
  abcCutoffs: {
    a: 0.8,
    b: 0.95,
  },
};
