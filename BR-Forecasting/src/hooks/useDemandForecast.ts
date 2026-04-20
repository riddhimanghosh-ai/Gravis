import { dataApi } from "@/data";
import { buildDemandForecast } from "@/algorithms/forecasting/demandForecast";
import { useAppStore, isCityStoreId, cityFromStoreId, ALL_CITIES } from "@/store/useAppStore";
import { useForecastStore } from "@/store/useForecastStore";
import type { ForecastResult } from "@/types";

export const useDemandForecast = (): ForecastResult => {
  const activeStoreId = useAppStore((s) => s.activeStoreId);
  const activeProductId = useAppStore((s) => s.activeProductId);
  const activeCity = useAppStore((s) => s.activeCity);
  const granularity = useAppStore((s) => s.granularity);
  const startDate = useAppStore((s) => s.startDate);
  const { weatherMultiplier, festivalMultiplier, eventMultiplier } = useForecastStore();

  const isCity = isCityStoreId(activeStoreId);
  const cityName = isCity ? cityFromStoreId(activeStoreId) : null;

  // Which stores contribute to this forecast
  const storeIds = isCity
    ? dataApi.stores.filter((s) => s.city === cityName).map((s) => s.id)
    : activeCity !== ALL_CITIES && !isCity
    ? [activeStoreId] // single store within a city filter
    : [activeStoreId];

  if (storeIds.length === 1) {
    // Single-store path — original behaviour
    const history = dataApi.sales
      .filter((r) => r.storeId === storeIds[0] && r.productId === activeProductId)
      .slice(-90)
      .map((r) => r.units);

    return buildDemandForecast({
      productId: activeProductId,
      storeId: storeIds[0],
      granularity,
      history,
      weatherMultiplier,
      festivalMultiplier,
      eventMultiplier,
      startDate,
    });
  }

  // City-aggregate path — build per-store forecasts then sum
  const perStore = storeIds.map((storeId) => {
    const history = dataApi.sales
      .filter((r) => r.storeId === storeId && r.productId === activeProductId)
      .slice(-90)
      .map((r) => r.units);

    return buildDemandForecast({
      productId: activeProductId,
      storeId,
      granularity,
      history,
      weatherMultiplier,
      festivalMultiplier,
      eventMultiplier,
      startDate,
    });
  });

  // Sum point forecasts; widen confidence bands (sqrt of summed variances)
  const base = perStore[0];
  const aggregated: ForecastResult = {
    ...base,
    storeId: activeStoreId,
    method: "ensemble",
    periods: base.periods.map((_, periodIdx) => {
      const point = perStore.reduce((s, f) => s + f.periods[periodIdx].pointForecast, 0);
      // Aggregate CI as sqrt of sum of squared half-widths (independent stores)
      const halfWidthSq = perStore.reduce((s, f) => {
        const hw = f.periods[periodIdx].upperBound - f.periods[periodIdx].pointForecast;
        return s + hw * hw;
      }, 0);
      const hw = Math.sqrt(halfWidthSq);

      const factors = base.periods[periodIdx].contributingFactors.map((f) => ({
        ...f,
        impactUnits: perStore.reduce((s, sf) => {
          const match = sf.periods[periodIdx].contributingFactors.find((cf) => cf.name === f.name);
          return s + (match?.impactUnits ?? 0);
        }, 0),
      }));

      return {
        timestamp: base.periods[periodIdx].timestamp,
        pointForecast: point,
        lowerBound: Math.max(0, point - hw),
        upperBound: point + hw,
        contributingFactors: factors,
      };
    }),
    accuracy: {
      // Average MAPE across stores, combined RMSE
      mape: perStore.reduce((s, f) => s + f.accuracy.mape, 0) / perStore.length,
      rmse: Math.sqrt(perStore.reduce((s, f) => s + f.accuracy.rmse ** 2, 0)),
      bias: perStore.reduce((s, f) => s + f.accuracy.bias, 0) / perStore.length,
    },
  };

  return aggregated;
};
