import { dataApi } from "@/data";
import { detectAnomaly } from "@/algorithms/anomaly/zScoreDetector";
import AnomalyTimeline from "@/components/charts/AnomalyTimeline";

export default function AIInsightsPage() {
  const sample = dataApi.sales.filter((record) => record.productId === dataApi.products[0].id).slice(-28);
  const values = sample.map((item) => item.units);
  const anomalySeries = sample.slice(-12).map((item, index) => ({
    name: `${index + 1}`,
    z: detectAnomaly(values, item.units).z,
  }));

  return (
    <div className="space-y-6">
      <AnomalyTimeline data={anomalySeries} />
      <section className="panel p-5">
        <p className="label">AI recommendations</p>
        <div className="mt-4 grid gap-3">
          {[
            "Weather explains most of the short-term forecast uplift in high-street parlours.",
            "Family packs show stronger promo elasticity than scoop SKUs, especially in Bengaluru.",
            "High-value low-velocity cakes should move to transfer or markdown workflows earlier.",
            "Labor coverage should expand on evening shifts in delivery-heavy stores.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-brown/10 bg-white p-4 text-sm text-brown/80">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
