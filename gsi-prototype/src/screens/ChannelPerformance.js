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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import FilterPanel from '../components/FilterPanel';
import '../styles/ChannelPerformance.css';

const ChannelPerformance = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);

  const [activeTab, setActiveTab] = useState('parlor');
  const [filters, setFilters] = useState({
    cities: cities,
    channels: ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'],
    skus: skus,
  });

  const channels = [
    {
      id: 'parlor',
      name: 'Parlor',
      icon: '🍦',
      color: '#1F77B4',
      description: 'Direct ice cream parlors & branded outlets',
      share: 50,
      primaryMetrics: {
        monthlyAvg: 2700,
        growth: 8,
        outlets: 245,
        avgOrderValue: 15000,
      },
    },
    {
      id: 'retail',
      name: 'Retail',
      icon: '🏪',
      color: '#2CA02C',
      description: 'Modern trade & general trade outlets',
      share: 35,
      primaryMetrics: {
        monthlyAvg: 1890,
        growth: 5,
        outlets: 580,
        avgOrderValue: 8500,
      },
    },
    {
      id: 'horeca',
      name: 'HoReCa',
      icon: '🏨',
      color: '#FF7F0E',
      description: 'Hotels, restaurants, catering services',
      share: 10,
      primaryMetrics: {
        monthlyAvg: 540,
        growth: 12,
        outlets: 120,
        avgOrderValue: 22000,
      },
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce',
      icon: '🛒',
      color: '#D62728',
      description: 'Online platforms (Swiggy, Blinkit, Zomato)',
      share: 5,
      primaryMetrics: {
        monthlyAvg: 270,
        growth: 35,
        outlets: 3,
        avgOrderValue: 12000,
      },
    },
  ];

  const generateChannelData = (channelId, multiplier = 1) => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const baseData = [2100, 2550, 3100, 2900, 2450, 2650, 2700, 3550, 4100, 4250, 4050, 3450];

    const shareMap = {
      parlor: 0.50,
      retail: 0.35,
      horeca: 0.10,
      ecommerce: 0.05,
    };

    return months.map((month, idx) => ({
      month,
      fullMonth: month + ' 2026',
      demand: Math.round(baseData[idx] * shareMap[channelId] * multiplier),
      forecast: idx >= 6 ? Math.round(baseData[idx] * shareMap[channelId] * multiplier * 1.1) : null,
      target: Math.round(baseData[idx] * shareMap[channelId] * multiplier * 0.95),
    }));
  };

  const getChannelData = (channelId) => generateChannelData(channelId);
  const getMonthlyBreakdown = (channelId) => {
    const months = ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026',
                     'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
    const baseData = [2100, 2550, 3100, 2900, 2450, 2650, 2700, 3550, 4100, 4250, 4050, 3450];
    const shareMap = {
      parlor: 0.50,
      retail: 0.35,
      horeca: 0.10,
      ecommerce: 0.05,
    };

    return months.map((month, idx) => ({
      month,
      value: Math.round(baseData[idx] * shareMap[channelId]),
    }));
  };

  const renderChannelTab = (channel) => {
    const channelData = getChannelData(channel.id);
    const breakdown = getMonthlyBreakdown(channel.id);

    const metrics = breakdown.reduce((acc, d) => {
      acc.total += d.value;
      acc.max = Math.max(acc.max, d.value);
      acc.min = Math.min(acc.min, d.value);
      return acc;
    }, { total: 0, max: 0, min: 0 });

    const avgMonthly = Math.round(metrics.total / 12);

    return (
      <div key={channel.id} className="tab-content">
        {/* Channel Header */}
        <div className="channel-header">
          <div className="channel-title-group">
            <span className="channel-icon" style={{ color: channel.color }}>{channel.icon}</span>
            <div>
              <h2>{channel.name} Channel</h2>
              <p>{channel.description}</p>
            </div>
          </div>
          <div className="channel-badge" style={{ borderColor: channel.color }}>
            {channel.share}% of Total Demand
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-box">
            <div className="metric-label">Monthly Average</div>
            <div className="metric-large">{avgMonthly.toLocaleString()} L</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Growth Rate (12M)</div>
            <div className="metric-large positive">{channel.primaryMetrics.growth >= 0 ? '+' : ''}{channel.primaryMetrics.growth}%</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Active {channel.id === 'ecommerce' ? 'Platforms' : 'Outlets'}</div>
            <div className="metric-large">{channel.primaryMetrics.outlets}</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Avg Order Value</div>
            <div className="metric-large">₹{(channel.primaryMetrics.avgOrderValue / 1000).toFixed(0)}K</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Peak Month Demand</div>
            <div className="metric-large">{metrics.max.toLocaleString()} L</div>
          </div>
          <div className="metric-box">
            <div className="metric-label">Demand Variance</div>
            <div className="metric-large">{Math.round(((metrics.max - metrics.min) / avgMonthly) * 100)}%</div>
          </div>
        </div>

        {/* 12-Month Trend */}
        <div className="chart-section">
          <h3>12-Month Demand Trend with Forecast</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={channelData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="demand"
                stroke={channel.color}
                strokeWidth={2.5}
                dot={{ fill: channel.color, r: 4 }}
                name="Actual Demand"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#999"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#999', r: 3 }}
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="chart-section">
          <h3>Monthly Demand Breakdown</h3>
          <div className="breakdown-table-wrapper">
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Demand (L)</th>
                  <th>% of Channel</th>
                  <th>vs Average</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((row, idx) => {
                  const percentOfAvg = Math.round((row.value / avgMonthly) * 100);
                  return (
                    <tr key={idx} className={idx < 6 ? 'historical' : 'forecast'}>
                      <td>{row.month}</td>
                      <td className="demand-value">{row.value.toLocaleString()}</td>
                      <td>{((row.value / metrics.total) * 100).toFixed(1)}%</td>
                      <td className={percentOfAvg > 100 ? 'above-avg' : 'below-avg'}>
                        {percentOfAvg > 100 ? '+' : ''}{percentOfAvg - 100}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Channel-Specific Insights */}
        <div className="insights-section">
          <h3>📌 {channel.name} Channel Insights</h3>
          <div className="insights-grid">
            {channel.id === 'parlor' && (
              <>
                <div className="insight-box">
                  <h4>Flagship Channel</h4>
                  <p>50% market share. Focus on premium service and seasonal promotions during peak Jun-Aug.</p>
                </div>
                <div className="insight-box">
                  <h4>Outlet Expansion</h4>
                  <p>245 active outlets. Plan 30-40 new outlet launches in FY2027 for growth.</p>
                </div>
                <div className="insight-box">
                  <h4>Inventory Strategy</h4>
                  <p>Highest carrying cost. Implement daily delivery during peak season, weekly during lean.</p>
                </div>
              </>
            )}
            {channel.id === 'retail' && (
              <>
                <div className="insight-box">
                  <h4>High Volume Channel</h4>
                  <p>35% market share across 580 outlets. Distributed across modern trade and general trade.</p>
                </div>
                <div className="insight-box">
                  <h4>Price Sensitivity</h4>
                  <p>Retail channel more price-sensitive. Maintain competitive margins while managing costs.</p>
                </div>
                <div className="insight-box">
                  <h4>Distributor Management</h4>
                  <p>Work with 15 regional distributors. Implement vendor-managed inventory (VMI) systems.</p>
                </div>
              </>
            )}
            {channel.id === 'horeca' && (
              <>
                <div className="insight-box">
                  <h4>Premium Segment</h4>
                  <p>10% share but highest per-order value (₹22K). Focus on relationship & service quality.</p>
                </div>
                <div className="insight-box">
                  <h4>Growth Opportunity</h4>
                  <p>35% growth rate - fastest growing segment. Allocate dedicated account managers.</p>
                </div>
                <div className="insight-box">
                  <h4>Seasonal Pattern</h4>
                  <p>Strong summer peaks (Jun-Aug) due to tourism. Winter dips due to holiday closures.</p>
                </div>
              </>
            )}
            {channel.id === 'ecommerce' && (
              <>
                <div className="insight-box">
                  <h4>Explosive Growth</h4>
                  <p>35% YoY growth! Emerging segment. Partner with Swiggy, Blinkit, Zomato for rapid expansion.</p>
                </div>
                <div className="insight-box">
                  <h4>Peak Demand</h4>
                  <p>High summer demand (50%+ of annual). Focus inventory on May-Aug period.</p>
                </div>
                <div className="insight-box">
                  <h4>Cold Chain Critical</h4>
                  <p>Short shelf life drives operational complexity. Optimize last-mile logistics.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const activeChannel = channels.find(c => c.id === activeTab);

  return (
    <div className="channel-performance-container">
      <header className="screen-header">
        <h1>📊 Channel Performance Dashboard</h1>
        <p>Deep dive into each distribution channel with 12-month forecasts and KPIs</p>
      </header>

      {/* Filter Panel */}
      <FilterPanel
        cities={cities}
        channels={['Parlor', 'Retail', 'HoReCa', 'E-Commerce']}
        skus={skus}
        onFilterChange={setFilters}
        defaultSelectedCities={cities}
        defaultSelectedChannels={['Parlor', 'Retail', 'HoReCa', 'E-Commerce']}
        defaultSelectedSkus={skus}
      />

      {/* Channel Tabs */}
      <div className="channel-tabs">
        {channels.map(channel => (
          <button
            key={channel.id}
            className={`channel-tab ${activeTab === channel.id ? 'active' : ''}`}
            onClick={() => setActiveTab(channel.id)}
            style={activeTab === channel.id ? { borderBottomColor: channel.color } : {}}
          >
            <span className="tab-icon">{channel.icon}</span>
            <span className="tab-name">{channel.name}</span>
            <span className="tab-share">{channel.share}%</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper">
        {renderChannelTab(activeChannel)}
      </div>

      {/* Cross-Channel Comparison */}
      <div className="comparison-section">
        <h2>📊 Cross-Channel Comparison</h2>
        <div className="comparison-grid">
          <div className="comparison-chart">
            <h3>Channel Share of Total Demand</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={channels}
                  dataKey="share"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {channels.map(channel => (
                    <Cell key={`cell-${channel.id}`} fill={channel.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="comparison-table">
            <h3>Channel Metrics Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Share</th>
                  <th>Avg Monthly</th>
                  <th>Growth</th>
                  <th>Outlets</th>
                </tr>
              </thead>
              <tbody>
                {channels.map(channel => (
                  <tr key={channel.id}>
                    <td>
                      <span className="channel-label" style={{ borderLeft: `4px solid ${channel.color}` }}>
                        {channel.name}
                      </span>
                    </td>
                    <td>{channel.share}%</td>
                    <td>{channel.primaryMetrics.monthlyAvg.toLocaleString()} L</td>
                    <td className={channel.primaryMetrics.growth >= 0 ? 'positive' : 'negative'}>
                      {channel.primaryMetrics.growth >= 0 ? '+' : ''}{channel.primaryMetrics.growth}%
                    </td>
                    <td>{channel.primaryMetrics.outlets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="recommendations-section">
        <h2>🎯 Strategic Recommendations by Channel</h2>
        <div className="recommendations-grid">
          <div className="recommendation-card parlor">
            <h3>🍦 Parlor</h3>
            <ul>
              <li>Maintain premium positioning</li>
              <li>Expand outlet network by 20%</li>
              <li>Increase daily delivery during peak</li>
              <li>Launch seasonal flavors Jun-Aug</li>
            </ul>
          </div>
          <div className="recommendation-card retail">
            <h3>🏪 Retail</h3>
            <ul>
              <li>Expand modern trade (60% focus)</li>
              <li>Implement VMI with top 50 outlets</li>
              <li>Optimize distributor incentives</li>
              <li>Increase shelf space allocation</li>
            </ul>
          </div>
          <div className="recommendation-card horeca">
            <h3>🏨 HoReCa</h3>
            <ul>
              <li>Allocate dedicated account managers</li>
              <li>Custom packaging for premium clients</li>
              <li>Plan Q2-Q3 inventory spike (50%)</li>
              <li>Build long-term contracts</li>
            </ul>
          </div>
          <div className="recommendation-card ecommerce">
            <h3>🛒 E-Commerce</h3>
            <ul>
              <li>Aggressive platform expansion</li>
              <li>Optimize last-mile cold chain</li>
              <li>Plan 100% demand surge May-Aug</li>
              <li>Invest in operational excellence</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPerformance;
