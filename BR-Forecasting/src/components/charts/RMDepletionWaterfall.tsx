import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from "recharts";
import type { RMIngredient } from "@/types/rmInventory";

interface Props {
  ingredient: RMIngredient;
}

export default function RMDepletionWaterfall({ ingredient }: Props) {
  const initialStock = ingredient.depletionPlan[0]?.openingStock ?? 0;
  const reorderThreshold = Math.round(initialStock * 0.2);

  return (
    <div className="panel p-5">
      <p className="label">12-month stock depletion — {ingredient.name}</p>
      <p className="subtle mb-4">Opening stock vs. consumption against production plan</p>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={ingredient.depletionPlan} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e8e0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}t`} />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value.toLocaleString()} kg`,
              name === "openingStock" ? "Opening Stock" : name === "consumed" ? "Consumed" : "Closing Stock",
            ]}
          />
          <Legend
            formatter={(value) =>
              value === "openingStock" ? "Opening Stock" : value === "consumed" ? "Consumed" : "Closing Stock"
            }
          />
          <ReferenceLine y={reorderThreshold} stroke="#ef4444" strokeDasharray="4 4" label={{ value: "Reorder line", fontSize: 10, fill: "#ef4444" }} />
          <Bar dataKey="openingStock" stackId="a" fill="#f5ece5" stroke="#c4a882" strokeWidth={1} radius={[4, 4, 0, 0]} />
          <Bar dataKey="consumed" stackId="b" fill="#E91E8C" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
          <Line dataKey="closingStock" type="monotone" stroke="#4A2C2A" strokeWidth={2} dot={{ r: 3, fill: "#4A2C2A" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
