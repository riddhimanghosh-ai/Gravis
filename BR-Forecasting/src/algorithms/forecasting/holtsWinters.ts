export interface HoltWintersResult {
  fitted: number[];
  forecast: number[];
  residualStdDev: number;
}

export const holtWinters = (
  values: number[],
  seasonLength: number,
  alpha = 0.35,
  beta = 0.15,
  gamma = 0.25,
  horizon = 14,
): HoltWintersResult => {
  if (values.length < seasonLength * 2) {
    const fallback = values[values.length - 1] ?? 0;
    return {
      fitted: values,
      forecast: Array.from({ length: horizon }, () => fallback),
      residualStdDev: Math.max(fallback * 0.1, 1),
    };
  }

  let level = values.slice(0, seasonLength).reduce((sum, value) => sum + value, 0) / seasonLength;
  let trend =
    values.slice(seasonLength, seasonLength * 2).reduce((sum, value, index) => {
      return sum + (value - values[index]) / seasonLength;
    }, 0) / seasonLength;

  const seasonal = Array.from({ length: seasonLength }, (_, index) => values[index] / Math.max(level, 1));
  const fitted: number[] = [];

  values.forEach((value, index) => {
    const season = seasonal[index % seasonLength] ?? 1;
    const previousLevel = level;
    level = alpha * (value / Math.max(season, 0.01)) + (1 - alpha) * (level + trend);
    trend = beta * (level - previousLevel) + (1 - beta) * trend;
    seasonal[index % seasonLength] = gamma * (value / Math.max(level, 0.01)) + (1 - gamma) * season;
    fitted.push((previousLevel + trend) * season);
  });

  const residuals = values.map((value, index) => value - fitted[index]);
  const residualStdDev = Math.sqrt(
    residuals.reduce((sum, residual) => sum + residual ** 2, 0) / Math.max(residuals.length, 1),
  );

  const forecast = Array.from({ length: horizon }, (_, step) => {
    const season = seasonal[(values.length + step) % seasonLength] ?? 1;
    return (level + (step + 1) * trend) * season;
  });

  return { fitted, forecast, residualStdDev };
};
