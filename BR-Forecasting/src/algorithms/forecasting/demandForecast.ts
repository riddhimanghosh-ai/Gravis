import { addDays } from "date-fns";
import type { ForecastGranularity, ForecastResult } from "@/types";
import { holtWinters } from "./holtsWinters";
import { applyExternalOverlay } from "./externalFactors";

interface ForecastInput {
  productId: string;
  storeId: string;
  granularity: ForecastGranularity;
  history: number[];
  weatherMultiplier: number;
  festivalMultiplier: number;
  eventMultiplier: number;
  startDate: Date;
}

export const buildDemandForecast = ({
  productId,
  storeId,
  granularity,
  history,
  weatherMultiplier,
  festivalMultiplier,
  eventMultiplier,
  startDate,
}: ForecastInput): ForecastResult => {
  const horizonMap: Record<ForecastGranularity, number> = {
    hourly: 12,
    daily: 14,
    weekly: 8,
    monthly: 6,
  };
  const seasonLength = granularity === "hourly" ? 24 : granularity === "weekly" ? 4 : 7;
  const hw = holtWinters(history, Math.max(seasonLength, 2), 0.35, 0.15, 0.25, horizonMap[granularity]);
  const seasonalNaive = history.slice(-seasonLength);
  const useBlend = history.length < 52;

  const periods = hw.forecast.map((value, index) => {
    const naive = seasonalNaive[index % seasonalNaive.length] ?? value;
    const ensemble = useBlend ? 0.7 * value + 0.3 * naive : value;
    const adjusted = applyExternalOverlay(ensemble, { weatherMultiplier, festivalMultiplier, eventMultiplier });
    const ci = 1.28 * hw.residualStdDev * Math.sqrt(index + 1);

    return {
      timestamp: addDays(startDate, index + 1),
      pointForecast: adjusted,
      lowerBound: Math.max(0, adjusted - ci),
      upperBound: adjusted + ci,
      contributingFactors: [
        { name: "Weather", multiplier: weatherMultiplier, impactUnits: adjusted * (weatherMultiplier - 1) },
        { name: "Festival", multiplier: festivalMultiplier, impactUnits: adjusted * (festivalMultiplier - 1) },
        { name: "Event", multiplier: eventMultiplier, impactUnits: adjusted * (eventMultiplier - 1) },
      ],
    };
  });

  const historyAverage = history.reduce((sum, value) => sum + value, 0) / Math.max(history.length, 1);
  const residualAverage = hw.residualStdDev / Math.max(historyAverage, 1);

  return {
    productId,
    storeId,
    granularity,
    method: useBlend ? "ensemble" : "holt_winters",
    periods,
    accuracy: {
      mape: residualAverage * 100,
      rmse: hw.residualStdDev,
      bias: ((periods[0]?.pointForecast ?? historyAverage) - historyAverage) / Math.max(historyAverage, 1),
    },
  };
};
