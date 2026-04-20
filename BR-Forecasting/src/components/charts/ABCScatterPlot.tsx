import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { useABCAnalysis } from "@/hooks/useABCAnalysis";

export default function ABCScatterPlot() {
  const data = useABCAnalysis();
  return (
    <div className="panel h-96 p-5">
      <p className="label">ABC value map</p>
      <div className="mt-4 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid />
            <XAxis dataKey="annualUnits" name="Units" />
            <YAxis dataKey="annualRevenue" name="Revenue" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Scatter data={data} fill="#E91E8C" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
