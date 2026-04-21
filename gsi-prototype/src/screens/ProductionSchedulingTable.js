import React, { useState, useMemo } from 'react';
import FilterPanel from '../components/FilterPanel';

const ProductionSchedulingTable = () => {
  const cities = useMemo(() => ['Bangalore', 'Hyderabad', 'Chennai', 'Pune'], []);
  const channels = useMemo(() => ['Parlor', 'Retail', 'HoReCa', 'E-Commerce'], []);
  const skus = useMemo(() => ['Vanilla', 'Caramel', 'Mint', 'Chocolate'], []);

  const [filters, setFilters] = useState({
    cities: cities,
    channels: channels,
    skus: skus,
  });

  // Generate production schedule with city dimension
  const generateSchedules = () => {
    const allSchedules = [];
    const dates = ['Apr 21', 'Apr 22', 'Apr 23', 'Apr 24', 'Apr 25'];
    const lines = ['L1', 'L2', 'L3'];
    const baseSchedules = [
      { sku: 'Vanilla', qty: '8L', start: '08:00', end: '16:00' },
      { sku: 'Caramel', qty: '5L', start: '08:00', end: '16:00' },
      { sku: 'Mint', qty: '6L', start: '08:00', end: '16:00' },
      { sku: 'Chocolate', qty: '4L', start: '08:00', end: '16:00' },
    ];

    dates.forEach(date => {
      cities.forEach(city => {
        channels.forEach(channel => {
          skus.forEach((sku, idx) => {
            const schedule = baseSchedules[idx];
            allSchedules.push({
              city: city,
              channel: channel,
              date: date,
              line: lines[idx % 3],
              sku: sku,
              qty: schedule.qty,
              start: schedule.start,
              end: schedule.end,
              status: 'Scheduled',
            });
          });
        });
      });
    });
    return allSchedules;
  };

  const rawSchedules = generateSchedules();

  // Filter schedules based on selections
  const schedules = useMemo(() => {
    return rawSchedules.filter(item =>
      filters.cities.includes(item.city) &&
      filters.channels.includes(item.channel) &&
      filters.skus.includes(item.sku)
    );
  }, [rawSchedules, filters]);

  const gaps = [
    { sku: 'Vanilla', scheduled: '8L/day', forecasted: '8.5L/day', gap: '-0.5L' },
    { sku: 'Caramel', scheduled: '5L/day', forecasted: '4.8L/day', gap: '✓ OK' },
    { sku: 'Mint', scheduled: '6L/day', forecasted: '6.2L/day', gap: '-0.2L' },
  ];

  return (
    <div className="container">
      <h1>Production Schedule - Table View</h1>

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

      <h2>Production Schedule Details</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead style={{ background: '#f9f9f9', borderBottom: '2px solid #e0e0e0' }}>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Date</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>City</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Channel</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Line</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>SKU</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Qty</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>Start</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700', borderRight: '1px solid #e0e0e0' }}>End</th>
              <th style={{ padding: '10px', textAlign: 'left', fontWeight: '700' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules.slice(0, 100).map((s, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fafafa' : 'white', borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{s.date}</td>
                <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{s.city}</td>
                <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{s.channel}</td>
                <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{s.line}</td>
                <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{s.sku}</td>
                <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{s.qty}</td>
                <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{s.start}</td>
                <td style={{ padding: '8px 10px', borderRight: '1px solid #e0e0e0' }}>{s.end}</td>
                <td style={{ padding: '8px 10px' }}><span className="status-badge status-ok">✓ {s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '12px', fontSize: '12px', color: '#999' }}>
        Showing {Math.min(100, schedules.length)} of {schedules.length} records
      </div>

      <h2>Production Gap Analysis</h2>
      <table style={{ marginTop: '15px' }}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Scheduled (L/day)</th>
            <th>Forecasted (L/day)</th>
            <th>Gap</th>
          </tr>
        </thead>
        <tbody>
          {gaps.map((g, i) => (
            <tr key={i}>
              <td>{g.sku}</td>
              <td>{g.scheduled}</td>
              <td>{g.forecasted}</td>
              <td>
                {g.gap === '✓ OK' ? (
                  <span className="status-badge status-ok">✓ OK</span>
                ) : (
                  <span className="status-badge" style={{ background: '#fff5e6', color: '#FF7F0E' }}>⚠ {g.gap}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn-primary">Approve Production Plan</button>
        <button className="btn-secondary">Save as Draft</button>
      </div>
    </div>
  );
};

export default ProductionSchedulingTable;
