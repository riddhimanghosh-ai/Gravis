import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export interface DemandCapacityDataPoint {
  month: string;
  demand: number;
  capacity: number;
  actual?: number;
}

interface Props {
  data: DemandCapacityDataPoint[];
}

export default function DemandCapacityChart({ data }: Props) {
  return (
    <div className="panel p-5">
      <p className="label">12-month demand vs. factory capacity</p>
      <p className="subtle mb-4">Rolling forecast against Pune plant throughput ceiling of 85,000 units/month</p>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} units`,
              name === "demand" ? "Forecasted Demand" : name === "actual" ? "Actual Sales" : "Plant Capacity",
            ]}
          />
          <Legend
            formatter={(value) =>
              value === "demand" ? "Forecasted Demand" : value === "actual" ? "Actual Sales" : "Plant Capacity"
            }
          />
          <ReferenceLine y={85000} stroke="#ef4444" strokeDasharray="6 3" strokeWidth={1.5} />
          <Area
            dataKey="demand"
            type="monotone"
            fill="#E91E8C"
            fillOpacity={0.15}
            stroke="#E91E8C"
            strokeWidth={2}
          />
          <Bar dataKey="actual" fill="#c4a882" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
          <Line
            dataKey="capacity"
            type="monotone"
            stroke="#4A2C2A"
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
