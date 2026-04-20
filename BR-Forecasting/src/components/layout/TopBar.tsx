import { Bell, MessageSquareMore } from "lucide-react";
import { dataApi } from "@/data";
import { useAlertStore } from "@/store/useAlertStore";
import { useAppStore, ALL_CITIES, isCityStoreId, cityFromStoreId } from "@/store/useAppStore";
import { useChatStore } from "@/store/useChatStore";
import CitySelector from "@/components/common/CitySelector";
import GranularitySelector from "@/components/common/GranularitySelector";
import StoreSelector from "@/components/common/StoreSelector";
import ProductSelector from "@/components/common/ProductSelector";

export default function TopBar() {
  const alerts = useAlertStore((s) => s.alerts);
  const toggle = useChatStore((s) => s.toggle);
  const activeStoreId = useAppStore((s) => s.activeStoreId);
  const activeProductId = useAppStore((s) => s.activeProductId);
  const activeCity = useAppStore((s) => s.activeCity);

  const contextLabel = isCityStoreId(activeStoreId)
    ? `All ${cityFromStoreId(activeStoreId)} Stores`
    : dataApi.stores.find((s) => s.id === activeStoreId)?.name ?? activeStoreId;

  const productName = dataApi.products.find((p) => p.id === activeProductId)?.name ?? activeProductId;

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  return (
    <header className="panel mb-6 flex flex-wrap items-center justify-between gap-4 p-5">
      <div>
        <p className="label">
          Decision cockpit
          {activeCity !== ALL_CITIES && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {activeCity}
            </span>
          )}
        </p>
        <h2 className="text-2xl font-semibold text-brown">
          {contextLabel} · {productName}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <CitySelector />
        <StoreSelector />
        <ProductSelector />
        <GranularitySelector />
        <button
          className="relative rounded-2xl border border-brown/10 px-3 py-3 text-brown"
          type="button"
        >
          <Bell size={18} />
          {criticalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
              {criticalCount}
            </span>
          )}
        </button>
        <button
          className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white"
          type="button"
          onClick={toggle}
        >
          <MessageSquareMore className="mr-2 inline" size={16} />
          ScoopBot
        </button>
      </div>
    </header>
  );
}
