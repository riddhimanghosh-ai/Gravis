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

const DemandForecast12MonthEnhanced = () => {
  // Cities for distribution
  const cities = ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'];
  const channels = ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'];
  const skus = ['Vanilla', 'Caramel', 'Mint', 'Chocolate'];

  // Generate city-wise 12-month data
  const generateMonthlyData = () => {
    const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026',
                    'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
    const baselineDemand = [4200, 5100, 6200, 5800, 4900, 5300, 5400, 7100, 8200, 8500, 8100, 6900];
    const cityWeights = { 'Bangalore': 0.40, 'Hyderabad': 0.30, 'Chennai': 0.20, 'Pune': 0.10 };
    const skuWeights = { 'Vanilla': 0.55, 'Caramel': 0.22, 'Mint': 0.18, 'Chocolate': 0.05 };

    const allData = [];

    months.forEach((month, idx) => {
      const isForecast = idx >= 6;
      const confidence = isForecast ? (idx >= 9 ? 0.25 : 0.15) : 0;
      const baseMonthDemand = baselineDemand[idx];

      cities.forEach(city => {
        channels.forEach(channel => {
          skus.forEach(sku => {
            const cityShare = cityWeights[city];
            const skuShare = skuWeights[sku];
            const channelShare = channel === 'Parlor' ? 0.50 : channel === 'Retail' ? 0.35 : channel === 'HoReCa' ? 0.10 : 0.05;

            const demand = Math.round(baseMonthDemand * cityShare * channelShare * skuShare);

            allData.push({
              month: month.split(' ')[0],
              fullMonth: month,
              city: city,
              channel: channel,
              sku: sku,
              demand: demand,
              forecast: isForecast ? Math.round(demand * (1 + (Math.random() * 0.2 - 0.1))) : null,
              upper: isForecast ? Math.round(demand * (1 + confidence)) : null,
              lower: isForecast ? Math.round(demand * (1 - confidence)) : null,
              type: isForecast ? 'Forecast' : 'Actual',
            });
          });
        });
      });
    });

    return allData;
  };

  const rawData = generateMonthlyData();

  // Filter state
  const [filters, setFilters] = useState({
    cities: cities,
    channels: channels,
    skus: skus,
  });

  const [selectedView, setSelectedView] = useState('table');

  // Filter data based on selections
  const filteredData = useMemo(() => {
    return rawData.filter(item =>
      filters.cities.includes(item.city) &&
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );
  }, [rawData, filters]);

  // Aggregate data for charts
  const chartData = useMemo(() => {
    const aggregated = {};
    filteredData.forEach(item => {
      if (!aggregated[item.month]) {
        aggregated[item.month] = {
          month: item.month,
          fullMonth: item.fullMonth,
          total: 0,
          parlor: 0,
          retail: 0,
          horeca: 0,
          ecommerce: 0,
        };
      }
      aggregated[item.month].total += item.demand || 0;
      if (item.channel === 'Parlor') aggregated[item.month].parlor += item.demand;
      if (item.channel === 'Retail') aggregated[item.month].retail += item.demand;
      if (item.channel === 'HoReCa') aggregated[item.month].horeca += item.demand;
      if (item.channel === 'E-Commerce') aggregated[item.month].ecommerce += item.demand;
    });
    return Object.values(aggregated).sort((a, b) => ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].indexOf(a.month) - ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].indexOf(b.month));
  }, [filteredData]);

  // Calculate metrics
  const calculateMetrics = () => {
    const historical = filteredData.filter(d => d.type === 'Actual');
    const forecast = filteredData.filter(d => d.type === 'Forecast');

    const avgHistorical = Math.round(
      historical.reduce((sum, d) => sum + d.demand, 0) / (historical.length || 1)
    );
    const avgForecast = Math.round(
      forecast.reduce((sum, d) => sum + (d.demand || 0), 0) / (forecast.length || 1)
    );
    const growth = Math.round(((avgForecast - avgHistorical) / avgHistorical) * 100);

    return { avgHistorical, avgForecast, growth };
  };

  const metrics = calculateMetrics();

  return (
    <div className="demand-12month-container">
      <header className="screen-header">
        <h1>📊 12-Month Demand Forecast (With Filtering)</h1>
        <p>City-wise, Channel-wise, and SKU-wise filtering with tabular and chart views</p>
      </header>

      {/* Filter Panel */}
      <FilterPanel
        cities={cities}
        channels={channels}
        skus={skus}
        onFilterChange={setFilters}
        defaultSelectedCities={cities}
        defaultSelectedChannels={channels}
        defaultSelectedSkus={skus}
      />

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
          📊 Tabular View
        </button>
        <button
          onClick={() => setSelectedView('chart')}
          style={{
            padding: '10px 16px',
            background: selectedView === 'chart' ? '#1F77B4' : 'white',
            color: selectedView === 'chart' ? 'white' : '#666',
            border: `2px solid ${selectedView === 'chart' ? '#1F77B4' : '#e0e0e0'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          📈 Chart View
        </button>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '8px' }}>Avg Historical</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1F77B4' }}>{metrics.avgHistorical} L</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '8px' }}>Avg Forecast</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF7F0E' }}>{metrics.avgForecast} L</div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '8px' }}>Growth</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: metrics.growth >= 0 ? '#4CAF50' : '#D32F2F' }}>
            {metrics.growth >= 0 ? '+' : ''}{metrics.growth}%
          </div>
        </div>
        <div style={{ background: 'white', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '8px' }}>Records</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#2CA02C' }}>{filteredData.length}</div>
        </div>
      </div>

      {/* Tabular View */}
      {selectedView === 'table' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>Detailed Demand Table</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead style={{ background: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Month</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>City</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Channel</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>SKU</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Demand (L)</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: '700' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 100).map((row, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.fullMonth}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.city}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.channel}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.sku}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '600', borderRight: '1px solid #e0e0e0' }}>{row.demand.toLocaleString()}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '700', background: row.type === 'Forecast' ? '#E3F2FD' : '#E8F5E9', color: row.type === 'Forecast' ? '#1565C0' : '#2E7D32' }}>
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>
            Showing {Math.min(100, filteredData.length)} of {filteredData.length} records
          </div>
        </div>
      )}

      {/* Chart View */}
      {selectedView === 'chart' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '700' }}>Demand Trend by Channel</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="parlor" stackId="1" stroke="#1F77B4" fill="#1F77B4" name="Parlor" fillOpacity={0.7} />
              <Area type="monotone" dataKey="retail" stackId="1" stroke="#2CA02C" fill="#2CA02C" name="Retail" fillOpacity={0.7} />
              <Area type="monotone" dataKey="horeca" stackId="1" stroke="#FF7F0E" fill="#FF7F0E" name="HoReCa" fillOpacity={0.7} />
              <Area type="monotone" dataKey="ecommerce" stackId="1" stroke="#D62728" fill="#D62728" name="E-Commerce" fillOpacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Info Message */}
      <div style={{ background: '#f0f7ff', padding: '12px', borderRadius: '6px', border: '1px solid #1F77B4', fontSize: '12px', color: '#666' }}>
        💡 <strong>Tip:</strong> Use the filter panel above to focus on specific cities, channels, or SKUs. Switch between table and chart views to analyze the data.
      </div>
    </div>
  );
};

export default DemandForecast12MonthEnhanced;
