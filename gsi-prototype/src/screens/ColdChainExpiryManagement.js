import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import FilterPanel from '../components/FilterPanel';
import '../styles/ColdChainExpiryManagement.css';

const ColdChainExpiryManagement = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);

  const [filters, setFilters] = useState({ cities, channels: [], skus });
  const [showCharts, setShowCharts] = useState(false);
  const [sortBy, setSortBy] = useState('expiry');

  const generateBatchInventory = () => {
    const shelfLife = { 'Vanilla': 730, 'Caramel': 600, 'Mint': 540, 'Chocolate': 600 };
    const batches = [];
    const today = new Date('2026-04-23');

    cities.forEach(city => {
      skus.forEach(sku => {
        const numBatches = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < numBatches; i++) {
          const daysOld = Math.floor(Math.random() * 180) + 10;
          const productionDate = new Date(today);
          productionDate.setDate(productionDate.getDate() - daysOld);

          const expiryDate = new Date(productionDate);
          expiryDate.setDate(expiryDate.getDate() + shelfLife[sku]);

          const daysToExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
          const quantity = Math.floor(Math.random() * 100) + 20;
          const tempAbuseHours = Math.floor(Math.random() * 8);

          let fifoStatus = 'OK';
          let riskScore = 1;

          if (daysToExpiry < 0) {
            fifoStatus = 'EXPIRED';
            riskScore = 5;
          } else if (daysToExpiry < 30) {
            fifoStatus = 'CRITICAL';
            riskScore = 5;
          } else if (daysToExpiry < 60) {
            fifoStatus = 'AT_RISK';
            riskScore = 4;
          } else {
            riskScore = 2 + Math.ceil(tempAbuseHours / 3);
          }

          const storageTemp = -18 + (Math.random() * 2 - 1);

          batches.push({
            batchId: `BATCH-${sku.slice(0, 3)}-${city.slice(0, 3)}-${String(i + 1).padStart(3, '0')}`,
            sku, city, quantity,
            productionDate: productionDate.toISOString().split('T')[0],
            expiryDate: expiryDate.toISOString().split('T')[0],
            daysToExpiry,
            storageTemp: parseFloat(storageTemp.toFixed(1)),
            tempAbuseHours,
            fifoStatus,
            riskScore,
            storageCostPerMonth: Math.round(quantity * 60),
          });
        }
      });
    });

    return batches;
  };

  const rawBatches = generateBatchInventory();

  const filteredBatches = useMemo(() => {
    let filtered = rawBatches.filter(b => filters.cities.includes(b.city) && filters.skus.includes(b.sku));

    if (sortBy === 'expiry') {
      filtered.sort((a, b) => a.daysToExpiry - b.daysToExpiry);
    } else if (sortBy === 'risk') {
      filtered.sort((a, b) => b.riskScore - a.riskScore);
    } else if (sortBy === 'qty') {
      filtered.sort((a, b) => b.quantity - a.quantity);
    }

    return filtered;
  }, [rawBatches, filters, sortBy]);

  const summary = useMemo(() => {
    const total = filteredBatches.length;
    const expired = filteredBatches.filter(b => b.daysToExpiry < 0).length;
    const critical = filteredBatches.filter(b => b.daysToExpiry >= 0 && b.daysToExpiry < 30).length;
    const atRisk = filteredBatches.filter(b => b.daysToExpiry >= 30 && b.daysToExpiry < 60).length;
    const safe = filteredBatches.filter(b => b.daysToExpiry >= 60).length;
    const totalQty = filteredBatches.reduce((sum, b) => sum + b.quantity, 0);
    const monthlyStorageCost = filteredBatches.reduce((sum, b) => sum + b.storageCostPerMonth, 0);
    const avgTemp = filteredBatches.length > 0 ? (filteredBatches.reduce((sum, b) => sum + b.storageTemp, 0) / filteredBatches.length).toFixed(1) : 0;

    return { total, expired, critical, atRisk, safe, totalQty, monthlyStorageCost, avgTemp };
  }, [filteredBatches]);

  const tempTimeline = useMemo(() => {
    const hours = [];
    for (let h = 0; h < 24; h++) {
      const variance = Math.sin(h / 4) * 1.5;
      hours.push({
        hour: `${String(h).padStart(2, '0')}:00`,
        temp: parseFloat((-18 + variance + (Math.random() * 0.5 - 0.25)).toFixed(1)),
      });
    }
    return hours;
  }, []);

  return (
    <div className="cold-chain-container">
      <header className="screen-header">
        <h1>❄️ Cold Chain & Expiry Management</h1>
        <p>Batch-level tracking, FIFO compliance, temperature monitoring, and cost optimization</p>
      </header>

      <FilterPanel cities={cities} skus={skus} defaultSelectedCities={cities} defaultSelectedSkus={skus} onFilterChange={setFilters} />

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Batches</div>
          <div className="metric-value">{summary.total}</div>
        </div>
        <div className={`metric-card ${summary.expired > 0 ? 'critical' : ''}`}>
          <div className="metric-label">Expired</div>
          <div className="metric-value">{summary.expired}</div>
        </div>
        <div className={`metric-card ${summary.critical > 0 ? 'critical' : ''}`}>
          <div className="metric-label">&lt;30d to Expiry</div>
          <div className="metric-value">{summary.critical}</div>
        </div>
        <div className={`metric-card ${summary.atRisk > 0 ? 'warning' : ''}`}>
          <div className="metric-label">30-60d to Expiry</div>
          <div className="metric-value">{summary.atRisk}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Safe (&gt;60d)</div>
          <div className="metric-value">{summary.safe}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Qty (L)</div>
          <div className="metric-value">{summary.totalQty.toLocaleString()}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Monthly Cost</div>
          <div className="metric-value">₹{(summary.monthlyStorageCost / 1000).toFixed(0)}K</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Temp</div>
          <div className="metric-value">{summary.avgTemp}°C</div>
        </div>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>📋 Batch Inventory (Cold Chain Decision Table)</h2>
          <p>Critical data for FIFO compliance and expiry management</p>
        </div>

        <div className="table-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="expiry">Days to Expiry (Urgent First)</option>
            <option value="risk">Risk Score (Highest First)</option>
            <option value="qty">Quantity (Largest First)</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>SKU</th>
                <th>City</th>
                <th className="number">Qty (L)</th>
                <th>Production</th>
                <th>Expiry Date</th>
                <th className="number">Days to Exp</th>
                <th className="number">Temp (°C)</th>
                <th className="number">Abuse Hrs</th>
                <th>Status</th>
                <th className="number">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.slice(0, 50).map((batch, idx) => (
                <tr key={idx} className={`status-${batch.fifoStatus.toLowerCase()}`}>
                  <td className="highlight">{batch.batchId}</td>
                  <td>{batch.sku}</td>
                  <td>{batch.city}</td>
                  <td className="number">{batch.quantity}</td>
                  <td>{batch.productionDate}</td>
                  <td className="highlight">{batch.expiryDate}</td>
                  <td className={`number ${batch.daysToExpiry < 30 ? 'urgent' : batch.daysToExpiry < 60 ? 'warning' : ''}`}>
                    {batch.daysToExpiry < 0 ? 'EXPIRED' : batch.daysToExpiry}
                  </td>
                  <td className={`number ${Math.abs(batch.storageTemp) > 17 ? 'temp-alert' : ''}`}>{batch.storageTemp}</td>
                  <td className="number">{batch.tempAbuseHours}</td>
                  <td><span className={`status-badge status-${batch.fifoStatus.toLowerCase()}`}>{batch.fifoStatus}</span></td>
                  <td className="number risk-score">{batch.riskScore}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          Showing {Math.min(50, filteredBatches.length)} of {filteredBatches.length} batches
        </div>
      </div>

      <div className="table-section">
        <div className="section-header">
          <h2>📊 Expiry Status Distribution</h2>
          <p>Summary by status category</p>
        </div>

        <div className="table-wrapper">
          <table className="data-table simple">
            <thead>
              <tr>
                <th>Status</th>
                <th className="number">Batches</th>
                <th className="number">Total Qty (L)</th>
                <th className="number">Avg Days to Exp</th>
                <th>Action Required</th>
              </tr>
            </thead>
            <tbody>
              <tr className="status-expired">
                <td className="highlight">EXPIRED</td>
                <td className="number">{summary.expired}</td>
                <td className="number">{filteredBatches.filter(b => b.daysToExpiry < 0).reduce((sum, b) => sum + b.quantity, 0)}</td>
                <td className="number">-</td>
                <td>🚨 Immediate removal required</td>
              </tr>
              <tr className="status-critical">
                <td className="highlight">CRITICAL (&lt;30d)</td>
                <td className="number">{summary.critical}</td>
                <td className="number">{filteredBatches.filter(b => b.daysToExpiry >= 0 && b.daysToExpiry < 30).reduce((sum, b) => sum + b.quantity, 0)}</td>
                <td className="number">{(filteredBatches.filter(b => b.daysToExpiry >= 0 && b.daysToExpiry < 30).reduce((sum, b) => sum + b.daysToExpiry, 0) / Math.max(summary.critical, 1)).toFixed(0)}</td>
                <td>⚠️ Allocate to high-volume channels</td>
              </tr>
              <tr className="status-at_risk">
                <td className="highlight">AT RISK (30-60d)</td>
                <td className="number">{summary.atRisk}</td>
                <td className="number">{filteredBatches.filter(b => b.daysToExpiry >= 30 && b.daysToExpiry < 60).reduce((sum, b) => sum + b.quantity, 0)}</td>
                <td className="number">{(filteredBatches.filter(b => b.daysToExpiry >= 30 && b.daysToExpiry < 60).reduce((sum, b) => sum + b.daysToExpiry, 0) / Math.max(summary.atRisk, 1)).toFixed(0)}</td>
                <td>→ Monitor and prepare for rotation</td>
              </tr>
              <tr className="status-ok">
                <td className="highlight">SAFE (&gt;60d)</td>
                <td className="number">{summary.safe}</td>
                <td className="number">{filteredBatches.filter(b => b.daysToExpiry >= 60).reduce((sum, b) => sum + b.quantity, 0)}</td>
                <td className="number">{(filteredBatches.filter(b => b.daysToExpiry >= 60).reduce((sum, b) => sum + b.daysToExpiry, 0) / Math.max(summary.safe, 1)).toFixed(0)}</td>
                <td>✓ Normal operations</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-toggle-section">
        <button className="toggle-charts-btn" onClick={() => setShowCharts(!showCharts)}>
          {showCharts ? '▼ Hide' : '▶ Show'} Temperature & Cost Charts
        </button>

        {showCharts && (
          <div className="charts-grid">
            <div className="chart-container">
              <h3>24-Hour Temperature History</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={tempTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="#1F77B4" name="Storage Temp" dot={false} />
                  <Line type="monotone" dataKey={() => -18} stroke="#51CF66" strokeDasharray="5 5" name="Target (-18°C)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3>Batches by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { status: 'Expired', count: summary.expired },
                  { status: 'Critical', count: summary.critical },
                  { status: 'At Risk', count: summary.atRisk },
                  { status: 'Safe', count: summary.safe },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1F77B4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="guidelines-section">
        <h2>📌 Cold Chain Decision Guidelines</h2>
        <div className="guidelines-grid">
          <div className="guideline-card critical">
            <h3>🚨 EXPIRED Batches</h3>
            <p>Remove immediately. High waste cost. Check storage procedures.</p>
          </div>
          <div className="guideline-card critical">
            <h3>⚠️ CRITICAL (&lt;30d)</h3>
            <p>Allocate to Parlor channel (high volume). Offer 10-15% discount if needed.</p>
          </div>
          <div className="guideline-card warning">
            <h3>→ AT RISK (30-60d)</h3>
            <p>Monitor daily. Prepare for FIFO rotation. Alert channel managers.</p>
          </div>
          <div className="guideline-card ok">
            <h3>✓ SAFE (&gt;60d)</h3>
            <p>Normal allocation. Rotate using FIFO (oldest first). Optimal situation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdChainExpiryManagement;
