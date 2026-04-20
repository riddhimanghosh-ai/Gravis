import ForecastLineChart from "@/components/charts/ForecastLineChart";
import ExternalFactorsPanel from "@/components/common/ExternalFactorsPanel";
import DateRangePicker from "@/components/common/DateRangePicker";
import ConfidenceBand from "@/components/common/ConfidenceBand";
import { useDemandForecast } from "@/hooks/useDemandForecast";
import clsx from "clsx";

function AccuracyBadge({ mape }: { mape: number }) {
  const rounded = Math.round(mape * 10) / 10;
  const isGood = mape < 15;
  const isOk = mape >= 15 && mape < 25;
  return (
    <span
      className={clsx(
        "rounded-full px-3 py-1 text-xs font-semibold",
        isGood && "bg-green-100 text-green-700",
        isOk && "bg-amber-100 text-amber-700",
        !isGood && !isOk && "bg-rose-100 text-rose-700",
      )}
    >
      MAPE {rounded}% — {isGood ? "Good" : isOk ? "Acceptable" : "Poor"}
    </span>
  );
}

export default function ForecastPage() {
  const forecast = useDemandForecast();
  const { accuracy, periods, method } = forecast;

  // Aggregate contributing factor impacts across next 4 periods
  const nextPeriods = periods.slice(0, 4);
  const factors = nextPeriods[0]?.contributingFactors ?? [];
  const avgImpacts = factors.map((f) => ({
    name: f.name,
    avgImpact: nextPeriods.reduce((s, p) => {
      const match = p.contributingFactors.find((cf) => cf.name === f.name);
      return s + (match?.impactUnits ?? 0);
    }, 0) / nextPeriods.length,
  }));

  const biasLabel =
    accuracy.bias > 0.05 ? "Trending high" : accuracy.bias < -0.05 ? "Trending low" : "Neutral";
  const biasColor =
    accuracy.bias > 0.05 ? "text-amber-600" : accuracy.bias < -0.05 ? "text-rose-600" : "text-green-700";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="label">Forecast engine</p>
          <h2 className="text-2xl font-semibold text-brown">Multi-granularity demand forecast</h2>
        </div>
        <DateRangePicker />
      </div>

      {/* Accuracy strip */}
      <section className="panel p-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <AccuracyBadge mape={accuracy.mape} />
            <span className="text-sm text-brown/60">
              Method: <span className="font-medium text-brown">{method === "ensemble" ? "Ensemble (Holt-Winters + Seasonal Naïve)" : "Holt-Winters"}</span>
            </span>
          </div>
          <div className="flex items-center gap-6 border-l border-brown/10 pl-6 text-sm">
            <span className="text-brown/60">
              RMSE: <span className="font-semibold text-brown">{Math.round(accuracy.rmse)} units</span>
            </span>
            <span className="text-brown/60">
              Bias: <span className={clsx("font-semibold", biasColor)}>{biasLabel}</span>
            </span>
          </div>
          {avgImpacts.some((f) => Math.abs(f.avgImpact) > 1) && (
            <div className="flex items-center gap-4 border-l border-brown/10 pl-6 text-sm text-brown/60">
              {avgImpacts.filter((f) => Math.abs(f.avgImpact) > 1).map((f) => (
                <span key={f.name}>
                  {f.name}:{" "}
                  <span className={clsx("font-semibold", f.avgImpact > 0 ? "text-primary" : "text-rose-600")}>
                    {f.avgImpact > 0 ? "+" : ""}{Math.round(f.avgImpact)} units/period
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Chart + external factors */}
      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <ForecastLineChart forecast={forecast} />
        <ExternalFactorsPanel />
      </div>

      {/* Next periods */}
      <section className="panel p-5">
        <p className="label mb-4">Next periods</p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {nextPeriods.map((period) => {
            const totalImpact = period.contributingFactors.reduce((s, f) => s + f.impactUnits, 0);
            const drivers = period.contributingFactors
              .filter((f) => Math.abs(f.impactUnits) > 0.5)
              .sort((a, b) => Math.abs(b.impactUnits) - Math.abs(a.impactUnits));
            return (
              <article key={period.timestamp.toISOString()} className="rounded-2xl border border-brown/10 bg-white p-4">
                <p className="text-xs font-medium text-brown/60">{period.timestamp.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                <p className="mt-2 text-2xl font-semibold text-primary">{Math.round(period.pointForecast)}</p>
                <div className="mt-3">
                  <ConfidenceBand lower={period.lowerBound} upper={period.upperBound} />
                </div>
                {drivers.length > 0 && (
                  <div className="mt-3 space-y-1 border-t border-brown/5 pt-3">
                    {drivers.slice(0, 2).map((d) => (
                      <div key={d.name} className="flex items-center justify-between text-[11px]">
                        <span className="text-brown/50">{d.name}</span>
                        <span className={clsx("font-semibold", d.impactUnits > 0 ? "text-primary" : "text-rose-500")}>
                          {d.impactUnits > 0 ? "+" : ""}{Math.round(d.impactUnits)} u
                        </span>
                      </div>
                    ))}
                    {Math.abs(totalImpact) > 1 && (
                      <div className="flex items-center justify-between border-t border-brown/5 pt-1 text-[11px]">
                        <span className="font-medium text-brown/60">Net adjustment</span>
                        <span className={clsx("font-bold", totalImpact > 0 ? "text-primary" : "text-rose-600")}>
                          {totalImpact > 0 ? "+" : ""}{Math.round(totalImpact)} u
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
