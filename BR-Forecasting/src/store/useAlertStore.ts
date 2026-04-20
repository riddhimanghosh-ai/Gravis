import { create } from "zustand";
import { dataApi } from "@/data";
import type { AlertRecord } from "@/types";

const initialAlerts: AlertRecord[] = dataApi.inventory
  .filter((item) => item.status === "critical" || item.status === "excess")
  .slice(0, 8)
  .map((item, index) => ({
    id: `alert-${index}`,
    severity: item.status === "critical" ? "critical" : "watch",
    title: item.status === "critical" ? "Low stock risk" : "Excess stock risk",
    description: `${item.productId} at ${item.storeId} requires action`,
    storeId: item.storeId,
    productId: item.productId,
    createdAt: new Date(),
    recommendedAction: item.status === "critical" ? "Replenish or transfer" : "Markdown or rebalance",
  }));

export const useAlertStore = create<{ alerts: AlertRecord[] }>(() => ({ alerts: initialAlerts }));
