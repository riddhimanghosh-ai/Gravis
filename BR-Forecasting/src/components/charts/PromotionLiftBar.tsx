import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function PromotionLiftBar({ data }: { data: { name: string; lift: number }[] }) {
  return (
    <div className="panel h-80 p-5">
      <p className="label">Promotion lift</p>
      <div className="mt-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="lift" fill="#FF69B4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
