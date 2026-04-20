import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

export default function SeasonalityRadar({ data }: { data: { month: string; value: number }[] }) {
  return (
    <div className="panel h-80 p-5">
      <p className="label">Seasonality profile</p>
      <div className="mt-4 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="month" />
            <Radar dataKey="value" stroke="#E91E8C" fill="#E91E8C" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
