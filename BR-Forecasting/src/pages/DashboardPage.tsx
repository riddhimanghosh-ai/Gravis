import { useMemo } from "react";
import { format, subMonths, startOfMonth } from "date-fns";
import { Flame, AlertTriangle, TrendingUp } from "lucide-react";
import { dataApi } from "@/data";
import { warehouses } from "@/constants/warehouses";
import { useAlertStore } from "@/store/useAlertStore";
import { useAppStore, ALL_CITIES } from "@/store/useAppStore";
import KPICard from "@/components/common/KPICard";
import AIInsightCardGrid from "@/components/dashboard/AIInsightCardGrid";
import DemandCapacityChart, { type DemandCapacityDataPoint } from "@/components/charts/DemandCapacityChart";
import IndiaLogisticsMap from "@/components/dashboard/IndiaLogisticsMap";
import type { InsightCardProps } from "@/components/dashboard/AIInsightCard";

const CAPACITY = 85_000;

export default function DashboardPage() {
  const alerts = useAlertStore((s) => s.alerts);
  const activeCity = useAppStore((s) => s.activeCity);

  // City-filtered store IDs
  const cityStoreIds = useMemo(
    () =>
      activeCity === ALL_CITIES
        ? dataApi.stores.map((s) => s.id)
        : dataApi.stores.filter((s) => s.city === activeCity).map((s) => s.id),
    [activeCity],
  );
  const cityLabel = activeCity === ALL_CITIES ? "All India" : activeCity;

  // ─── KPIs ────────────────────────────────────────────────────────────────
  const cityStoreIdSet = new Set(cityStoreIds);
  const filteredSales = dataApi.sales.filter((r) => cityStoreIdSet.has(r.storeId));
  const revenue = filteredSales.reduce((sum, r) => sum + r.revenue, 0);
  const units = filteredSales.reduce((sum, r) => sum + r.units, 0);

  // Revenue at risk = critical SKUs: gap-to-reorder × base price × avg daily velocity
  const criticalItems = dataApi.inventory.filter((item) => cityStoreIdSet.has(item.storeId) && item.status === "critical");
  const excessItems = dataApi.inventory.filter((item) => cityStoreIdSet.has(item.storeId) && item.status === "excess");

  const revenueAtRisk = criticalItems.reduce((sum, item) => {
    const product = dataApi.products.find((p) => p.id === item.productId);
    const gapUnits = Math.max(0, item.reorderPoint - item.quantityOnHand);
    return sum + gapUnits * (product?.basePrice ?? 0);
  }, 0);

  // Capital tied up = excess units above safety stock × cost price
  const capitalTiedUp = excessItems.reduce((sum, item) => {
    const product = dataApi.products.find((p) => p.id === item.productId);
    const excessUnits = Math.max(0, item.quantityOnHand - item.safetyStockLevel * 1.5);
    return sum + excessUnits * (product?.costPrice ?? 0);
  }, 0);

  // ─── 12-month demand vs capacity ─────────────────────────────────────────
  const demandCapacityData = useMemo<DemandCapacityDataPoint[]>(() => {
    const now = new Date();
    const monthlyActuals: Record<string, number> = {};
    // Filter sales to selected city
    for (const record of filteredSales) {
      const key = format(startOfMonth(record.date), "MMM ''yy");
      monthlyActuals[key] = (monthlyActuals[key] ?? 0) + record.units;
    }
    const result: DemandCapacityDataPoint[] = [];
    let lastActual = 0;
    for (let i = 5; i >= 0; i--) {
      const key = format(startOfMonth(subMonths(now, i + 1)), "MMM ''yy");
      const actual = monthlyActuals[key] ?? 0;
      if (actual > 0) lastActual = actual;
      result.push({ month: key, demand: actual, capacity: CAPACITY, actual });
    }
    let forecastBase = lastActual > 0 ? lastActual : 70_000;
    for (let i = 0; i < 6; i++) {
      const key = format(startOfMonth(subMonths(now, -i)), "MMM ''yy");
      forecastBase = Math.round(forecastBase * 1.03);
      result.push({ month: key, demand: forecastBase, capacity: CAPACITY });
    }
    return result;
  }, []);

  // ─── AI insight cards ─────────────────────────────────────────────────────
  const insights = useMemo<InsightCardProps[]>(() => {
    const criticalAlerts = alerts.filter((a) => a.severity === "critical");
    const breachWhs = warehouses.filter((w) => w.status === "breach");

    const cards: InsightCardProps[] = [];

    if (breachWhs.length > 0) {
      cards.push({
        icon: <Flame size={16} />,
        headline: `${breachWhs.length} Cold Chain Breach${breachWhs.length > 1 ? "es" : ""} Detected`,
        metric: breachWhs.map((w) => `${w.name}: ${w.tempC}°C`).join(" · "),
        severity: "critical",
        action: "Dispatch Snowman technician. Move at-risk stock to nearest safe facility immediately.",
      });
    } else {
      cards.push({
        icon: <Flame size={16} />,
        headline: "Ahmedabad Heatwave Alert",
        metric: "+12% Mango demand forecast — West Region",
        severity: "critical",
        action: "Increase Mango Scoop production run by 400 units. Verify Naroda warehouse temp logging.",
      });
    }

    cards.push({
      icon: <AlertTriangle size={16} />,
      headline: "Stabilizer Mix Supply Risk",
      metric: `Price +11% · ₹${(1800 * 320 * 0.11 / 1000).toFixed(0)}K COGS exposure this quarter`,
      severity: "watch",
      action: "Trigger early procurement via Kerry Ingredients India. Order 600 kg within 7 days.",
    });

    cards.push({
      icon: <TrendingUp size={16} />,
      headline: "Milk Fat Q2 Price Surge",
      metric: `₹580 → est. ₹615/kg by Jun · ₹${Math.round(14000 * 35 / 100000).toFixed(1)}L COGS impact`,
      severity: "watch",
      action: "Hedge 30-day forward contract. Procure 4,000 kg before May 25 to lock current rate.",
    });

    if (cards.length < 3 && criticalAlerts[0]) {
      const a = criticalAlerts[0];
      cards.push({
        icon: <AlertTriangle size={16} />,
        headline: a.title,
        metric: a.description,
        severity: "critical",
        action: a.recommendedAction,
      });
    }

    return cards.slice(0, 3);
  }, [alerts]);

  return (
    <div className="space-y-6">
      {/* KPI row — with financial context */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label={`${cityLabel} Revenue`}
          value={`₹${Math.round(revenue / 100000).toLocaleString()}L`}
          detail={`2-year simulated · ${cityStoreIds.length} store${cityStoreIds.length !== 1 ? "s" : ""}`}
        />
        <KPICard
          label="Units Sold"
          value={`${Math.round(units / 1000).toLocaleString()}K`}
          detail={`All channels · ${cityStoreIds.length} stores`}
        />
        <KPICard
          label="Revenue at Risk"
          value={`₹${Math.round(revenueAtRisk / 100000).toFixed(1)}L`}
          detail={`${criticalItems.length} critical SKUs below reorder point`}
        />
        <KPICard
          label="Capital Tied in Excess"
          value={`₹${Math.round(capitalTiedUp / 100000).toFixed(1)}L`}
          detail={`${excessItems.length} excess SKUs — rebalance or markdown`}
        />
      </section>

      {/* AI Insight Cards */}
      <AIInsightCardGrid insights={insights} />

      {/* Demand vs Capacity */}
      <DemandCapacityChart data={demandCapacityData} />

      {/* India Logistics Map */}
      <section className="panel p-5">
        <p className="label mb-1">India Cold-Chain Logistics Network</p>
        <p className="subtle mb-4">
          {warehouses.length} Snowman warehouses · {dataApi.stores.length} BR stores ·{" "}
          <span className="font-semibold text-red-500">
            {warehouses.filter((w) => w.status === "breach").length} temperature breach
            {warehouses.filter((w) => w.status === "breach").length !== 1 ? "es" : ""}
          </span>
          {activeCity !== ALL_CITIES && (
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Viewing: {activeCity}
            </span>
          )}
        </p>
        <IndiaLogisticsMap
          stores={activeCity === ALL_CITIES ? dataApi.stores : dataApi.stores.filter((s) => s.city === activeCity)}
          warehouses={activeCity === ALL_CITIES ? warehouses : warehouses.filter((w) => w.city === activeCity)}
        />
      </section>
    </div>
  );
}
