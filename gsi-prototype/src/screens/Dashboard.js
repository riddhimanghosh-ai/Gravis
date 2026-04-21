import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [selectedDay, setSelectedDay] = useState('today');

  // Mock data for charts
  const forecastData = [
    { date: 'Apr 14', forecast: 5200, actual: 5100 },
    { date: 'Apr 15', forecast: 5400, actual: 5300 },
    { date: 'Apr 16', forecast: 5600, actual: 5550 },
    { date: 'Apr 17', forecast: 5800, actual: 5650 },
    { date: 'Apr 18', forecast: 6200, actual: 6100 },
    { date: 'Apr 19', forecast: 6500, actual: 6480 },
    { date: 'Apr 20', forecast: 6800, actual: 6750 },
    { date: 'Apr 21', forecast: 7200, actual: null },
  ];

  const utilizationData = [
    { name: 'Line 1', value: 82, fill: '#1F77B4' },
    { name: 'Line 2', value: 65, fill: '#FF7F0E' },
    { name: 'Line 3', value: 91, fill: '#2CA02C' },
  ];

  const channelData = [
    { name: 'Parlor', value: 50, fill: '#F4D03F' },
    { name: 'Retail', value: 35, fill: '#B8860B' },
    { name: 'HoReCa', value: 10, fill: '#90EE90' },
    { name: 'E-commerce', value: 5, fill: '#8B4513' },
  ];

  const scheduleItems = [
    { day: 'Today', line: 'Line 1', product: 'Vanilla', qty: '8L', time: '08:00-16:00' },
    { day: 'Today', line: 'Line 2', product: 'Caramel', qty: '5L', time: '08:00-16:00' },
    { day: 'Today', line: 'Line 3', product: 'Mint', qty: '6L', time: '08:00-16:00' },
    { day: 'Tomorrow', line: 'Line 1', product: 'Changeover', qty: '-', time: '16:00-22:00' },
    { day: 'Tomorrow', line: 'Line 2', product: 'Vanilla', qty: '8L', time: '08:00-16:00' },
  ];

  const alerts = [
    { type: 'warning', message: 'Parlor: Low stock Vanilla (3 days)', icon: '⚠️' },
    { type: 'info', message: 'EOQ ready: Strawberry (200L)', icon: 'ℹ️' },
    { type: 'success', message: 'Production on track for today', icon: '✓' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>GSI Platform Dashboard</h1>
        <p>Week of April 21, 2026</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid grid-4">
        <div className="metric-card">
          <div className="metric-label">Forecast Accuracy</div>
          <div className="metric-value">84%</div>
          <div className="metric-status success">✓ On Target</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Inventory Variance</div>
          <div className="metric-value">-2.3%</div>
          <div className="metric-status success">✓ Optimal</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Stock-outs (7d)</div>
          <div className="metric-value">0</div>
          <div className="metric-status success">✓ No Issues</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Production Utilization</div>
          <div className="metric-value">79%</div>
          <div className="metric-status success">✓ Balanced</div>
        </div>
      </div>

      {/* 12-Month Outlook Widget */}
      <div className="container" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)', border: '2px solid #1F77B4', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ margin: '0 0 8px 0', color: '#1F77B4' }}>📊 12-Month Demand Outlook</h2>
            <p style={{ margin: '0', color: '#666', fontSize: '13px' }}>
              6 months historical actuals + 6 months forward forecast for annual budgeting & planning
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/forecast-12month" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '8px 14px', background: '#1F77B4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                View 12-Month →
              </button>
            </Link>
            <Link to="/sku-comparison" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '8px 14px', background: '#2CA02C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                SKU Comparison →
              </button>
            </Link>
            <Link to="/channel-performance" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '8px 14px', background: '#FF7F0E', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                Channel Analysis →
              </button>
            </Link>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: 'white', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '11px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>Avg Historical (6M)</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1F77B4' }}>5,250 L</div>
          </div>
          <div style={{ background: 'white', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '11px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>Avg Forecast (6M)</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#FF7F0E' }}>7,371 L</div>
          </div>
          <div style={{ background: 'white', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '11px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>Growth Projection</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#4CAF50' }}>+40%</div>
          </div>
          <div style={{ background: 'white', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '11px', color: '#999', fontWeight: '600', marginBottom: '4px' }}>Peak Month (Aug)</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#D32F2F' }}>8,500 L</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid-2">
        {/* Forecast Confidence Trend */}
        <div className="container">
          <h2>Forecast Confidence Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#1F77B4"
                name="Forecast"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#2CA02C"
                name="Actual"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
            Average confidence: 87%
          </p>
        </div>

        {/* Production Utilization */}
        <div className="container">
          <h2>Production Utilization by Line</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={utilizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="value" fill="#1F77B4">
                {utilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid-2">
        {/* Channel Demand */}
        <div className="container">
          <h2>Channel Demand Distribution (7-day avg)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '15px' }}>
            <p><strong>Daily Breakdown:</strong></p>
            <ul style={{ marginLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
              <li>Parlor: 2,400 L/day</li>
              <li>Retail: 1,800 L/day</li>
              <li>HoReCa: 950 L/day</li>
              <li>E-commerce: 320 L/day</li>
              <li><strong>TOTAL: 5,470 L/day</strong></li>
            </ul>
          </div>
        </div>

        {/* Alerts */}
        <div className="container">
          <h2>Alerts & Recommendations</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`alert alert-${alert.type === 'warning' ? 'warning' : alert.type === 'info' ? 'info' : 'success'}`}
              >
                <span style={{ marginRight: '10px', fontSize: '16px' }}>
                  {alert.icon}
                </span>
                {alert.message}
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '20px' }}>Next Actions</h3>
          <ul style={{ marginLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
            <li>Review Vanilla demand for next week</li>
            <li>Place Caramel reorder (Retail channel)</li>
            <li>Approve production schedule</li>
            <li>Check Line 2 utilization (65%)</li>
          </ul>
        </div>
      </div>

      {/* Upcoming Production */}
      <div className="container">
        <h2>Upcoming Production Schedule</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Line</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {scheduleItems.map((item, index) => (
              <tr key={index}>
                <td>{item.day}</td>
                <td>{item.line}</td>
                <td>{item.product}</td>
                <td>{item.qty}</td>
                <td>{item.time}</td>
                <td>
                  {item.product === 'Changeover' ? (
                    <span className="status-badge" style={{ background: '#ccc', color: '#666' }}>
                      Scheduled
                    </span>
                  ) : (
                    <span className="status-badge status-ok">✓ Scheduled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="container">
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/forecast-12month" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">📊 12-Month Forecast</button>
          </Link>
          <Link to="/sku-comparison" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">📈 Compare SKUs</button>
          </Link>
          <Link to="/channel-performance" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">🎯 Channel Analysis</button>
          </Link>
          <Link to="/distributor-outlook" style={{ textDecoration: 'none' }}>
            <button className="btn-primary">📋 Distributor Outlook</button>
          </Link>
          <Link to="/forecasting-overview" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary">3-6M Forecast</button>
          </Link>
          <Link to="/reports" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary">View Reports</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
