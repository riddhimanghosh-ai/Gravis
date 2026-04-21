import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SKUDetailForecast = () => {
  const [selectedSKU, setSelectedSKU] = useState('VANILLA_1L');

  const skus = ['VANILLA_1L', 'CARAMEL_1L', 'MINT_1L', 'CHOCOLATE_1L'];

  const skuDetails = {
    VANILLA_1L: {
      name: 'Vanilla Ice Cream',
      capacity: '10L/day',
      stock: '45L',
      safetyStock: '30L',
      forecast: [
        { date: 'Apr 21', parlor: 1200, retail: 800, horeca: 300, ecom: 100 },
        { date: 'Apr 22', parlor: 1250, retail: 820, horeca: 320, ecom: 110 },
        { date: 'Apr 23', parlor: 1300, retail: 850, horeca: 350, ecom: 120 },
        { date: 'Apr 24', parlor: 1400, retail: 900, horeca: 400, ecom: 150 },
        { date: 'Apr 25', parlor: 1500, retail: 950, horeca: 450, ecom: 160 },
      ],
      channels: [
        { name: 'Parlor', forecast: 6500, confidence: '89%', prev: 6400 },
        { name: 'Retail', forecast: 4200, confidence: '84%', prev: 4100 },
        { name: 'HoReCa', forecast: 1800, confidence: '78%', prev: 1750 },
        { name: 'E-commerce', forecast: 600, confidence: '81%', prev: 580 },
      ]
    }
  };

  const details = skuDetails[selectedSKU];

  return (
    <div className="container">
      <h1>SKU Demand Detail</h1>

      <div className="controls">
        <div className="control-group">
          <label>Select SKU:</label>
          <select value={selectedSKU} onChange={(e) => setSelectedSKU(e.target.value)}>
            {skus.map(sku => <option key={sku} value={sku}>{sku}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div className="metric-card">
          <div className="metric-label">Max Capacity</div>
          <div className="metric-value" style={{ fontSize: '24px' }}>{details.capacity}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Current Stock</div>
          <div className="metric-value" style={{ fontSize: '24px' }}>{details.stock}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Safety Stock</div>
          <div className="metric-value" style={{ fontSize: '24px' }}>{details.safetyStock}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Status</div>
          <div className="metric-status success">✓ OK</div>
        </div>
      </div>

      <h2>Forecast by Channel</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={details.forecast}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="parlor" stroke="#F4D03F" name="Parlor" strokeWidth={2} />
          <Line type="monotone" dataKey="retail" stroke="#B8860B" name="Retail" strokeWidth={2} />
          <Line type="monotone" dataKey="horeca" stroke="#90EE90" name="HoReCa" strokeWidth={2} />
          <Line type="monotone" dataKey="ecom" stroke="#8B4513" name="E-commerce" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <h2>Channel Breakdown (Next 30 days)</h2>
      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Forecast</th>
            <th>Confidence</th>
            <th>Prev. Actual</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {details.channels.map((ch, i) => (
            <tr key={i}>
              <td>{ch.name}</td>
              <td>{ch.forecast}</td>
              <td><span className="status-badge status-ok">{ch.confidence}</span></td>
              <td>{ch.prev}</td>
              <td><button className="btn-primary btn-small">Adjust</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn-primary">Save Changes</button>
        <button className="btn-secondary">Discard</button>
      </div>
    </div>
  );
};

export default SKUDetailForecast;
