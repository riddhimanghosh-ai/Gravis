import { create } from "zustand";

interface InventoryState {
  serviceLevelTarget: number;
  leadTimeDays: number;
  setServiceLevelTarget: (value: number) => void;
  setLeadTimeDays: (value: number) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  serviceLevelTarget: 95,
  leadTimeDays: 4,
  setServiceLevelTarget: (serviceLevelTarget) => set({ serviceLevelTarget }),
  setLeadTimeDays: (leadTimeDays) => set({ leadTimeDays }),
}));
