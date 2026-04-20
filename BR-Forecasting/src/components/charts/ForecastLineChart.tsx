import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ForecastResult } from "@/types";

export default function ForecastLineChart({ forecast }: { forecast: ForecastResult }) {
  const data = forecast.periods.map((period) => ({
    name: period.timestamp.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    forecast: Math.round(period.pointForecast),
    lower: Math.round(period.lowerBound),
    upper: Math.round(period.upperBound),
  }));

  return (
    <div className="panel h-96 p-5">
      <p className="label">Forecast curve</p>
      <div className="mt-4 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3d9e7" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="upper" stroke="none" fill="#FFB8D8" />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#FFF0F5" />
            <Line type="monotone" dataKey="forecast" stroke="#E91E8C" strokeWidth={3} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
