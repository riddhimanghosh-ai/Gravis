import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnomalyTimeline({ data }: { data: { name: string; z: number }[] }) {
  return (
    <div className="panel h-80 p-5">
      <p className="label">Anomaly z-score</p>
      <div className="mt-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line dataKey="z" stroke="#4A2C2A" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
