import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductionSchedulingGantt = () => {
  const schedule = [
    { line: 'Line 1', mon: 'Vanilla 8L', tue: 'Chng', wed: 'Vanilla 8L', thu: 'Caramel 5L', fri: 'Vanilla 8L' },
    { line: 'Line 2', mon: 'Caramel 5L', tue: 'Vanilla 8L', wed: 'Chng', thu: 'Vanilla 8L', fri: 'Caramel 5L' },
    { line: 'Line 3', mon: 'Mint 6L', tue: 'Caramel 5L', wed: 'Vanilla 8L', thu: 'Chng', fri: 'Mint 6L' },
  ];

  const utilization = [
    { line: 'Line 1', utilization: 82 },
    { line: 'Line 2', utilization: 65 },
    { line: 'Line 3', utilization: 91 },
  ];

  const getColor = (product) => {
    if (product.includes('Chng')) return '#ccc';
    if (product.includes('Vanilla')) return '#F4D03F';
    if (product.includes('Caramel')) return '#B8860B';
    if (product.includes('Mint')) return '#90EE90';
    return '#8B4513';
  };

  return (
    <div className="container">
      <h1>Production Schedule - Gantt View</h1>

      <div className="controls">
        <div className="control-group">
          <label>Week:</label>
          <select>
            <option>Apr 21-27</option>
            <option>Apr 28-May 4</option>
            <option>May 5-11</option>
          </select>
        </div>
        <button className="btn-primary">Export</button>
      </div>

      <h2>Weekly Production Schedule</h2>
      <table style={{ marginTop: '15px', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={{ width: '80px' }}>Line</th>
            <th style={{ width: '120px' }}>Monday</th>
            <th style={{ width: '120px' }}>Tuesday</th>
            <th style={{ width: '120px' }}>Wednesday</th>
            <th style={{ width: '120px' }}>Thursday</th>
            <th style={{ width: '120px' }}>Friday</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row, i) => (
            <tr key={i}>
              <td><strong>{row.line}</strong></td>
              <td style={{ background: getColor(row.mon), padding: '10px', borderRadius: '4px', color: row.mon.includes('Chng') ? '#666' : '#333' }}>
                {row.mon}
              </td>
              <td style={{ background: getColor(row.tue), padding: '10px', borderRadius: '4px', color: row.tue.includes('Chng') ? '#666' : '#333' }}>
                {row.tue}
              </td>
              <td style={{ background: getColor(row.wed), padding: '10px', borderRadius: '4px', color: row.wed.includes('Chng') ? '#666' : '#333' }}>
                {row.wed}
              </td>
              <td style={{ background: getColor(row.thu), padding: '10px', borderRadius: '4px', color: row.thu.includes('Chng') ? '#666' : '#333' }}>
                {row.thu}
              </td>
              <td style={{ background: getColor(row.fri), padding: '10px', borderRadius: '4px', color: row.fri.includes('Chng') ? '#666' : '#333' }}>
                {row.fri}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Capacity Utilization</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={utilization}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="line" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="utilization" fill="#1F77B4" />
        </BarChart>
      </ResponsiveContainer>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div>
          <h3>Legend</h3>
          <div style={{ padding: '10px', background: '#F4D03F', borderRadius: '4px', marginBottom: '5px' }}>Vanilla</div>
          <div style={{ padding: '10px', background: '#B8860B', borderRadius: '4px', marginBottom: '5px', color: 'white' }}>Caramel</div>
          <div style={{ padding: '10px', background: '#90EE90', borderRadius: '4px', marginBottom: '5px' }}>Mint</div>
          <div style={{ padding: '10px', background: '#ccc', borderRadius: '4px' }}>Changeover (6h)</div>
        </div>
        <div>
          <h3>Alerts</h3>
          <div className="alert alert-warning">⚠ Line 2 utilization low (65%)</div>
          <div className="alert alert-info">ℹ Changeover on Line 1 (Mon 8-14h)</div>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button className="btn-primary">Adjust Schedule</button>
        <button className="btn-primary">What-If Analysis</button>
        <button className="btn-success">Approve Plan</button>
      </div>
    </div>
  );
};

export default ProductionSchedulingGantt;
