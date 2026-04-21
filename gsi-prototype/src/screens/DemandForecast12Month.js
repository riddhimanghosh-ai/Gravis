import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import FilterPanel from '../components/FilterPanel';
import '../styles/DemandForecast12Month.css';

const DemandForecast12Month = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const channels = useMemo(() => ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);

  const [selectedMetric, setSelectedMetric] = useState('combined');
  const [filters, setFilters] = useState({
    cities: cities,
    channels: channels,
    skus: skus,
  });

  // Generate 12-month data (6 months historical + 6 months forecast) with city & SKU dimensions
  const generateMonthlyData = () => {
    const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026',
                    'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
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
              city: city,
              channel: channel,
              sku: sku,
              actual: actual,
              forecast: isForecast ? actual + (Math.random() * 400 - 200) : null,
              upper: isForecast ? actual * (1 + confidence) : null,
              lower: isForecast ? actual * (1 - confidence) : null,
              parlor: Math.round(actual * channelShare),
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

  // Aggregate data by month and channel (filtered by city & SKU)
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
      const upper = monthData.reduce((sum, d) => sum + (d.upper || 0), 0);
      const lower = monthData.reduce((sum, d) => sum + (d.lower || 0), 0);
      const isForecast = monthData.length > 0 && monthData[0].type === 'Forecast';

      return {
        month: month,
        fullMonth: monthData.length > 0 ? monthData[0].fullMonth : `${month} 2026`,
        actual: actual,
        forecast: isForecast ? forecast : null,
        upper: isForecast ? upper : null,
        lower: isForecast ? lower : null,
        parlor: monthData.reduce((sum, d) => sum + d.parlor, 0),
        retail: monthData.reduce((sum, d) => sum + d.retail, 0),
        horeca: monthData.reduce((sum, d) => sum + d.horeca, 0),
        ecommerce: monthData.reduce((sum, d) => sum + d.ecommerce, 0),
        type: isForecast ? 'Forecast' : 'Actual',
      };
    });
  }, [rawData, filters]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const historicalData = aggregatedData.slice(0, 6);
    const forecastData = aggregatedData.slice(6, 12);

    const avgHistorical = Math.round(
      historicalData.reduce((sum, d) => sum + d.actual, 0) / 6
    );
    const avgForecast = Math.round(
      forecastData.reduce((sum, d) => sum + (d.forecast || d.actual), 0) / 6
    );
    const growth = Math.round(((avgForecast - avgHistorical) / avgHistorical) * 100);

    const peakMonth = aggregatedData.reduce((max, d) =>
      (d.actual > max.actual) ? d : max
    );

    const minMonth = aggregatedData.reduce((min, d) =>
      (d.actual < min.actual) ? d : min
    );

    // Calculate seasonality index (ratio to average)
    const avgDemand = Math.round(
      aggregatedData.reduce((sum, d) => sum + d.actual, 0) / 12
    );

    return { avgHistorical, avgForecast, growth, peakMonth, minMonth, avgDemand };
  }, [aggregatedData]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label">{data.fullMonth}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }}>
              {entry.name}: {Math.round(entry.value).toLocaleString()} L
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="demand-12month-container">
      <header className="screen-header">
        <h1>📊 12-Month Demand Forecast</h1>
        <p>Comprehensive view: 6 months historical actuals + 6 months forward forecast</p>
      </header>

      {/* Filter Panel */}
      <FilterPanel
        cities={cities}
        channels={channels}
        skus={skus}
        defaultSelectedCities={cities}
        defaultSelectedChannels={channels}
        defaultSelectedSkus={skus}
        onFilterChange={handleFilterChange}
      />

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Avg Historical (Last 6M)</div>
          <div className="metric-value">{metrics.avgHistorical.toLocaleString()} L</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Forecast (Next 6M)</div>
          <div className="metric-value">{metrics.avgForecast.toLocaleString()} L</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Projected Growth</div>
          <div className={`metric-value ${metrics.growth >= 0 ? 'positive' : 'negative'}`}>
            {metrics.growth >= 0 ? '+' : ''}{metrics.growth}%
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Peak Month</div>
          <div className="metric-value">{metrics.peakMonth.month}</div>
          <div className="metric-subtext">{metrics.peakMonth.actual.toLocaleString()} L</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Lowest Month</div>
          <div className="metric-value">{metrics.minMonth.month}</div>
          <div className="metric-subtext">{metrics.minMonth.actual.toLocaleString()} L</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Annual Average</div>
          <div className="metric-value">{metrics.avgDemand.toLocaleString()} L</div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="chart-controls">
        <button
          className={`control-btn ${selectedMetric === 'combined' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('combined')}
        >
          Combined View
        </button>
        <button
          className={`control-btn ${selectedMetric === 'channels' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('channels')}
        >
          Channel Distribution
        </button>
        <button
          className={`control-btn ${selectedMetric === 'breakdown' ? 'active' : ''}`}
          onClick={() => setSelectedMetric('breakdown')}
        >
          Monthly Breakdown
        </button>
      </div>

      {/* Combined Historical + Forecast Chart */}
      {selectedMetric === 'combined' && (
        <div className="chart-section">
          <h2>Historical Actuals vs Forward Forecast</h2>
          <p className="chart-description">
            Solid lines = Historical actuals (Oct 2025 - Mar 2026) | Dashed lines = Forecast with confidence bands (Apr - Sep 2026)
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={aggregatedData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Demand (L/day)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* Confidence interval as area */}
              <Area
                type="monotone"
                dataKey="upper"
                fill="#90EE90"
                stroke="none"
                fillOpacity={0.2}
                name="Confidence Band"
              />
              <Area
                type="monotone"
                dataKey="lower"
                fill="#90EE90"
                stroke="none"
                fillOpacity={0.2}
              />

              {/* Actual demand line */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#1F77B4"
                strokeWidth={2}
                dot={{ fill: '#1F77B4', r: 4 }}
                name="Actual Demand"
              />

              {/* Forecast line (dashed) */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#FF7F0E"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#FF7F0E', r: 4 }}
                name="Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="confidence-legend">
            <span className="legend-item"><span className="legend-color" style={{ backgroundColor: '#90EE90' }}></span> Confidence Interval (±5-25%)</span>
            <span className="legend-item"><span className="legend-dash" style={{ borderTop: '2px solid #1F77B4' }}></span> Historical Data</span>
            <span className="legend-item"><span className="legend-dash" style={{ borderTop: '2px dashed #FF7F0E' }}></span> Forecast Data</span>
          </div>
        </div>
      )}

      {/* Channel Distribution Chart */}
      {selectedMetric === 'channels' && (
        <div className="chart-section">
          <h2>Demand Distribution by Channel</h2>
          <p className="chart-description">
            Monthly demand breakdown across Parlor (50%), Retail (35%), HoReCa (10%), and E-commerce (5%) channels
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={aggregatedData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Demand (L/day)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Area type="monotone" dataKey="parlor" stackId="1" stroke="#1F77B4" fill="#1F77B4" name="Parlor (50%)" />
              <Area type="monotone" dataKey="retail" stackId="1" stroke="#2CA02C" fill="#2CA02C" name="Retail (35%)" />
              <Area type="monotone" dataKey="horeca" stackId="1" stroke="#FF7F0E" fill="#FF7F0E" name="HoReCa (10%)" />
              <Area type="monotone" dataKey="ecommerce" stackId="1" stroke="#D62728" fill="#D62728" name="E-commerce (5%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Monthly Breakdown Table */}
      {selectedMetric === 'breakdown' && (
        <div className="chart-section">
          <h2>Month-by-Month Demand Breakdown</h2>
          <div className="breakdown-table-wrapper">
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Type</th>
                  <th>Demand (L)</th>
                  <th>Parlor</th>
                  <th>Retail</th>
                  <th>HoReCa</th>
                  <th>E-commerce</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {aggregatedData.map((row, idx) => (
                  <tr key={idx} className={row.type === 'Forecast' ? 'forecast-row' : 'actual-row'}>
                    <td>{row.fullMonth}</td>
                    <td className={`type-badge ${row.type.toLowerCase()}`}>{row.type}</td>
                    <td className="demand-value">
                      {row.type === 'Forecast' ?
                        Math.round(row.forecast).toLocaleString() :
                        row.actual.toLocaleString()
                      }
                    </td>
                    <td>{row.parlor.toLocaleString()}</td>
                    <td>{row.retail.toLocaleString()}</td>
                    <td>{row.horeca.toLocaleString()}</td>
                    <td>{row.ecommerce.toLocaleString()}</td>
                    <td>
                      {row.type === 'Forecast' ?
                        `±${Math.round((row.upper - row.lower) / 2 / (row.forecast || row.actual) * 100)}%` :
                        'Actual'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seasonality Analysis */}
      <div className="chart-section">
        <h2>Seasonality Index by Month</h2>
        <p className="chart-description">
          Ratio of monthly demand to annual average. Higher values indicate peak seasons.
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aggregatedData.map(d => ({
            ...d,
            seasonalityIndex: (d.actual / metrics.avgDemand).toFixed(2)
          }))} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis label={{ value: 'Index (1.0 = avg)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value) => value}
              labelFormatter={(label) => `Seasonality: ${label}`}
            />
            <Bar dataKey="seasonalityIndex" fill="#4CAF50" name="Seasonality Index" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Planning Insights */}
      <div className="insights-section">
        <h2>📌 Planning Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Peak Season Alert</h3>
            <p>June - August shows 20-30% above average demand. Plan production capacity increases and distributor allocation accordingly.</p>
          </div>
          <div className="insight-card">
            <h3>Forecast Confidence</h3>
            <p>Near-term (Apr-May): ±5-10% | Mid-term (Jun-Jul): ±10-15% | Far-term (Aug-Sep): ±15-25%</p>
          </div>
          <div className="insight-card">
            <h3>Channel Strategy</h3>
            <p>Parlor (50%) drives primary demand. Focus inventory and distribution on this channel while monitoring retail growth (35%).</p>
          </div>
          <div className="insight-card">
            <h3>Annual Budgeting</h3>
            <p>Total projected demand: ~77,500 L over 12 months. Use for capacity planning and distributor communication.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandForecast12Month;
