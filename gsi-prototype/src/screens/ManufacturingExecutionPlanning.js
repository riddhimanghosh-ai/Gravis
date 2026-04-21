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
  ComposedChart,
} from 'recharts';
import FilterPanel from '../components/FilterPanel';
import '../styles/ManufacturingExecutionPlanning.css';

const ManufacturingExecutionPlanning = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const channels = useMemo(() => ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);
  const lines = useMemo(() => ['L1', 'L2', 'L3'], []);

  const [filters, setFilters] = useState({
    cities: cities,
    channels: channels,
    skus: skus,
  });

  const [selectedView, setSelectedView] = useState('monthly');

  // ===== DATA GENERATION =====

  // 1. Demand Forecast by SKU & Channel (12 months)
  const generateDemandForecast = () => {
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const baselineTrend = [2100, 2550, 3100, 2900, 2450, 2650, 2700, 3550, 4100, 4250, 4050, 3450];
    const skuWeights = { 'Vanilla': 0.55, 'Caramel': 0.22, 'Mint': 0.18, 'Chocolate': 0.05 };
    const channelWeights = { 'Parlor': 0.50, 'Retail': 0.35, 'HoReCa': 0.10, 'E-Commerce': 0.05 };

    const allData = [];
    months.forEach((month, idx) => {
      const isForecast = idx >= 6;

      skus.forEach(sku => {
        channels.forEach(channel => {
          const demand = Math.round(
            baselineTrend[idx] * skuWeights[sku] * channelWeights[channel]
          );

          allData.push({
            month,
            monthIdx: idx,
            sku,
            channel,
            demand: demand,
            forecast: isForecast ? Math.round(demand * (1 + Math.random() * 0.15 - 0.075)) : null,
            type: isForecast ? 'Forecast' : 'Actual',
          });
        });
      });
    });

    return allData;
  };

  // 2. Current Inventory by SKU & Channel
  const generateCurrentInventory = () => {
    const inventory = [];
    skus.forEach(sku => {
      channels.forEach(channel => {
        const baseInventory = {
          'Vanilla': { 'Parlor': 120, 'Retail': 85, 'HoReCa': 35, 'E-Commerce': 15 },
          'Caramel': { 'Parlor': 95, 'Retail': 42, 'HoReCa': 28, 'E-Commerce': 8 },
          'Mint': { 'Parlor': 78, 'Retail': 55, 'HoReCa': 18, 'E-Commerce': 6 },
          'Chocolate': { 'Parlor': 42, 'Retail': 28, 'HoReCa': 10, 'E-Commerce': 3 },
        };

        inventory.push({
          sku,
          channel,
          current: baseInventory[sku][channel],
          safetyStock: Math.round(baseInventory[sku][channel] * 0.75),
          reorderPoint: Math.round(baseInventory[sku][channel] * 0.6),
          lastUpdated: '2026-04-23',
        });
      });
    });
    return inventory;
  };

  // 3. Line Capacity & Changeover Data
  const generateLineCapacity = () => {
    return [
      {
        line: 'L1',
        skus: ['Vanilla', 'Caramel', 'Mint', 'Chocolate'],
        capacityPerDay: 30, // L per day
        setupTime: 1.5, // hours
        runTime: 6, // hours per batch
        currentProduct: 'Vanilla',
        status: 'Running',
      },
      {
        line: 'L2',
        skus: ['Vanilla', 'Caramel', 'Mint'],
        capacityPerDay: 25,
        setupTime: 1.5,
        runTime: 5,
        currentProduct: 'Caramel',
        status: 'Running',
      },
      {
        line: 'L3',
        skus: ['Vanilla', 'Mint', 'Chocolate'],
        capacityPerDay: 20,
        setupTime: 2, // longer changeover time
        runTime: 4,
        currentProduct: 'Mint',
        status: 'Running',
      },
    ];
  };

  // 4. Production Plan: What needs to be produced (Demand - Current Inventory)
  const generateProductionPlan = () => {
    const demandData = generateDemandForecast();
    const inventoryData = generateCurrentInventory();
    const lineCapacityData = generateLineCapacity();

    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const plan = [];

    months.forEach((month, idx) => {
      skus.forEach(sku => {
        channels.forEach(channel => {
          // Get demand for this month-sku-channel combination
          const demandItem = demandData.find(
            d => d.month === month && d.sku === sku && d.channel === channel
          );
          const monthlyDemand = demandItem?.demand || 0;

          // Get current inventory for this sku-channel
          const inventoryItem = inventoryData.find(
            i => i.sku === sku && i.channel === channel
          );
          const currentInv = inventoryItem?.current || 0;
          const safetyStock = inventoryItem?.safetyStock || 0;

          // Production needed = Monthly Demand - Current Inventory + Safety Stock Buffer
          const productionNeeded = Math.max(0, monthlyDemand - currentInv + safetyStock);

          // Find which lines can produce this SKU
          const capableLines = lineCapacityData.filter(l => l.skus.includes(sku));
          const totalLineCapacity = capableLines.reduce((sum, l) => sum + l.capacityPerDay, 0);

          plan.push({
            month,
            monthIdx: idx,
            sku,
            channel,
            monthlyDemand,
            currentInventory: currentInv,
            safetyStock,
            productionNeeded,
            totalLineCapacity: totalLineCapacity * 20, // 20 working days per month
            capableLines: capableLines.map(l => l.line).join(', '),
            feasible: productionNeeded <= (totalLineCapacity * 20),
            status: productionNeeded > (totalLineCapacity * 20) ? 'WARNING' : 'OK',
          });
        });
      });
    });

    return plan;
  };

  // 5. Monthly Production Requirements Aggregated by SKU
  const generateMonthlyProductionBySkuChannel = () => {
    const productionPlan = generateProductionPlan();
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    const monthlyData = [];
    months.forEach((month, idx) => {
      const monthData = {
        month,
        monthIdx: idx,
        vanilla: 0,
        caramel: 0,
        mint: 0,
        chocolate: 0,
        totalRequired: 0,
        totalCapacity: 0,
      };

      const monthPlanItems = productionPlan.filter(p => p.month === month);
      monthPlanItems.forEach(item => {
        const skuKey = item.sku.toLowerCase();
        monthData[skuKey] += item.productionNeeded;
        monthData.totalRequired += item.productionNeeded;
        monthData.totalCapacity = Math.max(monthData.totalCapacity, item.totalLineCapacity);
      });

      monthlyData.push(monthData);
    });

    return monthlyData;
  };

  // ===== FILTERED DATA =====

  const demandForecast = useMemo(() => {
    const rawData = generateDemandForecast();
    return rawData.filter(item =>
      filters.cities.includes(item.city || 'All') &&
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );
  }, [filters]);

  const currentInventory = useMemo(() => {
    const rawData = generateCurrentInventory();
    return rawData.filter(item =>
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );
  }, [filters]);

  const productionPlan = useMemo(() => {
    const rawData = generateProductionPlan();
    return rawData.filter(item =>
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );
  }, [filters]);

  const monthlyProductionBySkuChannel = useMemo(() => {
    return generateMonthlyProductionBySkuChannel();
  }, []);

  const lineCapacity = useMemo(() => {
    return generateLineCapacity();
  }, []);

  // ===== CALCULATIONS =====

  const calculateMetrics = () => {
    const totalDemand = productionPlan.reduce((sum, p) => sum + p.monthlyDemand, 0);
    const totalProduction = productionPlan.reduce((sum, p) => sum + p.productionNeeded, 0);
    const inventoryGap = productionPlan.filter(p => !p.feasible).length;
    const avgUtilization = Math.round(
      (totalProduction / (productionPlan.length * 500)) * 100
    );

    return {
      totalDemand: Math.round(totalDemand),
      totalProduction: Math.round(totalProduction),
      inventoryGap,
      avgUtilization,
    };
  };

  const metrics = calculateMetrics();

  // ===== RENDER =====

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>🏭 Manufacturing Execution Planning</h1>
        <p>Integrated demand forecast, inventory analysis, and production scheduling</p>
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

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '8px' }}>Total Demand (12M)</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#1F77B4' }}>{(metrics.totalDemand / 1000).toFixed(1)}K L</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Across all SKUs & channels</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '8px' }}>Production Required</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#FF7F0E' }}>{(metrics.totalProduction / 1000).toFixed(1)}K L</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>After accounting for current inventory</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '8px' }}>Feasibility Issues</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: metrics.inventoryGap > 0 ? '#D32F2F' : '#4CAF50' }}>
            {metrics.inventoryGap}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>SKU-channel combos at risk</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#999', fontWeight: '600', marginBottom: '8px' }}>Avg Line Utilization</div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#2CA02C' }}>{metrics.avgUtilization}%</div>
          <div style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>Across all production lines</div>
        </div>
      </div>

      {/* View Selection */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'monthly', label: '📊 Monthly Plan by SKU', icon: '📊' },
          { key: 'table', label: '📋 Production Requirements', icon: '📋' },
          { key: 'inventory', label: '📦 Inventory vs Forecast', icon: '📦' },
          { key: 'lines', label: '🏭 Line Capacity', icon: '🏭' },
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

      {/* View 1: Monthly Production Plan by SKU */}
      {selectedView === 'monthly' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>📊 Monthly Production Requirements by SKU</h2>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
            Shows how much of each SKU needs to be produced each month to meet demand and maintain safety stock
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyProductionBySkuChannel} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis label={{ value: 'Production Required (L)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="vanilla" fill="#1F77B4" name="Vanilla" />
              <Bar dataKey="caramel" fill="#D62728" name="Caramel" />
              <Bar dataKey="mint" fill="#2CA02C" name="Mint" />
              <Bar dataKey="chocolate" fill="#9467BD" name="Chocolate" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '6px' }}>
            <strong>💡 Insights:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '10px', fontSize: '13px', color: '#666' }}>
              <li><strong>Vanilla</strong> dominates production (55% of volume), peak in Jun-Aug</li>
              <li><strong>Seasonal Pattern</strong>: Summer months (Jun-Aug) require 40-50% more production</li>
              <li><strong>Recommendation</strong>: Allocate 2 lines permanently to Vanilla, 1 line flexible for other SKUs</li>
            </ul>
          </div>
        </div>
      )}

      {/* View 2: Production Requirements Table */}
      {selectedView === 'table' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', overflowX: 'auto' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>📋 Production Plan by SKU & Channel</h2>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
            For each channel-SKU combination: what demand needs to be fulfilled and how much production is required
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead style={{ background: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Month</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>SKU</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Channel</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Monthly Demand</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Current Inv</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Safety Stock</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Production Needed</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Capacity Available</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: '700' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {productionPlan.slice(0, 50).map((row, idx) => (
                <tr key={idx} style={{ background: idx % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #e0e0e0' }}>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.month}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0', fontWeight: '600' }}>{row.sku}</td>
                  <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.channel}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e0e0e0', fontWeight: '600' }}>{row.monthlyDemand.toLocaleString()}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e0e0e0' }}>{row.currentInventory}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e0e0e0' }}>{row.safetyStock}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '600', borderRight: '1px solid #e0e0e0', color: row.productionNeeded > 0 ? '#FF7F0E' : '#999' }}>
                    {row.productionNeeded.toLocaleString()}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e0e0e0' }}>{row.totalLineCapacity.toLocaleString()}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: row.feasible ? '#E8F5E9' : '#FFEBEE',
                      color: row.feasible ? '#2E7D32' : '#C62828',
                    }}>
                      {row.feasible ? '✓ OK' : '⚠ WARNING'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>
            Showing {Math.min(50, productionPlan.length)} of {productionPlan.length} records
          </div>
        </div>
      )}

      {/* View 3: Inventory vs Forecast */}
      {selectedView === 'inventory' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px', overflowX: 'auto' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>📦 Current Inventory Analysis</h2>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
            Current stock levels vs safety stock and reorder points for each SKU-Channel combination
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead style={{ background: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
              <tr>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>SKU</th>
                <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Channel</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Current Stock</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Safety Stock</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Reorder Point</th>
                <th style={{ padding: '10px', textAlign: 'right', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Days of Supply</th>
                <th style={{ padding: '10px', textAlign: 'center', fontWeight: '700' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentInventory.map((row, idx) => {
                const dailyDemand = row.current / 20; // Assume 20 days inventory horizon
                const daysOfSupply = Math.round(row.current / (dailyDemand || 1));
                let status = 'OK';
                let statusColor = '#4CAF50';

                if (row.current < row.reorderPoint) {
                  status = 'REORDER';
                  statusColor = '#D32F2F';
                } else if (row.current < row.safetyStock) {
                  status = 'LOW';
                  statusColor = '#FF7F0E';
                }

                return (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0', fontWeight: '600' }}>{row.sku}</td>
                    <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{row.channel}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '600', borderRight: '1px solid #e0e0e0' }}>{row.current}L</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e0e0e0' }}>{row.safetyStock}L</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', borderRight: '1px solid #e0e0e0' }}>{row.reorderPoint}L</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: '600', borderRight: '1px solid #e0e0e0' }}>{daysOfSupply} days</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: statusColor === '#4CAF50' ? '#E8F5E9' : statusColor === '#FF7F0E' ? '#FFF3E0' : '#FFEBEE',
                        color: statusColor,
                      }}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View 4: Line Capacity */}
      {selectedView === 'lines' && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>🏭 Production Line Capacity & Configuration</h2>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
            Line specifications: capacity, changeover times, capable SKUs, and current status
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {lineCapacity.map(line => (
              <div key={line.line} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', background: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>{line.line}</h3>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: '#E8F5E9',
                    color: '#2E7D32',
                  }}>
                    ✓ {line.status}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    <strong>Daily Capacity:</strong> {line.capacityPerDay}L/day (600L/month)
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    <strong>Setup Time:</strong> {line.setupTime}h | <strong>Run Time:</strong> {line.runTime}h
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                    <strong>Currently Running:</strong> {line.currentProduct}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Can Produce
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {line.skus.map(sku => (
                      <span key={sku} style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: sku === line.currentProduct ? '#1F77B4' : '#e0e0e0',
                        color: sku === line.currentProduct ? 'white' : '#666',
                      }}>
                        {sku}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#999', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Changeover Cost
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {line.setupTime}h setup + {line.runTime}h run = {line.setupTime + line.runTime}h per batch
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '15px', background: '#f0f7ff', borderRadius: '6px', borderLeft: '4px solid #1F77B4' }}>
            <strong>💡 Optimization Tips:</strong>
            <ul style={{ marginLeft: '20px', marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <li>L1 has longest changeover (1.5h) but largest capacity (30L/day) → Dedicate to Vanilla (highest demand)</li>
              <li>L3 has longest setup (2h) → Run longer batches to amortize changeover time</li>
              <li>Parallel lines (L1, L2, L3) can run different SKUs simultaneously to minimize total lead time</li>
              <li>Current setup: L1=Vanilla, L2=Caramel, L3=Mint is good for September. Adjust for seasonal peaks.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturingExecutionPlanning;
