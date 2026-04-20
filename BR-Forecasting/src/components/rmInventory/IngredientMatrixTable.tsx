import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { addDays, format } from "date-fns";
import clsx from "clsx";
import StatusBadge from "@/components/common/StatusBadge";
import type { RMIngredient } from "@/types/rmInventory";

interface Props {
  ingredients: RMIngredient[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/** Days of stock remaining at forecasted daily burn rate */
function daysUntilStockout(ing: RMIngredient): number {
  const dailyBurn = ing.forecastedDemandLiters / 30;
  return dailyBurn > 0 ? Math.floor(ing.currentStockKg / dailyBurn) : 999;
}

function coverageStatus(ing: RMIngredient): string {
  const days = daysUntilStockout(ing);
  if (days < 10) return "critical";
  if (days < 21) return "watch";
  return "healthy";
}

function StockoutCell({ ing }: { ing: RMIngredient }) {
  const days = daysUntilStockout(ing);
  const stockoutDate = format(addDays(new Date(), days), "d MMM");
  const isCritical = days < 10;
  const isWatch = days >= 10 && days < 21;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        isCritical && "bg-rose-100 text-rose-700",
        isWatch && "bg-amber-100 text-amber-700",
        !isCritical && !isWatch && "bg-green-100 text-green-700",
      )}
    >
      <Clock size={11} />
      {days < 999 ? `${days}d · ${stockoutDate}` : "Well covered"}
    </span>
  );
}

function PriceTrendCell({ trend, pct, costPerKg, forecastedDemand }: {
  trend: RMIngredient["priceTrend30d"];
  pct: number;
  costPerKg: number;
  forecastedDemand: number;
}) {
  const cogsImpact = Math.round(forecastedDemand * costPerKg * Math.abs(pct) / 100 / 1000);

  if (trend === "up") {
    return (
      <span className="flex flex-col items-center">
        <span className="flex items-center gap-1 text-rose-600 font-semibold text-sm">
          <TrendingUp size={14} />+{pct}%
        </span>
        <span className="text-[10px] text-rose-400">+₹{cogsImpact}K COGS</span>
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="flex flex-col items-center">
        <span className="flex items-center gap-1 text-green-600 font-semibold text-sm">
          <TrendingDown size={14} />{pct}%
        </span>
        <span className="text-[10px] text-green-400">−₹{cogsImpact}K COGS</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-amber-600 font-medium text-sm">
      <Minus size={14} />Stable
    </span>
  );
}

export default function IngredientMatrixTable({ ingredients, selectedId, onSelect }: Props) {
  const criticalCount = ingredients.filter((i) => daysUntilStockout(i) < 10).length;
  const expiryRisk = ingredients.reduce((s, i) => s + i.expiringSoonKg * i.costPerKg, 0);

  return (
    <div className="panel p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="label">Raw Material Matrix</p>
          <p className="subtle mt-0.5 text-xs">
            {criticalCount > 0 ? (
              <span className="font-semibold text-rose-600">{criticalCount} ingredient{criticalCount > 1 ? "s" : ""} under 10-day runway · </span>
            ) : null}
            ₹{(expiryRisk / 1000).toFixed(0)}K expiry risk in next 30 days
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brown/10">
              <th className="pb-3 text-left font-medium text-brown/60">Ingredient</th>
              <th className="pb-3 text-right font-medium text-brown/60">Stock (kg)</th>
              <th className="pb-3 text-center font-medium text-brown/60">Days Left · Stockout</th>
              <th className="pb-3 text-right font-medium text-brown/60">Expiring (kg)</th>
              <th className="pb-3 text-right font-medium text-brown/60">Cost / kg</th>
              <th className="pb-3 text-center font-medium text-brown/60">30d Price Trend</th>
              <th className="pb-3 text-right font-medium text-brown/60">Demand / mo (L)</th>
              <th className="pb-3 text-center font-medium text-brown/60">Status</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing) => (
              <tr
                key={ing.id}
                onClick={() => onSelect(ing.id)}
                className={clsx(
                  "cursor-pointer border-b border-brown/5 transition hover:bg-primary/5",
                  selectedId === ing.id && "bg-primary/10",
                  daysUntilStockout(ing) < 10 && "bg-rose-50/60"
                )}
              >
                <td className="py-3 font-medium text-brown">{ing.name}</td>
                <td className="py-3 text-right tabular-nums">{ing.currentStockKg.toLocaleString()}</td>
                <td className="py-3 text-center">
                  <StockoutCell ing={ing} />
                </td>
                <td className={clsx("py-3 text-right tabular-nums", ing.expiringSoonKg > 0 && "font-semibold text-rose-600")}>
                  {ing.expiringSoonKg > 0 ? ing.expiringSoonKg.toLocaleString() : "—"}
                </td>
                <td className="py-3 text-right tabular-nums">₹{ing.costPerKg.toLocaleString()}</td>
                <td className="py-3 text-center">
                  <PriceTrendCell
                    trend={ing.priceTrend30d}
                    pct={ing.priceTrendPct}
                    costPerKg={ing.costPerKg}
                    forecastedDemand={ing.forecastedDemandLiters}
                  />
                </td>
                <td className="py-3 text-right tabular-nums">{ing.forecastedDemandLiters.toLocaleString()}</td>
                <td className="py-3 text-center">
                  <StatusBadge status={coverageStatus(ing)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="subtle mt-3 text-xs">
        Click a row to drill into 12-month depletion forecast. Rows highlighted in red are under 10-day runway.
      </p>
    </div>
  );
}
