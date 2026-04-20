import { dataApi } from "@/data";
import { useAppStore, ALL_CITIES, cityStoreId, isCityStoreId } from "@/store/useAppStore";

export default function StoreSelector() {
  const value = useAppStore((s) => s.activeStoreId);
  const setValue = useAppStore((s) => s.setActiveStoreId);
  const activeCity = useAppStore((s) => s.activeCity);

  const filteredStores =
    activeCity === ALL_CITIES
      ? dataApi.stores
      : dataApi.stores.filter((s) => s.city === activeCity);

  return (
    <select
      className="rounded-2xl border border-brown/10 bg-white px-4 py-3 text-sm"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    >
      {/* City-aggregate option when a city is selected */}
      {activeCity !== ALL_CITIES && (
        <option value={cityStoreId(activeCity)}>
          All {activeCity} Stores
        </option>
      )}
      {filteredStores.map((store) => (
        <option key={store.id} value={store.id}>
          {activeCity === ALL_CITIES ? `${store.city} — ${store.name}` : store.name}
        </option>
      ))}
    </select>
  );
}
