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

// Icons (simple text icons for now)
const Menu = () => <span>☰</span>;
const Home = () => <span>🏠</span>;
const Search = () => <span>🔍</span>;
const Bell = () => <span>🔔</span>;
const User = () => <span>👤</span>;
const Settings = () => <span>⚙️</span>;

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', path: '/' },
    { id: 'forecasting', label: '📈 Demand Forecasting', subItems: [
      { id: 'overview', label: 'Overview (3-6M)', path: '/forecasting-overview' },
      { id: '12month', label: '12-Month Forecast ⭐', path: '/forecast-12month' },
      { id: 'sku-detail', label: 'SKU Details', path: '/sku-detail' },
      { id: 'sku-comparison', label: 'SKU Comparison', path: '/sku-comparison' },
      { id: 'channel-analysis', label: 'Channel Analysis', path: '/channel-performance' }
    ]},
    { id: 'planning', label: '📅 Production Planning', subItems: [
      { id: 'mep', label: '🏭 Manufacturing Execution ⭐', path: '/manufacturing-execution-planning' },
      { id: 'gantt', label: 'Gantt View', path: '/scheduling-gantt' },
      { id: 'table', label: 'Table View', path: '/scheduling-table' },
      { id: 'scenarios', label: 'Scenarios', path: '/scenarios' }
    ]},
    { id: 'inventory', label: '📦 Inventory Management', path: '/inventory' },
    { id: 'coldchain', label: '❄️ Cold Chain & Expiry', path: '/cold-chain-expiry' },
    { id: 'execution', label: '⚡ Manufacturing Execution', path: '/execution' },
    { id: 'reports', label: '📋 Reports', subItems: [
      { id: 'weekly', label: 'Weekly Report', path: '/reports' },
      { id: 'distributor', label: 'Distributor Outlook', path: '/distributor-outlook' }
    ]},
    { id: 'settings', label: '⚙️ Settings', path: '/settings' }
  ];

  return (
    <Router>
      <div className="app-container">
        {/* Top Navigation */}
        <nav className="top-nav">
          <div className="nav-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu />
            </button>
            <div className="logo">GSI Platform</div>
          </div>
          <div className="nav-center">
            <input
              type="text"
              className="search-box"
              placeholder="Search..."
            />
          </div>
          <div className="nav-right">
            <button className="nav-button notification-button">
              <Bell /> <span className="badge">3</span>
            </button>
            <button className="nav-button">
              <User />
            </button>
            <button className="nav-button">
              <Settings />
            </button>
          </div>
        </nav>

        <div className="main-content">
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-content">
              {menuItems.map(item => (
                <div key={item.id}>
                  {item.subItems ? (
                    <>
                      <div className="sidebar-category">{item.label}</div>
                      {item.subItems.map(subItem => (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          className="sidebar-item"
                          onClick={() => setCurrentPage(subItem.id)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="sidebar-item"
                      onClick={() => setCurrentPage(item.id)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forecasting-overview" element={<DemandForecastingOverview />} />
              <Route path="/forecast-12month" element={<DemandForecast12Month />} />
              <Route path="/sku-detail" element={<SKUDetailForecast />} />
              <Route path="/sku-comparison" element={<SKUComparison />} />
              <Route path="/channel-performance" element={<ChannelPerformance />} />
              <Route path="/manufacturing-execution-planning" element={<ManufacturingExecutionPlanning />} />
              <Route path="/scheduling-gantt" element={<ProductionSchedulingGantt />} />
              <Route path="/scheduling-table" element={<ProductionSchedulingTable />} />
              <Route path="/inventory" element={<InventoryManagement />} />
              <Route path="/cold-chain-expiry" element={<ColdChainExpiryManagement />} />
              <Route path="/execution" element={<ManufacturingExecution />} />
              <Route path="/scenarios" element={<ScenarioBuilder />} />
              <Route path="/reports" element={<ProductionReport />} />
              <Route path="/distributor-outlook" element={<DistributorOutlook />} />
              <Route path="/settings" element={<SettingsConfiguration />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
