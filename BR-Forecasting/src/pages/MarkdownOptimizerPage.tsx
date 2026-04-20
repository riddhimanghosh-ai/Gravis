import { dataApi } from "@/data";
import { thresholds } from "@/constants/thresholds";
import { useAppStore } from "@/store/useAppStore";
import { optimizeMarkdown } from "@/algorithms/pricing/markdownOptimizer";
import { useElasticity } from "@/hooks/useElasticity";
import ElasticityCurve from "@/components/charts/ElasticityCurve";

export default function MarkdownOptimizerPage() {
  const productId = useAppStore((state) => state.activeProductId);
  const product = dataApi.products.find((item) => item.id === productId) ?? dataApi.products[0];
  const baseDemand = 120;
  const best = optimizeMarkdown(baseDemand, product.basePrice, product.elasticity, product.costPrice, thresholds.markdownDiscountRange);
  const elasticity = useElasticity();

  return (
    <div className="space-y-6">
      <ElasticityCurve data={elasticity} />
      <section className="panel p-5">
        <p className="label">Markdown recommendation</p>
        <h2 className="mt-3 text-2xl font-semibold text-brown">{best.discountPct}% discount</h2>
        <p className="subtle mt-2">Projected units {Math.round(best.units)} · Revenue ₹{Math.round(best.revenue)} · Profit ₹{Math.round(best.profit)}</p>
      </section>
    </div>
  );
}
