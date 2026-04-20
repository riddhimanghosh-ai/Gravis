import { addDays } from "date-fns";
import { create } from "zustand";
import { dataApi } from "@/data";
import type { ForecastGranularity } from "@/types";

export const ALL_CITIES = "All Cities";
export const CITIES = [ALL_CITIES, "Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Pune"] as const;
export type City = (typeof CITIES)[number];

/** When a city is selected as the "store", activeStoreId = "city:Mumbai" etc. */
export function cityStoreId(city: string) {
  return `city:${city}`;
}
export function isCityStoreId(id: string) {
  return id.startsWith("city:");
}
export function cityFromStoreId(id: string): string {
  return id.replace("city:", "");
}

interface AppState {
  activeStoreId: string;
  activeProductId: string;
  activeCity: City;
  granularity: ForecastGranularity;
  startDate: Date;
  endDate: Date;
  setActiveStoreId: (value: string) => void;
  setActiveProductId: (value: string) => void;
  setActiveCity: (city: City) => void;
  setGranularity: (value: ForecastGranularity) => void;
  setDateRange: (startDate: Date, endDate: Date) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeStoreId: dataApi.stores[0].id,
  activeProductId: dataApi.products[0].id,
  activeCity: ALL_CITIES,
  granularity: "daily",
  startDate: new Date(),
  endDate: addDays(new Date(), 14),
  setActiveStoreId: (activeStoreId) => set({ activeStoreId }),
  setActiveProductId: (activeProductId) => set({ activeProductId }),
  setActiveCity: (activeCity) =>
    set((state) => {
      // When switching to a city, auto-select that city's aggregate view
      const newStoreId =
        activeCity === ALL_CITIES
          ? dataApi.stores[0].id
          : cityStoreId(activeCity);
      // Keep the current store if it already belongs to the city
      const cityStores = dataApi.stores.filter((s) => s.city === activeCity);
      const keepStore =
        activeCity !== ALL_CITIES &&
        cityStores.some((s) => s.id === state.activeStoreId);
      return {
        activeCity,
        activeStoreId: keepStore ? state.activeStoreId : newStoreId,
      };
    }),
  setGranularity: (granularity) => set({ granularity }),
  setDateRange: (startDate, endDate) => set({ startDate, endDate }),
}));
