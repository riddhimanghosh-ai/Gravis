import React, { useState } from 'react';

const ManufacturingExecution = () => {
  const [lineStatus, setLineStatus] = useState({
    line1: 80,
    line2: 90,
    line3: 0
  });

  const lines = [
    { id: 'line1', name: 'Line 1', product: 'Vanilla (8L/day)', status: 'IN PROGRESS', since: '08:00', target: '16:00', progress: 80, temp: '17.8°C', viscosity: '45 cP' },
    { id: 'line2', name: 'Line 2', product: 'Caramel (5L/day)', status: 'IN PROGRESS', since: '08:00', target: '16:00', progress: 90, temp: '18.1°C', viscosity: '44.8 cP' },
    { id: 'line3', name: 'Line 3', product: 'Mint (6L/day)', status: 'SCHEDULED', since: '08:00', target: '16:00', progress: 0, temp: '--', viscosity: '--' },
  ];

  const nextActivity = { line: 'Line 1', from: 'Vanilla', to: 'Caramel', start: '16:00', duration: '6h', end: '22:00' };

  return (
    <div className="container">
      <h1>Manufacturing Execution - Today (Apr 21, 2026)</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className="btn-primary">Refresh</button>
        <button className="btn-secondary">Print</button>
      </div>

      <h2>Line Status Monitor</h2>
      {lines.map((line, i) => (
        <div key={i} style={{
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          background: line.status === 'SCHEDULED' ? '#f9f9f9' : '#fffbf0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h3 style={{ marginBottom: '5px' }}>{line.name}: {line.product}</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>
                Status: <strong>{line.status}</strong> (Since {line.since})
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F77B4' }}>
                {line.progress}%
              </div>
              <p style={{ fontSize: '12px', color: '#999' }}>Target: {line.target}</p>
            </div>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${line.progress}%` }}></div>
          </div>

          {line.status === 'IN PROGRESS' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px', fontSize: '13px' }}>
              <div>
                <strong>Temperature:</strong> {line.temp} (Target: 18±1°C) ✓
              </div>
              <div>
                <strong>Viscosity:</strong> {line.viscosity} (Target: 45±3 cP) ✓
              </div>
            </div>
          )}
        </div>
      ))}

      <h2>Next Scheduled Activity</h2>
      <div style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        border: '2px solid #FF7F0E'
      }}>
        <p><strong>Changeover on {nextActivity.line}</strong></p>
        <p style={{ marginTop: '10px', fontSize: '14px' }}>
          <strong>{nextActivity.from} → {nextActivity.to}</strong><br />
          Start Time: {nextActivity.start} | Duration: {nextActivity.duration} | Expected End: {nextActivity.end}
        </p>
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button className="btn-warning">Start Changeover</button>
          <button className="btn-secondary">Log Issue</button>
        </div>
      </div>

      <h2>Quality Metrics & Alerts</h2>
      <table style={{ marginTop: '15px' }}>
        <thead>
          <tr>
            <th>Line</th>
            <th>Temperature</th>
            <th>Viscosity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Line 1</td>
            <td>17.8°C (Target: 18±1°C)</td>
            <td>45 cP (Target: 45±3 cP)</td>
            <td><span className="status-badge status-ok">✓ OK</span></td>
          </tr>
          <tr>
            <td>Line 2</td>
            <td>18.1°C (Target: 18±1°C)</td>
            <td>44.8 cP (Target: 45±3 cP)</td>
            <td><span className="status-badge status-ok">✓ OK</span></td>
          </tr>
          <tr>
            <td>Line 3</td>
            <td>-- (Waiting to start)</td>
            <td>-- (Waiting to start)</td>
            <td><span className="status-badge" style={{ background: '#f0f0f0' }}>PENDING</span></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '15px', padding: '12px', background: '#fff5e6', borderLeft: '4px solid #FF7F0E', borderRadius: '4px' }}>
        <strong style={{ color: '#FF7F0E' }}>⚠ ALERT:</strong> Line 3 raw material delayed (ETA 10:30)<br />
        <p style={{ marginTop: '8px', fontSize: '13px' }}>Consider shifting priority to Line 2 expansion</p>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn-primary">Log Production</button>
        <button className="btn-secondary">Report Issue</button>
        <button className="btn-success">Complete Shift</button>
      </div>
    </div>
  );
};

export default ManufacturingExecution;
