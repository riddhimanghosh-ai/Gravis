export const zScore = (values: number[], target: number) => {
  const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.sqrt(variance) || 1;
  return (target - mean) / stdDev;
};

export const detectAnomaly = (values: number[], target: number) => {
  const score = zScore(values, target);
  return {
    z: score,
    severity: Math.abs(score) > 3 ? "critical" : Math.abs(score) > 2 ? "watch" : "normal",
  };
};
