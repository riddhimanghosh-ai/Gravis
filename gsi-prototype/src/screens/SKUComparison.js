import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import FilterPanel from '../components/FilterPanel';
import '../styles/SKUComparison.css';

const SKUComparison = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const channels = useMemo(() => ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'], []);
  const skus = useMemo(() => [
    { id: 'vanilla', name: 'Vanilla', color: '#1F77B4', capacity: 3600 },
    { id: 'caramel', name: 'Caramel', color: '#D62728', capacity: 1800 },
    { id: 'mint', name: 'Mint', color: '#2CA02C', capacity: 2160 },
    { id: 'chocolate', name: 'Chocolate', color: '#9467BD', capacity: 1440 },
  ], []);

  const [selectedView, setSelectedView] = useState('timeline');
  const [filters, setFilters] = useState({
    cities: cities,
    channels: channels,
    skus: ['Vanilla', 'Caramel', 'Mint', 'Chocolate'],
  });

  // Generate 12-month data for each SKU with city & channel dimensions
  const generateSKUData = () => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const baselineTrend = [2100, 2550, 3100, 2900, 2450, 2650, 2700, 3550, 4100, 4250, 4050, 3450];
    const cityWeights = { 'Bangalore': 0.40, 'Hyderabad': 0.30, 'Chennai': 0.20, 'Pune': 0.10 };
    const skuWeights = { 'Vanilla': 0.55, 'Caramel': 0.22, 'Mint': 0.18, 'Chocolate': 0.05 };

    const allData = [];

    months.forEach((month, idx) => {
      cities.forEach(city => {
        channels.forEach(channel => {
          skus.forEach(sku => {
            const cityShare = cityWeights[city];
            const skuShare = skuWeights[sku.name];
            const channelShare = channel === 'Parlor' ? 0.50 : channel === 'Retail' ? 0.35 : channel === 'HoReCa' ? 0.10 : 0.05;

            const demand = Math.round(baselineTrend[idx] * cityShare * channelShare * skuShare);

            allData.push({
              month: month,
              fullMonth: month + ' 2026',
              city: city,
              channel: channel,
              sku: sku.name,
              demand: demand,
              skuId: sku.id,
            });
          });
        });
      });
    });

    return allData;
  };

  const rawData = generateSKUData();

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return rawData.filter(item =>
      filters.cities.includes(item.city) &&
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );
  }, [rawData, filters]);

  // Generate timeline data from filtered data
  const timelineData = useMemo(() => {
    const aggregated = {};
    filteredData.forEach(item => {
      if (!aggregated[item.month]) {
        aggregated[item.month] = {
          month: item.month,
          fullMonth: item.fullMonth,
          vanilla: 0,
          caramel: 0,
          mint: 0,
          chocolate: 0,
        };
      }
      const skuKey = item.sku.toLowerCase();
      aggregated[item.month][skuKey] += item.demand;
    });
    return Object.values(aggregated).sort((a, b) => ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].indexOf(a.month) - ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].indexOf(b.month));
  }, [filteredData]);

  // Calculate SKU metrics from filtered data
  const skuMetrics = useMemo(() => {
    const metrics = skus.map(sku => {
      const demand = timelineData.map(d => d[sku.id.toLowerCase()] || 0);
      const annualVolume = demand.reduce((a, b) => a + b, 0);
      const avgMonthly = demand.length > 0 ? Math.round(annualVolume / demand.length) : 0;
      const peakMonth = demand.length > 0 ? Math.max(...demand) : 0;
      const minMonth = demand.length > 0 ? Math.min(...demand) : 0;
      const utilization = avgMonthly > 0 ? Math.round((avgMonthly / (sku.capacity / 30)) * 100) : 0;
      const growth = demand.length > 1 && demand[0] > 0 ? Math.round(((demand[demand.length - 1] - demand[0]) / demand[0]) * 100) : 0;

      return {
        ...sku,
        annualVolume,
        avgMonthly,
        peakMonth,
        minMonth,
        utilization: Math.min(utilization, 100),
        growth,
        riskLevel: utilization > 90 ? 'high' : utilization > 70 ? 'medium' : 'low',
      };
    });

    return metrics;
  }, [timelineData, skus]);

  // Data for radar chart (normalization)
  const radarData = skuMetrics.map(sku => ({
    name: sku.name,
    volume: (sku.annualVolume / 100),
    utilization: sku.utilization,
    growth: Math.abs(sku.growth) * 2, // Scale for visibility
    variance: Math.round(((sku.peakMonth - sku.minMonth) / sku.avgMonthly) * 100),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.month}</p>
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

  return (
    <div className="sku-comparison-container">
      <header className="screen-header">
        <h1>📊 SKU Comparison Dashboard</h1>
        <p>Compare all 4 ice cream flavors across 12-month period with capacity analysis</p>
      </header>

      {/* Filter Panel */}
      <FilterPanel
        cities={cities}
        channels={channels}
        skus={['Vanilla', 'Caramel', 'Mint', 'Chocolate']}
        onFilterChange={setFilters}
        defaultSelectedCities={cities}
        defaultSelectedChannels={channels}
        defaultSelectedSkus={['Vanilla', 'Caramel', 'Mint', 'Chocolate']}
      />

      {/* View Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedView('metrics')}
          style={{
            padding: '10px 16px',
            background: selectedView === 'metrics' ? '#1F77B4' : 'white',
            color: selectedView === 'metrics' ? 'white' : '#666',
            border: `2px solid ${selectedView === 'metrics' ? '#1F77B4' : '#e0e0e0'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          📊 Metrics Cards
        </button>
        <button
          onClick={() => setSelectedView('table')}
          style={{
            padding: '10px 16px',
            background: selectedView === 'table' ? '#1F77B4' : 'white',
            color: selectedView === 'table' ? 'white' : '#666',
            border: `2px solid ${selectedView === 'table' ? '#1F77B4' : '#e0e0e0'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          📋 Tabular View
        </button>
        <button
          onClick={() => setSelectedView('timeline')}
          style={{
            padding: '10px 16px',
            background: selectedView === 'timeline' ? '#1F77B4' : 'white',
            color: selectedView === 'timeline' ? 'white' : '#666',
            border: `2px solid ${selectedView === 'timeline' ? '#1F77B4' : '#e0e0e0'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          📈 Timeline View
        </button>
        <button
          onClick={() => setSelectedView('capacity')}
          style={{
            padding: '10px 16px',
            background: selectedView === 'capacity' ? '#1F77B4' : 'white',
            color: selectedView === 'capacity' ? 'white' : '#666',
            border: `2px solid ${selectedView === 'capacity' ? '#1F77B4' : '#e0e0e0'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          🏭 Capacity View
        </button>
        <button
          onClick={() => setSelectedView('comparison')}
          style={{
            padding: '10px 16px',
            background: selectedView === 'comparison' ? '#1F77B4' : 'white',
            color: selectedView === 'comparison' ? 'white' : '#666',
            border: `2px solid ${selectedView === 'comparison' ? '#1F77B4' : '#e0e0e0'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          📊 Comparison
        </button>
        <button
          onClick={() => setSelectedView('radar')}
          style={{
            padding: '10px 16px',
            background: selectedView === 'radar' ? '#1F77B4' : 'white',
            color: selectedView === 'radar' ? 'white' : '#666',
            border: `2px solid ${selectedView === 'radar' ? '#1F77B4' : '#e0e0e0'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          🎯 Performance
        </button>
      </div>

      {/* Metrics Cards View */}
      {selectedView === 'metrics' && (
      <div>
      {/* SKU Metrics Cards */}
      <div className="metrics-grid">
        {skuMetrics.map(sku => (
          <div key={sku.id} className="metric-card">
            <div className="sku-header">
              <div className="sku-indicator" style={{ backgroundColor: sku.color }}></div>
              <div className="sku-title">{sku.name}</div>
            </div>
            <div className="metrics-mini">
              <div className="metric-row">
                <span>Annual Volume:</span>
                <span className="value">{(sku.annualVolume / 1000).toFixed(1)}K L</span>
              </div>
              <div className="metric-row">
                <span>Avg Monthly:</span>
                <span className="value">{sku.avgMonthly.toLocaleString()} L</span>
              </div>
              <div className="metric-row">
                <span>Peak Month:</span>
                <span className="value">{sku.peakMonth.toLocaleString()} L</span>
              </div>
              <div className="metric-row">
                <span>Utilization:</span>
                <span className={`value utilization-${sku.riskLevel}`}>{sku.utilization}%</span>
              </div>
              <div className="metric-row">
                <span>Growth (12M):</span>
                <span className={`value ${sku.growth >= 0 ? 'positive' : 'negative'}`}>
                  {sku.growth >= 0 ? '+' : ''}{sku.growth}%
                </span>
              </div>
            </div>
            <div className={`risk-badge risk-${sku.riskLevel}`}>
              {sku.riskLevel === 'high' ? '⚠️ High Demand' :
               sku.riskLevel === 'medium' ? '⚡ Medium Demand' :
               '✅ Healthy'}
            </div>
          </div>
        ))}
      </div>
      </div>
      )}

      {/* Tabular View */}
      {selectedView === 'table' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>Detailed SKU Data by City & Channel</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead style={{ background: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Month</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>City</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Channel</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>SKU</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700' }}>Demand (L)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 150).map((row, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.fullMonth}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.city}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.channel}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.sku}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '600' }}>{row.demand.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>
            Showing {Math.min(150, filteredData.length)} of {filteredData.length} records
          </div>
        </div>
      )}

      {/* Timeline Chart - All SKUs */}
      {selectedView === 'timeline' && (
        <div className="chart-section">
          <h2>12-Month Demand Timeline by SKU</h2>
          <p className="chart-description">
            Compare demand trends for all 4 ice cream flavors across the full year
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
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

              {skus.map(sku => (
                <Line
                  key={sku.id}
                  type="monotone"
                  dataKey={sku.id.toLowerCase()}
                  stroke={sku.color}
                  strokeWidth={2.5}
                  dot={{ fill: sku.color, r: 4 }}
                  name={sku.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Capacity vs Demand Chart - already has conditional */}
      {selectedView === 'capacity' && (
        <div className="chart-section">
          <h2>Production Capacity vs Forecasted Demand</h2>
          <p className="chart-description">
            Green zone = Safe | Orange zone = Near capacity | Red zone = Exceeds capacity
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={skuMetrics}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis label={{ value: 'Capacity (L/month)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="capacity"
                fill="#4CAF50"
                name="Monthly Capacity"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="annualVolume"
                fill="#FF7F0E"
                name="Annual Demand ÷ 12"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Risk Zones Legend */}
          <div className="risk-zones">
            <div className="zone safe">
              <span className="zone-color"></span>
              <span>Safe Zone: &lt;70% utilization</span>
            </div>
            <div className="zone warning">
              <span className="zone-color"></span>
              <span>Warning Zone: 70-90% utilization</span>
            </div>
            <div className="zone critical">
              <span className="zone-color"></span>
              <span>Critical Zone: &gt;90% utilization</span>
            </div>
          </div>
        </div>
      )}

      {/* Volume Comparison Table */}
      {selectedView === 'comparison' && (
        <div className="chart-section">
          <h2>Monthly Demand Comparison - All SKUs</h2>
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Month</th>
                  {skus.map(sku => (
                    <th key={sku.id} style={{ color: sku.color }}>
                      {sku.name}
                    </th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {timelineData.map((row, idx) => (
                  <tr key={idx} className={idx < 6 ? 'historical' : 'forecast'}>
                    <td className="month-label">{row.fullMonth}</td>
                    {skus.map(sku => (
                      <td key={sku.id} className="demand-cell">
                        {row[sku.id.toLowerCase()].toLocaleString()}
                      </td>
                    ))}
                    <td className="total-cell">
                      {(row.vanilla + row.caramel + row.mint + row.chocolate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Performance Radar Chart */}
      {selectedView === 'radar' && (
        <div className="chart-section">
          <h2>SKU Performance Profile</h2>
          <p className="chart-description">
            Multi-dimensional comparison: Volume | Utilization | Growth | Demand Variance
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar
                name="Vanilla"
                dataKey="volume"
                stroke="#1F77B4"
                fill="#1F77B4"
                fillOpacity={0.25}
              />
              <Radar
                name="Caramel"
                dataKey="utilization"
                stroke="#D62728"
                fill="#D62728"
                fillOpacity={0.25}
              />
              <Radar
                name="Mint"
                dataKey="growth"
                stroke="#2CA02C"
                fill="#2CA02C"
                fillOpacity={0.25}
              />
              <Radar
                name="Chocolate"
                dataKey="variance"
                stroke="#9467BD"
                fill="#9467BD"
                fillOpacity={0.25}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Table */}
      <div className="chart-section">
        <h2>SKU Summary & Recommendations</h2>
        <div className="summary-table-wrapper">
          <table className="summary-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Annual Volume</th>
                <th>Avg Monthly</th>
                <th>Peak Month</th>
                <th>Min Month</th>
                <th>Utilization</th>
                <th>12M Growth</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {skuMetrics.map(sku => (
                <tr key={sku.id} className={`risk-${sku.riskLevel}`}>
                  <td className="sku-name">
                    <span className="sku-color" style={{ backgroundColor: sku.color }}></span>
                    {sku.name}
                  </td>
                  <td>{(sku.annualVolume / 1000).toFixed(1)}K L</td>
                  <td>{sku.avgMonthly.toLocaleString()} L</td>
                  <td>{sku.peakMonth.toLocaleString()} L</td>
                  <td>{sku.minMonth.toLocaleString()} L</td>
                  <td>
                    <div className="utilization-bar">
                      <div
                        className="utilization-fill"
                        style={{
                          width: `${sku.utilization}%`,
                          backgroundColor:
                            sku.utilization > 90
                              ? '#D32F2F'
                              : sku.utilization > 70
                              ? '#FF7F0E'
                              : '#4CAF50',
                        }}
                      ></div>
                      <span className="utilization-text">{sku.utilization}%</span>
                    </div>
                  </td>
                  <td className={sku.growth >= 0 ? 'positive' : 'negative'}>
                    {sku.growth >= 0 ? '+' : ''}{sku.growth}%
                  </td>
                  <td className="recommendation">
                    {sku.riskLevel === 'high'
                      ? '⚠️ Increase production lines'
                      : sku.riskLevel === 'medium'
                      ? '⚡ Monitor closely'
                      : '✅ On track'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="insights-section">
        <h2>📌 Strategic Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>🥄 Vanilla Dominance</h3>
            <p>
              Vanilla accounts for ~55% of total demand with peak in June-August.
              Ensure adequate capacity allocation and distributor focus.
            </p>
          </div>
          <div className="insight-card">
            <h3>📊 Demand Seasonality</h3>
            <p>
              All SKUs follow similar seasonal pattern (peak Jun-Aug, low Oct-Dec).
              Plan inventory and production accordingly with 6-month lead time.
            </p>
          </div>
          <div className="insight-card">
            <h3>⚡ Capacity Planning</h3>
            <p>
              Vanilla near 80% utilization during peak months. Consider additional
              production lines for Phase 2 to support growth projections.
            </p>
          </div>
          <div className="insight-card">
            <h3>💡 Growth Opportunity</h3>
            <p>
              Chocolate and Mint show growth potential. Allocate marketing resources
              and distributor partnerships to capture seasonal demand shifts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SKUComparison;
