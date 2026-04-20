import { dataApi } from "@/data";
import { useAppStore } from "@/store/useAppStore";

export const useWeatherFactor = () => {
  const storeId = useAppStore((state) => state.activeStoreId);
  const store = dataApi.stores.find((item) => item.id === storeId) ?? dataApi.stores[0];
  const weatherSeries = dataApi.weatherByCity[store.city];
  const latest = weatherSeries[weatherSeries.length - 1];

  return {
    weather: latest,
    multiplier: latest?.weatherMultiplier ?? 1,
  };
};
