export const simpleMovingAverage = (values: number[], window: number) =>
  values.length < window
    ? values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1)
    : values.slice(-window).reduce((sum, value) => sum + value, 0) / window;

export const weightedMovingAverage = (values: number[], weights: number[]) => {
  const windowValues = values.slice(-weights.length);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  return windowValues.reduce((sum, value, index) => sum + value * weights[index], 0) / totalWeight;
};

export const exponentialMovingAverage = (values: number[], alpha: number) => {
  if (values.length === 0) return 0;
  return values.slice(1).reduce((ema, value) => alpha * value + (1 - alpha) * ema, values[0]);
};
