import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import '../styles/DistributorOutlook.css';

const DistributorOutlook = () => {
  const [selectedFormat, setSelectedFormat] = useState('screen');

  // Generate 12-month outlook data
  const generateOutlookData = () => {
    const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026',
                     'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
    const baseData = [2100, 2550, 3100, 2900, 2450, 2650, 2700, 3550, 4100, 4250, 4050, 3450];

    return months.map((month, idx) => ({
      month: month.split(' ')[0],
      fullMonth: month,
      total: baseData[idx],
      vanilla: Math.round(baseData[idx] * 0.55),
      caramel: Math.round(baseData[idx] * 0.22),
      mint: Math.round(baseData[idx] * 0.18),
      chocolate: Math.round(baseData[idx] * 0.05),
    }));
  };

  const outlookData = generateOutlookData();

  // Channel allocation by month
  const channelAllocationData = outlookData.map(d => ({
    month: d.month,
    'Parlor (50%)': Math.round(d.total * 0.50),
    'Retail (35%)': Math.round(d.total * 0.35),
    'HoReCa (10%)': Math.round(d.total * 0.10),
    'E-com (5%)': Math.round(d.total * 0.05),
  }));

  // SKU distribution breakdown
  const skuBreakdown = [
    { name: 'Vanilla', value: 55, color: '#1F77B4' },
    { name: 'Caramel', value: 22, color: '#D62728' },
    { name: 'Mint', value: 18, color: '#2CA02C' },
    { name: 'Chocolate', value: 5, color: '#9467BD' },
  ];

  // Distributor recommendations
  const distributorRecommendations = [
    {
      id: 1,
      month: 'April 2026',
      action: 'Begin summer inventory build-up',
      details: 'Increase orders by 10% in April to prepare for May-August peak season.',
      priority: 'High',
    },
    {
      id: 2,
      month: 'May 2026',
      action: 'Peak season demand begins',
      details: 'Demand surges 15-20% above annual average. Ensure adequate cold storage capacity.',
      priority: 'Critical',
    },
    {
      id: 3,
      month: 'June-August 2026',
      action: 'Sustain peak inventory levels',
      details: 'Maintain at 120% of normal stock levels. Daily deliveries recommended for parlor outlets.',
      priority: 'Critical',
    },
    {
      id: 4,
      month: 'September 2026',
      action: 'Begin inventory reduction',
      details: 'Reduce orders by 10% as demand falls. Prepare for seasonal transition.',
      priority: 'Medium',
    },
  ];

  const handleDownloadPDF = () => {
    alert('PDF export feature would be implemented in production.\nThis would generate a professional distributor report with:\n- Monthly forecasts\n- Inventory recommendations\n- Seasonal planning guide\n- Growth projections');
  };

  const handleDownloadExcel = () => {
    alert('Excel export feature would be implemented in production.\nThis would generate a detailed spreadsheet with:\n- Monthly demand by SKU & channel\n- Revenue projections\n- Inventory allocation\n- Historical actuals for comparison');
  };

  return (
    <div className="distributor-outlook-container">
      <header className="screen-header">
        <h1>📊 Distributor Outlook & Recommendations</h1>
        <p>12-month demand forecast and strategic planning guide for partner communication</p>
      </header>

      {/* Export Controls */}
      <div className="export-controls">
        <div className="control-group">
          <label>View Format:</label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="format-select"
          >
            <option value="screen">Screen View</option>
            <option value="print">Print-Ready</option>
          </select>
        </div>
        <div className="export-buttons">
          <button className="export-btn pdf" onClick={handleDownloadPDF}>
            📄 Export as PDF
          </button>
          <button className="export-btn excel" onClick={handleDownloadExcel}>
            📊 Export as Excel
          </button>
          <button className="export-btn print" onClick={() => window.print()}>
            🖨️ Print Report
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className={`summary-section ${selectedFormat}`}>
        <h2>Executive Summary</h2>
        <div className="summary-content">
          <p>
            Based on historical demand patterns and market analysis, this 12-month outlook provides
            inventory allocation guidance for optimal distributor-partner planning. The forecast shows
            strong summer seasonality with peak demand in June-August (50% of annual volume).
          </p>
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-value">30,450 L</div>
              <div className="stat-label">Projected 6-Month (Apr-Sep)</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">8.3 L</div>
              <div className="stat-label">Daily Average (Jun-Aug)</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4,250 L</div>
              <div className="stat-label">Peak Month Demand (Aug)</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">±15-25%</div>
              <div className="stat-label">Forecast Confidence Band</div>
            </div>
          </div>
        </div>
      </div>

      {/* 12-Month Demand Forecast */}
      <div className="chart-card">
        <h2>12-Month Demand Forecast by Channel</h2>
        <p className="chart-note">Historical actuals (Oct 2025-Mar 2026) + Forward forecast (Apr-Sep 2026)</p>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={channelAllocationData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis label={{ value: 'Demand (L/day)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Parlor (50%)" stackId="a" fill="#1F77B4" />
            <Bar dataKey="Retail (35%)" stackId="a" fill="#2CA02C" />
            <Bar dataKey="HoReCa (10%)" stackId="a" fill="#FF7F0E" />
            <Bar dataKey="E-com (5%)" stackId="a" fill="#D62728" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SKU Mix */}
      <div className="grid-layout">
        <div className="chart-card">
          <h2>SKU Distribution</h2>
          <p className="chart-note">Annual demand mix by ice cream flavor</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={skuBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {skuBreakdown.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="sku-details-card">
          <h2>SKU Demand Profile</h2>
          <table className="sku-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Annual %</th>
                <th>Peak Month</th>
                <th>Low Month</th>
                <th>Variance</th>
              </tr>
            </thead>
            <tbody>
              <tr className="sku-vanilla">
                <td>🍦 Vanilla</td>
                <td>55%</td>
                <td>Aug (2,338L)</td>
                <td>Dec (1,705L)</td>
                <td>37%</td>
              </tr>
              <tr className="sku-caramel">
                <td>🍪 Caramel</td>
                <td>22%</td>
                <td>Aug (935L)</td>
                <td>Dec (682L)</td>
                <td>37%</td>
              </tr>
              <tr className="sku-mint">
                <td>🌿 Mint</td>
                <td>18%</td>
                <td>Aug (765L)</td>
                <td>Dec (558L)</td>
                <td>37%</td>
              </tr>
              <tr className="sku-chocolate">
                <td>🍫 Chocolate</td>
                <td>5%</td>
                <td>Aug (213L)</td>
                <td>Dec (155L)</td>
                <td>37%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Allocations */}
      <div className="chart-card">
        <h2>Recommended Monthly Inventory Allocation</h2>
        <p className="chart-note">Suggest order quantities for optimal distributor inventory levels</p>
        <div className="allocation-table-wrapper">
          <table className="allocation-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Demand</th>
                <th>Parlor (50%)</th>
                <th>Retail (35%)</th>
                <th>HoReCa (10%)</th>
                <th>E-Com (5%)</th>
                <th>Inventory Notes</th>
              </tr>
            </thead>
            <tbody>
              {outlookData.map((row, idx) => {
                const totalDemand = row.total * 30; // Monthly
                const parlor = Math.round(totalDemand * 0.50);
                const retail = Math.round(totalDemand * 0.35);
                const horeca = Math.round(totalDemand * 0.10);
                const ecom = Math.round(totalDemand * 0.05);

                let notes = '';
                if (idx < 6) notes = '📊 Historical actual';
                else if (idx === 6) notes = '⚠️ Begin inventory build';
                else if (idx >= 7 && idx <= 9) notes = '🔴 Peak season - high stock';
                else notes = '📉 Begin reduction';

                return (
                  <tr key={idx} className={idx < 6 ? 'actual' : 'forecast'}>
                    <td className="month-cell">{row.fullMonth}</td>
                    <td className="demand-cell">{totalDemand.toLocaleString()}</td>
                    <td className="parlor-cell">{parlor.toLocaleString()}</td>
                    <td className="retail-cell">{retail.toLocaleString()}</td>
                    <td className="horeca-cell">{horeca.toLocaleString()}</td>
                    <td className="ecom-cell">{ecom.toLocaleString()}</td>
                    <td className="notes-cell">{notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distributor Action Items */}
      <div className="action-items-section">
        <h2>🎯 Distributor Action Items & Timeline</h2>
        <div className="action-items-grid">
          {distributorRecommendations.map(item => (
            <div key={item.id} className={`action-card priority-${item.priority.toLowerCase()}`}>
              <div className="action-header">
                <span className="action-month">{item.month}</span>
                <span className={`priority-badge ${item.priority.toLowerCase()}`}>
                  {item.priority}
                </span>
              </div>
              <h3>{item.action}</h3>
              <p>{item.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth & Opportunity */}
      <div className="opportunities-section">
        <h2>📈 Growth Opportunities & Recommendations</h2>
        <div className="opportunities-grid">
          <div className="opp-card">
            <h3>Summer Peak Management</h3>
            <p>
              June-August shows consistent 25-30% above-average demand. Recommend distributor
              increase cold storage capacity by 25% and implement daily delivery schedules.
            </p>
            <div className="action-text">↳ Impact: +10% revenue during peak season</div>
          </div>
          <div className="opp-card">
            <h3>E-Commerce Expansion</h3>
            <p>
              E-commerce shows fastest growth (35% YoY) but is only 5% of current mix.
              Partner with Swiggy, Blinkit, Zomato for rapid expansion opportunity.
            </p>
            <div className="action-text">↳ Impact: Could reach 10% share in 12 months</div>
          </div>
          <div className="opp-card">
            <h3>Vanilla Focus</h3>
            <p>
              Vanilla drives 55% of revenue. Prioritize shelf space, promotional support,
              and premium positioning in modern retail outlets.
            </p>
            <div className="action-text">↳ Impact: +8% volume through channel optimization</div>
          </div>
          <div className="opp-card">
            <h3>Seasonal Product Mix</h3>
            <p>
              Launch seasonal flavors and premium variants in Apr-May ahead of peak summer season
              to capture premium price points and margin expansion.
            </p>
            <div className="action-text">↳ Impact: +15% margin improvement during peak</div>
          </div>
        </div>
      </div>

      {/* Risk Mitigation */}
      <div className="risks-section">
        <h2>⚠️ Risk Factors & Mitigation</h2>
        <div className="risks-grid">
          <div className="risk-card">
            <h3>Forecast Uncertainty</h3>
            <p>Far-term forecast (Jul-Sep) has ±25% confidence band due to weather variability.</p>
            <div className="mitigation">
              <strong>Mitigation:</strong> Monthly forecast updates starting April. Implement
              flexible supply agreements with quick-response logistics.
            </div>
          </div>
          <div className="risk-card">
            <h3>Cold Chain Costs</h3>
            <p>Peak season requires 50%+ increase in cold storage and transportation capacity.</p>
            <div className="mitigation">
              <strong>Mitigation:</strong> Share cold storage infrastructure. Implement
              vendor-managed inventory (VMI) for efficient stock turns.
            </div>
          </div>
          <div className="risk-card">
            <h3>Channel Volatility</h3>
            <p>E-commerce (5% share) can swing ±40% monthly; retail can vary ±20%.</p>
            <div className="mitigation">
              <strong>Mitigation:</strong> Diversified channel approach. Weekly demand reviews
              for quick supply chain adjustments.
            </div>
          </div>
          <div className="risk-card">
            <h3>Competitive Pressure</h3>
            <p>Summer peaks attract aggressive competitive promotions and margin pressure.</p>
            <div className="mitigation">
              <strong>Mitigation:</strong> Pre-market premium variants and exclusive SKUs.
              Lock in distributor partnerships with volume incentives.
            </div>
          </div>
        </div>
      </div>

      {/* Footer Message */}
      <div className="footer-message">
        <p>
          <strong>Confidential - For Distributor Partners Only</strong><br/>
          This 12-month outlook is based on historical demand analysis and is subject to revision
          based on market conditions. Please discuss any specific inventory or planning questions
          with your account manager. For further information or clarification, contact our sales team.
        </p>
      </div>
    </div>
  );
};

export default DistributorOutlook;
