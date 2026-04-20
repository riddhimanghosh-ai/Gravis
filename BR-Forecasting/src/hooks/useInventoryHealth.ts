import { dataApi } from "@/data";
import { useAppStore, ALL_CITIES, isCityStoreId, cityFromStoreId } from "@/store/useAppStore";

export const useInventoryHealth = () => {
  const activeStoreId = useAppStore((s) => s.activeStoreId);
  const activeCity = useAppStore((s) => s.activeCity);

  let inventory: typeof dataApi.inventory;

  if (isCityStoreId(activeStoreId)) {
    // City-aggregate: all stores in the selected city
    const city = cityFromStoreId(activeStoreId);
    const storeIds = new Set(dataApi.stores.filter((s) => s.city === city).map((s) => s.id));
    inventory = dataApi.inventory.filter((item) => storeIds.has(item.storeId));
  } else if (activeCity !== ALL_CITIES) {
    // Single store within a city filter
    inventory = dataApi.inventory.filter((item) => item.storeId === activeStoreId);
  } else {
    // Single store, all-city context
    inventory = dataApi.inventory.filter((item) => item.storeId === activeStoreId);
  }

  const critical = inventory.filter((item) => item.status === "critical");
  const excess = inventory.filter((item) => item.status === "excess");

  return { inventory, critical, excess };
};
