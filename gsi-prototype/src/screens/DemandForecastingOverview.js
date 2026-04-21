import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DemandForecastingOverview = () => {
  const [period, setPeriod] = useState('3');
  const [channel, setChannel] = useState('all');

  const forecastData = [
    { month: 'Apr', Parlor: 2400, Retail: 1800, HoReCa: 950, Ecommerce: 320 },
    { month: 'May', Parlor: 2800, Retail: 2100, HoReCa: 1200, Ecommerce: 400 },
    { month: 'Jun', Parlor: 2600, Retail: 2000, HoReCa: 1100, Ecommerce: 380 },
    { month: 'Jul', Parlor: 2900, Retail: 2200, HoReCa: 1300, Ecommerce: 450 },
  ];

  const totalByMonth = [
    { month: 'Apr', forecast: 5470, confidence: '87%' },
    { month: 'May', forecast: 6500, confidence: '89%' },
    { month: 'Jun', forecast: 6280, confidence: '85%' },
    { month: 'Jul', forecast: 6850, confidence: '83%' },
  ];

  return (
    <div className="container">
      <h1>Demand Forecasting Overview</h1>

      <div className="controls">
        <div className="control-group">
          <label>Forecast Period:</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
          </select>
        </div>
        <div className="control-group">
          <label>Channel Filter:</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value="all">All Channels</option>
            <option value="parlor">Parlor</option>
            <option value="retail">Retail</option>
            <option value="horeca">HoReCa</option>
            <option value="ecom">E-commerce</option>
          </select>
        </div>
        <button className="btn-primary">Export</button>
      </div>

      <h2>Total Demand Forecast (L/day)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={totalByMonth}>
          <defs>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1F77B4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#1F77B4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#1F77B4"
            fillOpacity={1}
            fill="url(#colorForecast)"
            name="Forecast"
          />
        </AreaChart>
      </ResponsiveContainer>

      <h2>Demand by Channel</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={forecastData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Parlor" stackId="a" fill="#F4D03F" name="Parlor (50%)" />
          <Bar dataKey="Retail" stackId="a" fill="#B8860B" name="Retail (35%)" />
          <Bar dataKey="HoReCa" stackId="a" fill="#90EE90" name="HoReCa (10%)" />
          <Bar dataKey="Ecommerce" stackId="a" fill="#8B4513" name="E-commerce (5%)" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Forecast Summary</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Forecast (L/day)</th>
            <th>Confidence</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {totalByMonth.map((row, i) => (
            <tr key={i}>
              <td>{row.month}</td>
              <td>{row.forecast.toLocaleString()}</td>
              <td><span className="status-badge status-ok">{row.confidence}</span></td>
              <td>{i > 0 && (totalByMonth[i].forecast > totalByMonth[i - 1].forecast ? '↑' : '↓')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DemandForecastingOverview;
