import ABCScatterPlot from "@/components/charts/ABCScatterPlot";
import { useABCAnalysis } from "@/hooks/useABCAnalysis";

export default function ABCAnalysisPage() {
  const abc = useABCAnalysis();
  return (
    <div className="space-y-6">
      <ABCScatterPlot />
      <section className="panel p-5">
        <p className="label">ABC table</p>
        <div className="mt-4 grid gap-3">
          {abc.slice(0, 10).map((item) => (
            <div key={item.productId} className="flex items-center justify-between rounded-2xl border border-brown/10 bg-white p-4">
              <span className="font-medium text-brown">{item.productId}</span>
              <span className="text-sm text-brown/70">Revenue share {Math.round(item.cumulativeShare * 100)}%</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary-dark">{item.abcClass}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
