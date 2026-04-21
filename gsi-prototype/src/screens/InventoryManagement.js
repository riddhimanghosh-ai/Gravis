import React, { useState, useMemo } from 'react';
import FilterPanel from '../components/FilterPanel';

const InventoryManagement = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const channels = useMemo(() => ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);

  const [filters, setFilters] = useState({
    cities: cities,
    channels: channels,
    skus: skus,
  });

  // Generate inventory data with city dimension
  const generateInventoryData = () => {
    const allData = [];
    cities.forEach(city => {
      channels.forEach(channel => {
        skus.forEach(sku => {
          // Base inventory by SKU and channel
          const baseInventory = {
            'Vanilla': { 'Parlor': 35, 'Retail': 18, 'HoReCa': 12, 'E-Commerce': 5 },
            'Caramel': { 'Parlor': 28, 'Retail': 8, 'HoReCa': 9, 'E-Commerce': 2 },
            'Mint': { 'Parlor': 22, 'Retail': 12, 'HoReCa': 6, 'E-Commerce': 3 },
            'Chocolate': { 'Parlor': 15, 'Retail': 8, 'HoReCa': 4, 'E-Commerce': 1 },
          };

          const baseSafety = {
            'Vanilla': { 'Parlor': 30, 'Retail': 18, 'HoReCa': 10, 'E-Commerce': 5 },
            'Caramel': { 'Parlor': 22, 'Retail': 12, 'HoReCa': 8, 'E-Commerce': 3 },
            'Mint': { 'Parlor': 18, 'Retail': 10, 'HoReCa': 5, 'E-Commerce': 2 },
            'Chocolate': { 'Parlor': 12, 'Retail': 6, 'HoReCa': 3, 'E-Commerce': 1 },
          };

          const cityMultiplier = city === 'Bangalore' ? 1.2 : city === 'Hyderabad' ? 0.9 : city === 'Chennai' ? 0.8 : 0.6;

          const current = Math.round(baseInventory[sku][channel] * cityMultiplier);
          const safety = Math.round(baseSafety[sku][channel] * cityMultiplier);
          const reorder = Math.round(safety * 0.85);

          let status = 'OK';
          if (current < safety) status = current < reorder ? 'CRIT' : 'LOW';

          allData.push({
            city: city,
            sku: sku,
            channel: channel,
            current: current,
            safety: safety,
            reorder: reorder,
            status: status,
          });
        });
      });
    });
    return allData;
  };

  const rawInventory = generateInventoryData();

  // Filter inventory based on selections
  const inventory = useMemo(() => {
    return rawInventory.filter(item =>
      filters.cities.includes(item.city) &&
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );
  }, [rawInventory, filters]);

  const reorders = [
    { id: 1, sku: 'Caramel', channel: 'Retail', qty: 200, status: 'URGENT', action: 'Order 200L by Apr 23' },
    { id: 2, sku: 'Vanilla', channel: 'Retail', qty: 180, status: 'SOON', action: 'Order 180L by Apr 24' },
    { id: 3, sku: 'Caramel', channel: 'E-comm', qty: 100, status: 'SOON', action: 'Order 100L by Apr 23' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK': return '#e6f7e6';
      case 'LOW': return '#fff5e6';
      case 'CRIT': return '#ffe6e6';
      default: return '#f0f0f0';
    }
  };

  return (
    <div className="container">
      <h1>Inventory Management</h1>

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

      <h2>Stock Status by City, SKU & Channel</h2>
      <table>
        <thead>
          <tr>
            <th>City</th>
            <th>SKU</th>
            <th>Channel</th>
            <th>Current Stock</th>
            <th>Safety Stock</th>
            <th>Reorder Point</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((row, i) => (
            <tr key={i} style={{ background: getStatusColor(row.status) }}>
              <td>{row.city}</td>
              <td>{row.sku}</td>
              <td>{row.channel}</td>
              <td>{row.current}L</td>
              <td>{row.safety}L</td>
              <td>{row.reorder}L</td>
              <td>
                <span className="status-badge" style={{
                  background: row.status === 'OK' ? '#e6f7e6' : row.status === 'LOW' ? '#fff5e6' : '#ffe6e6',
                  color: row.status === 'OK' ? '#2CA02C' : row.status === 'LOW' ? '#FF7F0E' : '#D62728'
                }}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Reorder Recommendations</h2>
      <div style={{ background: '#fff5e6', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
        <strong style={{ color: '#FF7F0E' }}>Priority 1 (URGENT):</strong>
        <ul style={{ marginLeft: '20px', marginTop: '10px', fontSize: '14px' }}>
          <li>Caramel - Retail: Current 8L &lt; Safety 12L</li>
          <li style={{ marginTop: '5px' }}>→ Suggest ordering 200L (EOQ) by Apr 23</li>
        </ul>
      </div>

      <div style={{ background: '#e6f2ff', padding: '15px', borderRadius: '4px', marginBottom: '15px' }}>
        <strong style={{ color: '#1F77B4' }}>Priority 2 (SOON):</strong>
        <ul style={{ marginLeft: '20px', marginTop: '10px', fontSize: '14px' }}>
          <li>Vanilla - Retail: Current 18L = Safety stock</li>
          <li style={{ marginTop: '5px' }}>→ Suggest ordering 180L (EOQ) by Apr 24</li>
          <li style={{ marginTop: '5px' }}>Caramel - E-comm: Current 2L &lt; Safety 3L</li>
          <li style={{ marginTop: '5px' }}>→ Suggest ordering 100L (EOQ) by Apr 23</li>
        </ul>
      </div>

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Channel</th>
            <th>EOQ Qty</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reorders.map((r, i) => (
            <tr key={i}>
              <td>{r.sku}</td>
              <td>{r.channel}</td>
              <td>{r.qty}L</td>
              <td>
                <span className="status-badge" style={{
                  background: r.status === 'URGENT' ? '#ffe6e6' : '#fff5e6',
                  color: r.status === 'URGENT' ? '#D62728' : '#FF7F0E'
                }}>
                  {r.status}
                </span>
              </td>
              <td>{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn-success">Approve Reorders</button>
        <button className="btn-secondary">Manual Adjust</button>
      </div>
    </div>
  );
};

export default InventoryManagement;
