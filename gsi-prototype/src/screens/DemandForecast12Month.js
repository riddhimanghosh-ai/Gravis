import React, { useState, useMemo } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import FilterPanel from '../components/FilterPanel';
import '../styles/DemandForecast12Month.css';

const DemandForecast12Month = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const channels = useMemo(() => ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);

  const [filters, setFilters] = useState({
    cities: cities,
    channels: channels,
    skus: skus,
  });

  const [showCharts, setShowCharts] = useState(false);

  const generateMonthlyData = () => {
    const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
    const baselineDemand = [4200, 5100, 6200, 5800, 4900, 5300, 5400, 7100, 8200, 8500, 8100, 6900];
    const cityWeights = { 'Bangalore': 0.40, 'Hyderabad': 0.30, 'Chennai': 0.20, 'Pune': 0.10 };
    const skuWeights = { 'Vanilla': 0.55, 'Caramel': 0.22, 'Mint': 0.18, 'Chocolate': 0.05 };

    const allData = [];
    months.forEach((month, idx) => {
      cities.forEach(city => {
        channels.forEach(channel => {
          skus.forEach(sku => {
            const isForecast = idx >= 6;
            const confidence = isForecast ? (idx >= 9 ? 0.25 : 0.15) : 0;
            const cityShare = cityWeights[city];
            const skuShare = skuWeights[sku];
            const channelShare = channel === 'Parlor' ? 0.50 : channel === 'Retail' ? 0.35 : channel === 'HoReCa' ? 0.10 : 0.05;
            const actual = Math.round(baselineDemand[idx] * cityShare * skuShare);

            allData.push({
              month: month.split(' ')[0],
              fullMonth: month,
              city, channel, sku,
              actual,
              forecast: isForecast ? actual + (Math.random() * 400 - 200) : null,
              upper: isForecast ? actual * (1 + confidence) : null,
              lower: isForecast ? actual * (1 - confidence) : null,
              parlor: Math.round(actual * 0.50),
              retail: Math.round(actual * 0.35),
              horeca: Math.round(actual * 0.10),
              ecommerce: Math.round(actual * 0.05),
              type: isForecast ? 'Forecast' : 'Actual',
            });
          });
        });
      });
    });
    return allData;
  };

  const rawData = generateMonthlyData();

  const aggregatedData = useMemo(() => {
    const filtered = rawData.filter(item =>
      filters.cities.includes(item.city) &&
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );

    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    return months.map(month => {
      const monthData = filtered.filter(d => d.month === month);
      const actual = monthData.reduce((sum, d) => sum + d.actual, 0);
      const forecast = monthData.reduce((sum, d) => sum + (d.forecast || 0), 0);
      const isForecast = monthData.length > 0 && monthData[0].type === 'Forecast';

      return {
        month,
        fullMonth: monthData.length > 0 ? monthData[0].fullMonth : `${month} 2026`,
        actual,
        forecast: isForecast ? forecast : null,
        parlor: monthData.reduce((sum, d) => sum + d.parlor, 0),
        retail: monthData.reduce((sum, d) => sum + d.retail, 0),
        horeca: monthData.reduce((sum, d) => sum + d.horeca, 0),
        ecommerce: monthData.reduce((sum, d) => sum + d.ecommerce, 0),
        type: isForecast ? 'Forecast' : 'Actual',
      };
    });
  }, [rawData, filters]);

  const metrics = useMemo(() => {
    const historicalData = aggregatedData.slice(0, 6);
    const forecastData = aggregatedData.slice(6, 12);
    const avgHistorical = Math.round(historicalData.reduce((sum, d) => sum + d.actual, 0) / 6);
    const avgForecast = Math.round(forecastData.reduce((sum, d) => sum + (d.forecast || d.actual), 0) / 6);
    const growth = avgHistorical > 0 ? Math.round(((avgForecast - avgHistorical) / avgHistorical) * 100) : 0;
    const totalAnnual = aggregatedData.reduce((sum, d) => sum + d.actual, 0);
    const peakMonth = aggregatedData.reduce((max, d) => d.actual > max.actual ? d : max);
    return { avgHistorical, avgForecast, growth, totalAnnual, peakMonth };
  }, [aggregatedData]);

  return (
    <div className="demand-12month-container">
      <header className="screen-header">
        <h1>📊 12-Month Demand Forecast</h1>
        <p>Data-driven planning: 6 months historical + 6 months forecast</p>
      </header>

      <FilterPanel cities={cities} channels={channels} skus={skus} defaultSelectedCities={cities} defaultSelectedChannels={channels} defaultSelectedSkus={skus} onFilterChange={setFilters} />

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Avg Historical (Last 6M)</div>
          <div className="metric-value">{metrics.avgHistorical.toLocaleString()} L/mo</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Forecast (Next 6M)</div>
          <div className="metric-value">{metrics.avgForecast.toLocaleString()} L/mo</div>
        </div>
        <div className={`metric-card ${metrics.growth >= 0 ? 'positive' : 'negative'}`}>
          <div className="metric-label">Growth Projection</div>
          <div className="metric-value">{metrics.growth >= 0 ? '+' : ''}{metrics.growth}%</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Annual Demand</div>
          <div className="metric-value">{metrics.totalAnnual.toLocaleString()} L</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Peak Month</div>
          <div className="metric-value">{metrics.peakMonth.month}</div>
          <div className="metric-subtext">{metrics.peakMonth.actual.toLocaleString()} L</div>
        </div>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>📋 12-Month Demand Table</h2>
          <p>Planning table: Actual and Forecast by Month and Channel</p>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Period</th>
                <th className="number">Total (L)</th>
                <th className="number">Parlor (L)</th>
                <th className="number">Retail (L)</th>
                <th className="number">HoReCa (L)</th>
                <th className="number">E-Com (L)</th>
                <th className="number">MoM %</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedData.map((row, idx) => {
                const prevTotal = idx > 0 ? aggregatedData[idx - 1].actual : 0;
                const growth = prevTotal > 0 ? Math.round(((row.actual - prevTotal) / prevTotal) * 100) : 0;
                const rowType = row.type === 'Forecast' ? 'forecast' : 'actual';

                return (
                  <tr key={idx} className={`row-${rowType}`}>
                    <td className="highlight">{row.month}</td>
                    <td className="period-badge">{row.type}</td>
                    <td className="number" style={{ fontWeight: 'bold' }}>{row.actual.toLocaleString()}</td>
                    <td className="number">{row.parlor.toLocaleString()}</td>
                    <td className="number">{row.retail.toLocaleString()}</td>
                    <td className="number">{row.horeca.toLocaleString()}</td>
                    <td className="number">{row.ecommerce.toLocaleString()}</td>
                    <td className={`number growth-${growth >= 0 ? 'positive' : 'negative'}`}>{growth >= 0 ? '+' : ''}{growth}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>📈 Seasonality & Trends</h2>
          <p>Month-by-month analysis with seasonal index</p>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th className="number">Demand (L)</th>
                <th className="number">Index (vs Avg)</th>
                <th className="number">% of Annual</th>
                <th>Seasonal Pattern</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedData.map((row, idx) => {
                const avgDemand = metrics.totalAnnual / 12;
                const seasonalIndex = (row.actual / avgDemand).toFixed(2);
                const percentOfAnnual = ((row.actual / metrics.totalAnnual) * 100).toFixed(1);
                let pattern = '';
                if (seasonalIndex > 1.15) pattern = '📈 Peak Season';
                else if (seasonalIndex > 0.95) pattern = '→ Average';
                else pattern = '📉 Low Season';

                return (
                  <tr key={idx}>
                    <td className="highlight">{row.month}</td>
                    <td className="number">{row.actual.toLocaleString()}</td>
                    <td className="number">{seasonalIndex}x</td>
                    <td className="number">{percentOfAnnual}%</td>
                    <td>{pattern}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-toggle-section">
        <button className="toggle-charts-btn" onClick={() => setShowCharts(!showCharts)}>
          {showCharts ? '▼ Hide' : '▶ Show'} Chart Visualizations
        </button>

        {showCharts && (
          <div className="charts-grid">
            <div className="chart-container">
              <h3>Channel Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={aggregatedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="parlor" stackId="1" fill="#1F77B4" name="Parlor" />
                  <Area type="monotone" dataKey="retail" stackId="1" fill="#2CA02C" name="Retail" />
                  <Area type="monotone" dataKey="horeca" stackId="1" fill="#FF7F0E" name="HoReCa" />
                  <Area type="monotone" dataKey="ecommerce" stackId="1" fill="#D62728" name="E-Commerce" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Demand Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={aggregatedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" fill="#1F77B4" name="Demand (L)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="insights-section">
        <h2>📌 Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Peak Season</h3>
            <p>June-August shows 20-30% above average. Plan capacity increases accordingly.</p>
          </div>
          <div className="insight-card">
            <h3>Growth Trend</h3>
            <p>Forecast {metrics.growth >= 0 ? `+${metrics.growth}%` : `${metrics.growth}%`} growth in next 6 months.</p>
          </div>
          <div className="insight-card">
            <h3>Channel Focus</h3>
            <p>Parlor drives 50% of demand. Focus distribution and inventory on this channel.</p>
          </div>
          <div className="insight-card">
            <h3>Annual Plan</h3>
            <p>{metrics.totalAnnual.toLocaleString()} L total demand. Use for annual budgeting.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandForecast12Month;
