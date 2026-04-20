import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import DashboardPage from "@/pages/DashboardPage";
import ForecastPage from "@/pages/ForecastPage";
import InventoryPage from "@/pages/InventoryPage";
import SalesAnalyticsPage from "@/pages/SalesAnalyticsPage";
import ABCAnalysisPage from "@/pages/ABCAnalysisPage";
import MarkdownOptimizerPage from "@/pages/MarkdownOptimizerPage";
import SupplyChainPage from "@/pages/SupplyChainPage";
import AIInsightsPage from "@/pages/AIInsightsPage";
import ReportsPage from "@/pages/ReportsPage";
import RMInventoryPage from "@/pages/RMInventoryPage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/rm-inventory" element={<RMInventoryPage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/sales" element={<SalesAnalyticsPage />} />
        <Route path="/abc" element={<ABCAnalysisPage />} />
        <Route path="/markdown" element={<MarkdownOptimizerPage />} />
        <Route path="/supply-chain" element={<SupplyChainPage />} />
        <Route path="/ai-insights" element={<AIInsightsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    </AppShell>
  );
}
