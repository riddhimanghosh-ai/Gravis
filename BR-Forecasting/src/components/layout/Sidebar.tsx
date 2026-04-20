import { NavLink } from "react-router-dom";
import { BarChart3, Boxes, BrainCircuit, ChartScatter, FlaskConical, Home, PackageSearch, Route, Tags, TrendingUp } from "lucide-react";

const items = [
  ["/dashboard", "Command Center", Home],
  ["/rm-inventory", "RM Inventory", FlaskConical],
  ["/forecast", "Forecast", TrendingUp],
  ["/inventory", "Inventory", Boxes],
  ["/sales", "Sales", BarChart3],
  ["/abc", "ABC", ChartScatter],
  ["/markdown", "Markdown", Tags],
  ["/supply-chain", "Supply Chain", Route],
  ["/ai-insights", "AI Insights", BrainCircuit],
  ["/reports", "Reports", PackageSearch],
] as const;

export default function Sidebar() {
  return (
    <aside className="panel sticky top-4 h-[calc(100vh-2rem)] w-72 p-5">
      <div className="mb-8 rounded-3xl bg-brown px-5 py-6 text-cream">
        <p className="label text-accent">Baskin Robbins India</p>
        <h1 className="mt-2 text-3xl font-semibold">Forecast Studio</h1>
        <p className="mt-2 text-sm text-cream/70">Logic-based planning across demand, inventory, pricing, and supply.</p>
      </div>
      <nav className="space-y-2">
        {items.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-primary text-white" : "text-brown hover:bg-primary/10"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
