import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FilterPanel from '../components/FilterPanel';
import '../styles/ManufacturingExecutionPlanning.css';

const ManufacturingExecutionPlanning = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const channels = useMemo(() => ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);

  const [filters, setFilters] = useState({
    cities: cities,
    channels: channels,
    skus: skus,
  });

  const [showChart, setShowChart] = useState(false);

  const generateProductionData = () => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const baselineTrend = [2100, 2550, 3100, 2900, 2450, 2650, 2700, 3550, 4100, 4250, 4050, 3450];
    const skuWeights = { 'Vanilla': 0.55, 'Caramel': 0.22, 'Mint': 0.18, 'Chocolate': 0.05 };
    const channelWeights = { 'Parlor': 0.50, 'Retail': 0.35, 'HoReCa': 0.10, 'E-Commerce': 0.05 };
    const cityWeights = { 'Bangalore': 0.40, 'Hyderabad': 0.30, 'Chennai': 0.20, 'Pune': 0.10 };

    const data = [];
    months.forEach((month, idx) => {
      skus.forEach(sku => {
        channels.forEach(channel => {
          cities.forEach(city => {
            const baseDemand = Math.round(
              baselineTrend[idx] * skuWeights[sku] * channelWeights[channel] * cityWeights[city]
            );
            const currentInv = Math.round(baseDemand * 0.6);
            const safetyStock = Math.round(baseDemand * 0.5);
            const productionNeeded = Math.max(0, baseDemand - currentInv + safetyStock);

            data.push({
              month,
              city,
              sku,
              channel,
              demand: baseDemand,
              currentInventory: currentInv,
              safetyStock: safetyStock,
              productionNeeded: productionNeeded,
              feasible: productionNeeded <= 75 * 20,
              status: productionNeeded <= 75 * 20 ? 'OK' : 'WARNING',
            });
          });
        });
      });
    });

    return data;
  };

  const rawData = generateProductionData();

  const filteredData = useMemo(() => {
    return rawData.filter(item =>
      filters.cities.includes(item.city) &&
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );
  }, [rawData, filters]);

  const metrics = useMemo(() => {
    const totalDemand = filteredData.reduce((sum, d) => sum + d.demand, 0);
    const totalProduction = filteredData.reduce((sum, d) => sum + d.productionNeeded, 0);
    const totalInventory = filteredData.reduce((sum, d) => sum + d.currentInventory, 0);
    const feasibilityIssues = filteredData.filter(d => d.status === 'WARNING').length;
    const avgUtilization = totalProduction > 0 ? Math.round((totalProduction / (75 * 20 * 12)) * 100) : 0;

    return { totalDemand: Math.round(totalDemand), totalProduction: Math.round(totalProduction), totalInventory: Math.round(totalInventory), feasibilityIssues, avgUtilization };
  }, [filteredData]);

  const monthlySummary = useMemo(() => {
    const months = {};
    filteredData.forEach(item => {
      if (!months[item.month]) {
        months[item.month] = { month: item.month, demand: 0, production: 0, inventory: 0, warnings: 0 };
      }
      months[item.month].demand += item.demand;
      months[item.month].production += item.productionNeeded;
      months[item.month].inventory += item.currentInventory;
      if (item.status === 'WARNING') months[item.month].warnings += 1;
    });
    return Object.values(months).sort((a, b) => {
      const monthOrder = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  }, [filteredData]);

  const lineCapacity = [
    { line: 'Line 1', capacity: 30, currentUtilization: 25, status: 'Normal' },
    { line: 'Line 2', capacity: 25, currentUtilization: 22, status: 'Normal' },
    { line: 'Line 3', capacity: 20, currentUtilization: 18, status: 'Normal' },
  ];

  return (
    <div className="mep-container">
      <header className="screen-header">
        <h1>🏭 Manufacturing Execution Planning</h1>
        <p>Production decisions based on demand, inventory, and line capacity</p>
      </header>

      <FilterPanel
        cities={cities}
        channels={channels}
        skus={skus}
        defaultSelectedCities={cities}
        defaultSelectedChannels={channels}
        defaultSelectedSkus={skus}
        onFilterChange={setFilters}
      />

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Demand</div>
          <div className="metric-value">{metrics.totalDemand.toLocaleString()} L</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Production Required</div>
          <div className="metric-value">{metrics.totalProduction.toLocaleString()} L</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Current Inventory</div>
          <div className="metric-value">{metrics.totalInventory.toLocaleString()} L</div>
        </div>
        <div className={`metric-card ${metrics.feasibilityIssues > 0 ? 'warning' : 'ok'}`}>
          <div className="metric-label">Feasibility Issues</div>
          <div className="metric-value">{metrics.feasibilityIssues}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Utilization</div>
          <div className="metric-value">{metrics.avgUtilization}%</div>
        </div>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>📊 Monthly Production Plan</h2>
          <p>Decision-making view: Demand, Production Required, Inventory Status</p>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th className="number">Demand (L)</th>
                <th className="number">Current Inventory (L)</th>
                <th className="number">Safety Stock (L)</th>
                <th className="number">Production Needed (L)</th>
                <th className="number">Line Capacity (L)</th>
                <th className="number">Utilization %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {monthlySummary.map((row, idx) => {
                const lineCapacityPerMonth = 75 * 20;
                const utilization = Math.round((row.production / lineCapacityPerMonth) * 100);
                const isFeasible = row.production <= lineCapacityPerMonth;

                return (
                  <tr key={idx} className={isFeasible ? 'status-ok' : 'status-warning'}>
                    <td className="highlight">{row.month}</td>
                    <td className="number">{row.demand.toLocaleString()}</td>
                    <td className="number">{row.inventory.toLocaleString()}</td>
                    <td className="number">{Math.round(row.demand * 0.5).toLocaleString()}</td>
                    <td className="number highlight">{row.production.toLocaleString()}</td>
                    <td className="number">{lineCapacityPerMonth.toLocaleString()}</td>
                    <td className="number">{utilization}%</td>
                    <td><span className={`status-badge ${isFeasible ? 'ok' : 'warning'}`}>{isFeasible ? '✓ OK' : '⚠ WARNING'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>📋 Detailed Production Requirements</h2>
          <p>Complete breakdown by SKU, Channel, and City (showing first 30 records)</p>
        </div>

        <div className="table-wrapper">
          <table className="data-table detailed">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Channel</th>
                <th>City</th>
                <th className="number">Demand (L)</th>
                <th className="number">Current Inv (L)</th>
                <th className="number">Safety Stock (L)</th>
                <th className="number">To Produce (L)</th>
                <th>Feasible?</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 30).map((row, idx) => (
                <tr key={idx} className={row.feasible ? 'status-ok' : 'status-warning'}>
                  <td className="highlight">{row.sku}</td>
                  <td>{row.channel}</td>
                  <td>{row.city}</td>
                  <td className="number">{row.demand}</td>
                  <td className="number">{row.currentInventory}</td>
                  <td className="number">{row.safetyStock}</td>
                  <td className="number highlight">{row.productionNeeded}</td>
                  <td><span className={`status-badge ${row.feasible ? 'ok' : 'warning'}`}>{row.feasible ? '✓' : '✗'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="table-footer">Total records: {filteredData.length}</div>
        </div>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>⚙️ Production Line Capacity</h2>
          <p>Current utilization of production lines (20 working days/month)</p>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Line</th>
                <th className="number">Capacity (L/day)</th>
                <th className="number">Monthly Capacity (L)</th>
                <th className="number">Current Utilization (L)</th>
                <th className="number">Utilization %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lineCapacity.map((line, idx) => {
                const monthlyCapacity = line.capacity * 20;
                const utilPercent = Math.round((line.currentUtilization * 20 / monthlyCapacity) * 100);
                const status = utilPercent > 90 ? 'warning' : utilPercent > 70 ? 'caution' : 'ok';

                return (
                  <tr key={idx} className={`status-${status}`}>
                    <td className="highlight">{line.line}</td>
                    <td className="number">{line.capacity}</td>
                    <td className="number">{monthlyCapacity}</td>
                    <td className="number">{line.currentUtilization * 20}</td>
                    <td className="number">{utilPercent}%</td>
                    <td><span className={`status-badge ${status}`}>{status === 'ok' ? '✓ OK' : status === 'caution' ? '⚠ Caution' : '⚠ High'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-section">
        <button className="toggle-chart-btn" onClick={() => setShowChart(!showChart)}>
          {showChart ? '▼ Hide' : '▶ Show'} Monthly Trend Chart
        </button>

        {showChart && (
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Liters (L)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="demand" fill="#1F77B4" name="Demand" />
                <Bar dataKey="production" fill="#FF7F0E" name="Production Needed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="guidelines-section">
        <h2>📌 Decision Guidelines</h2>
        <div className="guidelines-grid">
          <div className="guideline-card"><h3>✓ GREEN (Feasible)</h3><p>Production needed ≤ Line capacity. Proceed with scheduling.</p></div>
          <div className="guideline-card warning"><h3>⚠ YELLOW (Caution)</h3><p>High utilization (70-90%). Consider distributor communication or additional shifts.</p></div>
          <div className="guideline-card"><h3>⚠ RED (Warning)</h3><p>Exceeds capacity. Negotiate demand with channels or plan for line expansion.</p></div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturingExecutionPlanning;
