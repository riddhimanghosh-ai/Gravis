import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ChannelWaterfall({ data }: { data: { channel: string; value: number }[] }) {
  return (
    <div className="panel h-80 p-5">
      <p className="label">Channel split</p>
      <div className="mt-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="channel" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#B0156A" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
