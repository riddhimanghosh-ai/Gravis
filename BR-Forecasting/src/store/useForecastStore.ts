import { create } from "zustand";

interface ForecastControls {
  weatherMultiplier: number;
  festivalMultiplier: number;
  eventMultiplier: number;
  setOverlay: (key: "weatherMultiplier" | "festivalMultiplier" | "eventMultiplier", value: number) => void;
}

export const useForecastStore = create<ForecastControls>((set) => ({
  weatherMultiplier: 1,
  festivalMultiplier: 1,
  eventMultiplier: 1,
  setOverlay: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
