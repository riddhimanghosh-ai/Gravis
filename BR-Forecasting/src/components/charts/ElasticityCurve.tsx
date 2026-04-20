import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ElasticityCurve({ data }: { data: { discountPct: number; revenue: number }[] }) {
  return (
    <div className="panel h-80 p-5">
      <p className="label">Elasticity curve</p>
      <div className="mt-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="discountPct" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#4A2C2A" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
