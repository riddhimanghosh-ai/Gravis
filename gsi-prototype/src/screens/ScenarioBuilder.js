import React, { useState } from 'react';

const ScenarioBuilder = () => {
  const [demandChange, setDemandChange] = useState(15);
  const [scenario, setScenario] = useState(null);

  const base = {
    parlor: 2400,
    retail: 1800,
    horeca: 950,
    ecom: 320,
  };

  const totalBase = Object.values(base).reduce((a, b) => a + b, 0);
  const totalNew = totalBase * (1 + demandChange / 100);

  const feasibility = totalNew <= 9000 ? '✓ FEASIBLE' : '✗ NOT FEASIBLE';
  const feasibilityColor = totalNew <= 9000 ? '#2CA02C' : '#D62728';

  return (
    <div className="container">
      <h1>Scenario Builder - What-If Analysis</h1>

      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ marginBottom: '5px' }}>
          <strong>Base Scenario:</strong> Week of Apr 21 (Current)
        </p>
        <p style={{ fontSize: '13px', color: '#666' }}>
          Total Demand: {totalBase.toLocaleString()} L/day | Max Capacity: 9,000 L/day
        </p>
      </div>

      <h2>Scenario Inputs</h2>
      <div style={{
        background: '#e6f2ff',
        padding: '15px',
        borderRadius: '8px',
        border: '2px solid #1F77B4',
        marginBottom: '20px'
      }}>
        <p style={{ marginBottom: '10px' }}>
          <strong>What-If: Parlor demand increases by {demandChange}%</strong>
        </p>
        <input
          type="range"
          min="-30"
          max="50"
          value={demandChange}
          onChange={(e) => setDemandChange(Number(e.target.value))}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <p style={{ fontSize: '12px', color: '#666' }}>
          Drag to adjust demand change: {demandChange > 0 ? '+' : ''}{demandChange}%
        </p>

        <h3 style={{ marginTop: '15px', marginBottom: '10px' }}>New Demand Forecast:</h3>
        <ul style={{ marginLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
          <li>Parlor: {(base.parlor * (1 + demandChange / 100)).toFixed(0)} L/day (was {base.parlor})</li>
          <li>Retail: {base.retail} L/day</li>
          <li>HoReCa: {base.horeca} L/day</li>
          <li>E-commerce: {base.ecom} L/day</li>
          <li style={{ marginTop: '5px', fontWeight: 'bold' }}>
            <strong>Total: {totalNew.toFixed(0)} L/day (was {totalBase})</strong>
          </li>
        </ul>

        <button className="btn-primary" style={{ marginTop: '10px' }}>Apply to Scenario</button>
      </div>

      <h2>Scenario Impact Analysis</h2>
      <table style={{ marginTop: '15px' }}>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Base Scenario</th>
            <th>New Scenario</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Total Production Needed</strong></td>
            <td>{totalBase.toLocaleString()} L/day</td>
            <td>{totalNew.toFixed(0).toLocaleString()} L/day</td>
            <td><strong style={{ color: demandChange > 0 ? '#D62728' : '#2CA02C' }}>
              {demandChange > 0 ? '+' : ''}{(totalNew - totalBase).toFixed(0)} L/day
            </strong></td>
          </tr>
          <tr>
            <td><strong>Line 1 Utilization</strong></td>
            <td>82%</td>
            <td>{Math.min(95, 82 + (demandChange * 0.2)).toFixed(0)}%</td>
            <td style={{ color: demandChange > 0 ? '#FF7F0E' : '#2CA02C' }}>
              {demandChange > 0 ? '+' : ''}{(demandChange * 0.2).toFixed(0)}%
            </td>
          </tr>
          <tr>
            <td><strong>Line 2 Utilization</strong></td>
            <td>65%</td>
            <td>{Math.min(100, 65 + (demandChange * 0.15)).toFixed(0)}%</td>
            <td style={{ color: demandChange > 0 ? '#FF7F0E' : '#2CA02C' }}>
              {demandChange > 0 ? '+' : ''}{(demandChange * 0.15).toFixed(0)}%
            </td>
          </tr>
          <tr>
            <td><strong>Line 3 Utilization</strong></td>
            <td>91%</td>
            <td>{Math.min(100, 91 + (demandChange * 0.18)).toFixed(0)}%</td>
            <td style={{ color: demandChange > 0 ? '#FF7F0E' : '#2CA02C' }}>
              {demandChange > 0 ? '+' : ''}{(demandChange * 0.18).toFixed(0)}%
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Feasibility Check</h2>
      <div style={{
        padding: '15px',
        borderRadius: '8px',
        background: feasibilityColor === '#2CA02C' ? '#e6f7e6' : '#ffe6e6',
        border: `2px solid ${feasibilityColor}`,
        color: feasibilityColor,
        marginTop: '15px',
        marginBottom: '15px'
      }}>
        <strong style={{ fontSize: '16px' }}>
          {feasibility}
        </strong>
        {totalNew > 9000 && (
          <div style={{ marginTop: '10px', fontSize: '13px', color: '#660000' }}>
            <p><strong>Gap: {(totalNew - 9000).toFixed(0)} L/day short</strong></p>
            <p>(Can only produce 9,000 L/day maximum)</p>
            <p style={{ marginTop: '10px' }}>
              <strong>Recommended Actions:</strong>
            </p>
            <ol style={{ marginLeft: '20px', marginTop: '5px' }}>
              <li>Extend production hours (16h/day)</li>
              <li>Defer lower-priority channels (E-commerce)</li>
              <li>Request distributor to buffer inventory</li>
            </ol>
          </div>
        )}
      </div>

      {totalNew <= 9000 && (
        <h2>Suggested Production Plan</h2>
      )}
      {totalNew <= 9000 && (
        <div style={{
          padding: '15px',
          background: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #ddd',
          marginTop: '15px'
        }}>
          <p><strong>Monday:</strong> L1→Vanilla(9.5L) + L2→Caramel(5L) + L3→Mint(6.5L) = 21L</p>
          <p style={{ marginTop: '8px' }}><strong>Tuesday:</strong> [MAINTENANCE - Line 2 Down]</p>
          <p style={{ marginLeft: '20px', fontSize: '13px' }}>L1→Caramel(5L) + L3→Vanilla(9.5L) = 14.5L</p>
          <p style={{ marginTop: '8px' }}><strong>Wednesday-Friday:</strong> Balanced allocation...</p>

          <button className="btn-primary" style={{ marginTop: '15px' }}>Regenerate Plan with New Constraints</button>
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn-success">Accept This Scenario</button>
        <button className="btn-secondary">Modify</button>
        <button className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
};

export default ScenarioBuilder;
