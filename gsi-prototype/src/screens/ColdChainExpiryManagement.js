import React, { useState, useMemo } from 'react';
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
  ScatterChart,
  Scatter,
  Cell,
} from 'recharts';
import FilterPanel from '../components/FilterPanel';
import '../styles/ColdChainExpiryManagement.css';

const ColdChainExpiryManagement = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);

  const [filters, setFilters] = useState({
    cities: cities,
    channels: [],
    skus: skus,
  });

  const [selectedView, setSelectedView] = useState('expiry');

  // ===== DATA GENERATION =====

  // Generate batch inventory with expiry tracking
  const generateBatchInventory = () => {
    const shelfLife = { 'Vanilla': 730, 'Caramel': 600, 'Mint': 540, 'Chocolate': 600 }; // days
    const batches = [];
    const today = new Date('2026-04-23');

    cities.forEach(city => {
      skus.forEach(sku => {
        // Generate 3-5 batches per SKU per city
        const numBatches = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < numBatches; i++) {
          const daysOld = Math.floor(Math.random() * 180) + 10; // 10-190 days old
          const productionDate = new Date(today);
          productionDate.setDate(productionDate.getDate() - daysOld);

          const expiryDate = new Date(productionDate);
          expiryDate.setDate(expiryDate.getDate() + shelfLife[sku]);

          const daysToExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
          const quantity = Math.floor(Math.random() * 100) + 20;
          const tempAbuseHours = Math.floor(Math.random() * 8);

          let fifoStatus = 'OK';
          let riskScore = 1;

          if (daysToExpiry < 30) {
            fifoStatus = 'CRITICAL';
            riskScore = 5;
          } else if (daysToExpiry < 60) {
            fifoStatus = 'AT_RISK';
            riskScore = 4;
          } else if (daysToExpiry < 180) {
            riskScore = 2 + Math.ceil(tempAbuseHours / 3);
          }

          batches.push({
            batchId: `BATCH-${sku.slice(0, 3).toUpperCase()}-${i + 1}`,
            sku,
            city,
            quantity,
            productionDate: productionDate.toISOString().split('T')[0],
            expiryDate: expiryDate.toISOString().split('T')[0],
            daysToExpiry,
            storageTemp: -18 + (Math.random() * 2 - 1), // -18 to -17°C
            tempAbuseHours,
            fifoStatus,
            riskScore,
            storageCostPerMonth: Math.round(quantity * 60), // ₹60 per liter per month
          });
        }
      });
    });

    return batches;
  };

  // Generate temperature history
  const generateTemperatureHistory = () => {
    const hours = [];
    const today = new Date('2026-04-23');

    for (let h = 23; h >= 0; h--) {
      const time = new Date(today);
      time.setHours(time.getHours() - h);

      // Simulate temperature variation (-18 to -17 normally, occasional spikes)
      let temp = -18 + Math.random() * 1.5;
      if (Math.random() < 0.1) {
        temp = -15 + Math.random() * 3; // 10% chance of spike
      }

      hours.push({
        time: time.getHours() + ':00',
        temperature: Math.round(temp * 10) / 10,
        target: -18,
      });
    }

    return hours.reverse();
  };

  // Generate cold chain costs
  const generateColdChainCosts = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => ({
      month,
      storageHours: 75 + Math.random() * 30,
      transportCost: 45 + Math.random() * 20,
      spoilageRate: 2.5 + Math.random() * 1.5,
      spoilageCost: 20 + Math.random() * 15,
      total: 140 + Math.random() * 40,
    }));
  };

  const batchInventory = useMemo(() => {
    const rawData = generateBatchInventory();
    return rawData.filter(item =>
      filters.skus.includes(item.sku) &&
      filters.cities.includes(item.city)
    );
  }, [filters]);

  const temperatureHistory = useMemo(() => generateTemperatureHistory(), []);
  const coldChainCosts = useMemo(() => generateColdChainCosts(), []);

  // ===== CALCULATIONS =====

  const calculateMetrics = () => {
    const safe = batchInventory.filter(b => b.daysToExpiry > 180).length;
    const atRisk = batchInventory.filter(b => b.daysToExpiry >= 30 && b.daysToExpiry <= 180).length;
    const critical = batchInventory.filter(b => b.daysToExpiry < 30).length;
    const totalQuantity = batchInventory.reduce((sum, b) => sum + b.quantity, 0);
    const monthlyStorageCost = batchInventory.reduce((sum, b) => sum + b.storageCostPerMonth, 0);
    const avgTempAbuse = Math.round(
      batchInventory.reduce((sum, b) => sum + b.tempAbuseHours, 0) / (batchInventory.length || 1)
    );

    return {
      totalBatches: batchInventory.length,
      safe,
      atRisk,
      critical,
      totalQuantity,
      monthlyStorageCost,
      avgTempAbuse,
    };
  };

  const metrics = calculateMetrics();

  // ===== RENDER =====

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>❄️ Cold Chain & Expiry Management</h1>
        <p>Track batch expiry, manage FIFO rotation, monitor cold chain costs, reduce spoilage</p>
      </header>

      {/* Filter Panel - Cities & SKUs only */}
      <div style={{ background: 'white', padding: '15px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontWeight: '600', fontSize: '12px', color: '#999', marginBottom: '8px', display: 'block' }}>Cities</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    const newCities = filters.cities.includes(city)
                      ? filters.cities.filter(c => c !== city)
                      : [...filters.cities, city];
                    setFilters({ ...filters, cities: newCities });
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: `2px solid ${filters.cities.includes(city) ? '#1F77B4' : '#e0e0e0'}`,
                    background: filters.cities.includes(city) ? '#1F77B4' : 'white',
                    color: filters.cities.includes(city) ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: '600', fontSize: '12px', color: '#999', marginBottom: '8px', display: 'block' }}>SKUs</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {skus.map(sku => (
                <button
                  key={sku}
                  onClick={() => {
                    const newSkus = filters.skus.includes(sku)
                      ? filters.skus.filter(s => s !== sku)
                      : [...filters.skus, sku];
                    setFilters({ ...filters, skus: newSkus });
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: `2px solid ${filters.skus.includes(sku) ? '#1F77B4' : '#e0e0e0'}`,
                    background: filters.skus.includes(sku) ? '#1F77B4' : 'white',
                    color: filters.skus.includes(sku) ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  {sku}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#999', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Total Batches</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F77B4' }}>{metrics.totalBatches}</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>{metrics.totalQuantity.toLocaleString()} L inventory</div>
        </div>

        <div style={{ background: '#E8F5E9', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#2E7D32', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Safe (&gt;60d)</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#4CAF50' }}>{metrics.safe}</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Ready for distribution</div>
        </div>

        <div style={{ background: '#FFF3E0', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#E65100', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>At Risk (30-60d)</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#FF9800' }}>{metrics.atRisk}</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Needs FIFO pickup</div>
        </div>

        <div style={{ background: '#FFEBEE', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#C62828', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Critical (&lt;30d)</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#D32F2F' }}>{metrics.critical}</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Urgent action required!</div>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#999', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Monthly Storage</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#FF7F0E' }}>₹{(metrics.monthlyStorageCost / 100000).toFixed(1)}L</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Cost of cold storage</div>
        </div>

        <div style={{ background: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '11px', color: '#999', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase' }}>Avg Temp Abuse</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#2CA02C' }}>{metrics.avgTempAbuse}h</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Hours above -15°C</div>
        </div>
      </div>

      {/* View Selection */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'expiry', label: '📦 Expiry Status', icon: '📦' },
          { key: 'batches', label: '📋 Batch Inventory', icon: '📋' },
          { key: 'temperature', label: '🌡️ Temperature Monitor', icon: '🌡️' },
          { key: 'costs', label: '💰 Cold Chain Costs', icon: '💰' },
        ].map(view => (
          <button
            key={view.key}
            onClick={() => setSelectedView(view.key)}
            style={{
              padding: '10px 16px',
              background: selectedView === view.key ? '#1F77B4' : 'white',
              color: selectedView === view.key ? 'white' : '#666',
              border: `2px solid ${selectedView === view.key ? '#1F77B4' : '#e0e0e0'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* View 1: Expiry Status */}
      {selectedView === 'expiry' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>📦 Batch Expiry Status</h2>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#999', marginBottom: '10px' }}>Days to Expiry Distribution</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={batchInventory.map((b, idx) => ({ name: `B${idx}`, days: b.daysToExpiry, risk: b.riskScore }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" hide />
                    <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="days" fill="#1F77B4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#999', marginBottom: '10px' }}>Expiry Status Summary</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Safe (&gt;60d)</span>
                      <span style={{ fontWeight: '600', color: '#4CAF50' }}>{metrics.safe} batches</span>
                    </div>
                    <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '8px', width: '100%', overflow: 'hidden' }}>
                      <div style={{ background: '#4CAF50', height: '100%', width: `${(metrics.safe / metrics.totalBatches) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>At Risk (30-60d)</span>
                      <span style={{ fontWeight: '600', color: '#FF9800' }}>{metrics.atRisk} batches</span>
                    </div>
                    <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '8px', width: '100%', overflow: 'hidden' }}>
                      <div style={{ background: '#FF9800', height: '100%', width: `${(metrics.atRisk / metrics.totalBatches) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '12px', color: '#666' }}>Critical (&lt;30d)</span>
                      <span style={{ fontWeight: '600', color: '#D32F2F' }}>{metrics.critical} batches</span>
                    </div>
                    <div style={{ background: '#e0e0e0', borderRadius: '4px', height: '8px', width: '100%', overflow: 'hidden' }}>
                      <div style={{ background: '#D32F2F', height: '100%', width: `${(metrics.critical / metrics.totalBatches) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '15px', background: '#FFF3E0', borderRadius: '6px', borderLeft: '4px solid #FF9800' }}>
            <strong>⚠️ Actions Required:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <li>Critical batches: Pick IMMEDIATELY or write off</li>
              <li>At-risk batches: Allocate to high-volume channels for faster turnover</li>
              <li>Safe batches: Standard FIFO rotation, no urgency</li>
            </ul>
          </div>
        </div>
      )}

      {/* View 2: Batch Inventory Table */}
      {selectedView === 'batches' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', overflowX: 'auto' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>📋 Batch Inventory Details</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead style={{ background: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Batch ID</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>SKU</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>City</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Qty (L)</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Production</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Expiry</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Days Left</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Temp (°C)</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Abuse (h)</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: '700' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {batchInventory.map((row, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0', fontWeight: '600' }}>{row.batchId}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.sku}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.city}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '600', borderRight: '1px solid #e0e0e0' }}>{row.quantity}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0', fontSize: '10px' }}>{row.productionDate}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0', fontSize: '10px', fontWeight: '600' }}>{row.expiryDate}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '600', borderRight: '1px solid #e0e0e0', color: row.daysToExpiry < 60 ? '#D32F2F' : '#666' }}>
                    {row.daysToExpiry}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e0e0e0' }}>{row.storageTemp.toFixed(1)}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', borderRight: '1px solid #e0e0e0', color: row.tempAbuseHours > 4 ? '#D32F2F' : '#666' }}>
                    {row.tempAbuseHours}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background:
                        row.riskScore === 5 ? '#FFEBEE' :
                        row.riskScore === 4 ? '#FFF3E0' :
                        row.riskScore >= 3 ? '#E8F5E9' :
                        '#E0F2F1',
                      color:
                        row.riskScore === 5 ? '#D32F2F' :
                        row.riskScore === 4 ? '#FF9800' :
                        row.riskScore >= 3 ? '#4CAF50' :
                        '#009688',
                    }}>
                      {row.fifoStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#999' }}>
            Showing {Math.min(batchInventory.length)} of {batchInventory.length} batches
          </div>
        </div>
      )}

      {/* View 3: Temperature Monitoring */}
      {selectedView === 'temperature' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>🌡️ Cold Store Temperature (24h History)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={temperatureHistory} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} domain={[-20, -15]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#1F77B4" strokeWidth={2} name="Current Temp" />
              <Line type="monotone" dataKey="target" stroke="#4CAF50" strokeWidth={2} strokeDasharray="5 5" name="Target (-18°C)" />
            </LineChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ background: '#E8F5E9', padding: '15px', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: '#2E7D32', fontWeight: '700', marginBottom: '8px' }}>Current Temperature</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>-17.8°C</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>✓ Within target range</div>
            </div>
            <div style={{ background: '#FFF3E0', padding: '15px', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', color: '#E65100', fontWeight: '700', marginBottom: '8px' }}>Temperature Excursions (24h)</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF9800' }}>1</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>⚠️ Brief spike detected</div>
            </div>
            <div style={{ background: 'white', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '12px', color: '#999', fontWeight: '700', marginBottom: '8px' }}>Time Out of Range</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#666' }}>12 min</div>
              <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Door opening during loading</div>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: '#E0F2F1', borderRadius: '6px', borderLeft: '4px solid #009688' }}>
            <strong style={{ color: '#00695C' }}>✓ Cold Chain Status: HEALTHY</strong>
            <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#00695C' }}>
              Temperature stable at -17.8°C. One minor excursion during dock loading (12 min). No risk to product quality. Continue monitoring.
            </p>
          </div>
        </div>
      )}

      {/* View 4: Cold Chain Costs */}
      {selectedView === 'costs' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>💰 Cold Chain Costs (6-Month Trend)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={coldChainCosts} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" label={{ value: 'Cost (₹K)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Spoilage %', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="storageHours" fill="#1F77B4" name="Storage (₹K)" />
              <Bar yAxisId="left" dataKey="transportCost" fill="#2CA02C" name="Transport (₹K)" />
              <Bar yAxisId="left" dataKey="spoilageCost" fill="#D62728" name="Spoilage (₹K)" />
            </BarChart>
          </ResponsiveContainer>

          <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '700' }}>Cost Breakdown (April)</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Storage Cost (₹60/L/month)</span>
                  <span style={{ fontWeight: '700', color: '#1F77B4' }}>₹75K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Transport Cost</span>
                  <span style={{ fontWeight: '700', color: '#2CA02C' }}>₹45K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Spoilage Cost (1.4%)</span>
                  <span style={{ fontWeight: '700', color: '#D62728' }}>₹18K</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#E8F5E9', borderRadius: '4px', fontWeight: '700', borderTop: '2px solid #e0e0e0', marginTop: '5px' }}>
                  <span style={{ color: '#2E7D32' }}>Total Monthly Cost</span>
                  <span style={{ color: '#4CAF50' }}>₹138K</span>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '700' }}>Optimization Opportunities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#FFF3E0', borderRadius: '4px', borderLeft: '4px solid #FF9800' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#E65100', marginBottom: '4px' }}>⚠️ Reduce Storage Overstock</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Current: 1,250 L | Target: 1,000 L | Savings: -₹15K/month</div>
                </div>
                <div style={{ padding: '12px', background: '#FFF3E0', borderRadius: '4px', borderLeft: '4px solid #FF9800' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#E65100', marginBottom: '4px' }}>⚠️ Improve FIFO Discipline</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Current spoilage: 1.4% | Target: 0.8% | Savings: -₹9K/month</div>
                </div>
                <div style={{ padding: '12px', background: '#FFF3E0', borderRadius: '4px', borderLeft: '4px solid #FF9800' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#E65100', marginBottom: '4px' }}>⚠️ Consolidate Transport Shipments</div>
                  <div style={{ fontSize: '11px', color: '#666' }}>Better route planning | Savings: -₹5K/month</div>
                </div>
              </div>
              <div style={{ marginTop: '15px', padding: '12px', background: '#E8F5E9', borderRadius: '4px', borderTop: '2px solid #4CAF50' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#2E7D32' }}>Total Opportunity</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#4CAF50', marginTop: '5px' }}>-₹29K/month</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>21% cost reduction possible</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColdChainExpiryManagement;
