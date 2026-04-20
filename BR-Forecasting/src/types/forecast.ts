export type ForecastGranularity = "hourly" | "daily" | "weekly" | "monthly";
export type ForecastMethod = "holt_winters" | "moving_average" | "ensemble";

export interface ForecastFactor {
  name: string;
  multiplier: number;
  impactUnits: number;
}

export interface ForecastPeriod {
  timestamp: Date;
  pointForecast: number;
  lowerBound: number;
  upperBound: number;
  contributingFactors: ForecastFactor[];
}

export interface ForecastAccuracy {
  mape: number;
  rmse: number;
  bias: number;
}

export interface ForecastResult {
  productId: string;
  storeId: string;
  granularity: ForecastGranularity;
  method: ForecastMethod;
  periods: ForecastPeriod[];
  accuracy: ForecastAccuracy;
}
