import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import screen components
import Dashboard from './screens/Dashboard';
import DemandForecastingOverview from './screens/DemandForecastingOverview';
import DemandForecast12Month from './screens/DemandForecast12Month';
import SKUDetailForecast from './screens/SKUDetailForecast';
import SKUComparison from './screens/SKUComparison';
import ChannelPerformance from './screens/ChannelPerformance';
import ProductionSchedulingGantt from './screens/ProductionSchedulingGantt';
import ProductionSchedulingTable from './screens/ProductionSchedulingTable';
import InventoryManagement from './screens/InventoryManagement';
import ManufacturingExecution from './screens/ManufacturingExecution';
import ManufacturingExecutionPlanning from './screens/ManufacturingExecutionPlanning';
import ColdChainExpiryManagement from './screens/ColdChainExpiryManagement';
import ScenarioBuilder from './screens/ScenarioBuilder';
import ProductionReport from './screens/ProductionReport';
import DistributorOutlook from './screens/DistributorOutlook';
import SettingsConfiguration from './screens/SettingsConfiguration';
import WeeklyProductionPlan from './screens/WeeklyProductionPlan';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', path: '/' },
    { id: 'forecasting', label: '📈 Demand Forecasting', subItems: [
      { id: 'overview', label: 'Overview (3-6M)', path: '/forecasting-overview' },
      { id: '12month', label: '12-Month Forecast', path: '/forecast-12month' },
      { id: 'sku-detail', label: 'SKU Details', path: '/sku-detail' },
      { id: 'sku-comparison', label: 'SKU Comparison', path: '/sku-comparison' },
      { id: 'channel-analysis', label: 'Channel Analysis', path: '/channel-performance' }
    ]},
    { id: 'planning', label: '📅 Production Planning', subItems: [
      { id: 'weekly', label: '🎯 Weekly Plan ⭐ NEW', path: '/weekly-production-plan' },
      { id: 'mep', label: '🏭 Manufacturing Execution', path: '/manufacturing-execution-planning' },
      { id: 'gantt', label: 'Gantt View', path: '/scheduling-gantt' },
      { id: 'table', label: 'Table View', path: '/scheduling-table' },
      { id: 'scenarios', label: 'Scenarios', path: '/scenarios' }
    ]},
    { id: 'inventory', label: '📦 Inventory Management', path: '/inventory' },
    { id: 'coldchain', label: '❄️ Cold Chain & Expiry', path: '/cold-chain-expiry' },
    { id: 'execution', label: '⚡ Manufacturing Execution', path: '/execution' },
    { id: 'reports', label: '📋 Reports', subItems: [
      { id: 'weekly-report', label: 'Weekly Report', path: '/reports' },
      { id: 'distributor', label: 'Distributor Outlook', path: '/distributor-outlook' }
    ]},
    { id: 'settings', label: '⚙️ Settings', path: '/settings' }
  ];

  const renderMenu = (items, level = 0) => {
    return items.map(item => (
      <div key={item.id}>
        {item.subItems ? (
          <>
            <div className={`menu-item level-${level}`}>
              <span className="menu-label">{item.label}</span>
            </div>
            <div className="menu-submenu">
              {renderMenu(item.subItems, level + 1)}
            </div>
          </>
        ) : (
          <Link to={item.path} className={`menu-item level-${level}`}>
            <span className="menu-label">{item.label}</span>
          </Link>
        )}
      </div>
    ));
  };

  return (
    <Router>
      <div className="app-container">
        {/* HEADER */}
        <header className="app-header">
          <div className="header-content">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className="app-title">🍦 Graviss Supply Intelligence</h1>
            <div className="header-right">
              <span className="header-icon">🔔</span>
              <span className="header-icon">👤</span>
            </div>
          </div>
        </header>

        <div className="app-body">
          {/* SIDEBAR */}
          <aside className={`app-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <nav className="app-menu">
              {renderMenu(menuItems)}
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forecasting-overview" element={<DemandForecastingOverview />} />
              <Route path="/forecast-12month" element={<DemandForecast12Month />} />
              <Route path="/sku-detail" element={<SKUDetailForecast />} />
              <Route path="/sku-comparison" element={<SKUComparison />} />
              <Route path="/channel-performance" element={<ChannelPerformance />} />
              <Route path="/scheduling-gantt" element={<ProductionSchedulingGantt />} />
              <Route path="/scheduling-table" element={<ProductionSchedulingTable />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/manufacturing-execution-planning" element={<ManufacturingExecutionPlanning />} />
              <Route path="/cold-chain-expiry" element={<ColdChainExpiryManagement />} />
              <Route path="/scenarios" element={<ScenarioBuilder />} />
              <Route path="/reports" element={<ProductionReport />} />
              <Route path="/distributor-outlook" element={<DistributorOutlook />} />
              <Route path="/settings" element={<SettingsConfiguration />} />
              <Route path="/execution" element={<ManufacturingExecution />} />
              <Route path="/weekly-production-plan" element={<WeeklyProductionPlan />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
