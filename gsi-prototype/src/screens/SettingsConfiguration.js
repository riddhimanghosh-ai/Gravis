import React, { useState } from 'react';

const SettingsConfiguration = () => {
  const [activeTab, setActiveTab] = useState('lines');

  return (
    <div className="container">
      <h1>Settings & Configuration</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('lines')}
          style={{
            background: activeTab === 'lines' ? '#1F77B4' : '#f0f0f0',
            color: activeTab === 'lines' ? 'white' : '#666',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'lines' ? '600' : '400'
          }}
        >
          Production Lines
        </button>
        <button
          onClick={() => setActiveTab('skus')}
          style={{
            background: activeTab === 'skus' ? '#1F77B4' : '#f0f0f0',
            color: activeTab === 'skus' ? 'white' : '#666',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'skus' ? '600' : '400'
          }}
        >
          SKU/Products
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          style={{
            background: activeTab === 'channels' ? '#1F77B4' : '#f0f0f0',
            color: activeTab === 'channels' ? 'white' : '#666',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'channels' ? '600' : '400'
          }}
        >
          Channels
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          style={{
            background: activeTab === 'integrations' ? '#1F77B4' : '#f0f0f0',
            color: activeTab === 'integrations' ? 'white' : '#666',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: activeTab === 'integrations' ? '600' : '400'
          }}
        >
          Integrations
        </button>
      </div>

      {activeTab === 'lines' && (
        <div>
          <h2>Production Lines Setup</h2>
          <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '15px' }}>
            <p><strong>Line Name:</strong> <input type="text" defaultValue="Vanilla Production Line" style={{ width: '200px' }} /></p>
            <p style={{ marginTop: '10px' }}><strong>Line ID:</strong> <input type="text" defaultValue="LINE_01" style={{ width: '100px' }} /></p>
            <p style={{ marginTop: '10px' }}><strong>Max Capacity:</strong> <input type="number" defaultValue="10" style={{ width: '80px' }} /> L/day</p>
            <p style={{ marginTop: '10px' }}><strong>Operating Hours:</strong> <input type="time" defaultValue="08:00" /> - <input type="time" defaultValue="22:00" /></p>
            <p style={{ marginTop: '10px' }}><strong>Changeover Time:</strong> <input type="number" defaultValue="6" style={{ width: '80px' }} /> hours</p>
            <p style={{ marginTop: '10px' }}><strong>Status:</strong> <select><option>Active</option><option>Inactive</option><option>Maintenance</option></select></p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button className="btn-primary">Save</button>
              <button className="btn-secondary">Delete</button>
            </div>
          </div>
          <button className="btn-secondary">Add New Line</button>
        </div>
      )}

      {activeTab === 'skus' && (
        <div>
          <h2>SKU & Product Setup</h2>
          <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '15px' }}>
            <p><strong>SKU:</strong> <input type="text" defaultValue="VANILLA_1L" style={{ width: '150px' }} /></p>
            <p style={{ marginTop: '10px' }}><strong>Product Name:</strong> <input type="text" defaultValue="Vanilla Ice Cream" style={{ width: '250px' }} /></p>
            <p style={{ marginTop: '10px' }}><strong>Category:</strong>
              <div style={{ marginTop: '5px' }}>
                <label><input type="checkbox" defaultChecked /> Parlor</label>
                <label style={{ marginLeft: '15px' }}><input type="checkbox" defaultChecked /> Retail</label>
                <label style={{ marginLeft: '15px' }}><input type="checkbox" defaultChecked /> HoReCa</label>
                <label style={{ marginLeft: '15px' }}><input type="checkbox" defaultChecked /> E-commerce</label>
              </div>
            </p>
            <p style={{ marginTop: '10px' }}><strong>Production Capacity:</strong> <input type="number" defaultValue="10" style={{ width: '80px' }} /> L/day</p>
            <p style={{ marginTop: '10px' }}><strong>Min Batch Size:</strong> <input type="number" defaultValue="2" style={{ width: '80px' }} /> L</p>
            <p style={{ marginTop: '10px' }}><strong>Shelf Life:</strong> <input type="number" defaultValue="90" style={{ width: '80px' }} /> days</p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button className="btn-primary">Save</button>
              <button className="btn-secondary">Delete</button>
            </div>
          </div>
          <button className="btn-secondary">Add New SKU</button>
        </div>
      )}

      {activeTab === 'channels' && (
        <div>
          <h2>Channel Configuration</h2>
          <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '15px' }}>
            <p><strong>Channel:</strong> <input type="text" defaultValue="PARLOR" style={{ width: '150px' }} /></p>
            <p style={{ marginTop: '10px' }}><strong>Distributor(s):</strong> <input type="text" defaultValue="Snowman, TJ UK" style={{ width: '250px' }} /></p>
            <p style={{ marginTop: '10px' }}><strong>Delivery Frequency:</strong> <input type="number" defaultValue="2" style={{ width: '80px' }} /> days</p>
            <p style={{ marginTop: '10px' }}><strong>Lead Time:</strong> <input type="number" defaultValue="2" style={{ width: '80px' }} /> days</p>
            <p style={{ marginTop: '10px' }}><strong>Safety Stock Target:</strong> <input type="number" defaultValue="30" style={{ width: '80px' }} /> days inventory</p>
            <p style={{ marginTop: '10px' }}><strong>Priority:</strong> <select><option>High</option><option>Medium</option><option>Low</option></select></p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button className="btn-primary">Save</button>
              <button className="btn-secondary">Delete</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div>
          <h2>System Integrations</h2>

          <div style={{ padding: '15px', background: '#e6f7e6', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #2CA02C' }}>
            <p><strong>✓ SAP ERP Connection</strong></p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Status: Connected | Last Sync: Apr 21 14:30</p>
            <p style={{ fontSize: '13px', color: '#666' }}>Data Sync Frequency:
              <select style={{ marginLeft: '10px' }}>
                <option>Every 4 hours</option>
                <option>Every 2 hours</option>
                <option>Hourly</option>
              </select>
            </p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button className="btn-primary btn-small">Test Connection</button>
              <button className="btn-secondary btn-small">Configure</button>
            </div>
          </div>

          <div style={{ padding: '15px', background: '#e6f7e6', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #2CA02C' }}>
            <p><strong>✓ Scholar MES Connection</strong></p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Status: Connected | Last Sync: Apr 21 14:45</p>
            <p style={{ fontSize: '13px', color: '#666' }}>Data Sync Frequency:
              <select style={{ marginLeft: '10px' }}>
                <option selected>Real-time</option>
                <option>Every 15 min</option>
                <option>Hourly</option>
              </select>
            </p>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button className="btn-primary btn-small">Test Connection</button>
              <button className="btn-secondary btn-small">Configure</button>
            </div>
          </div>

          <div style={{ padding: '15px', background: '#fff5e6', borderRadius: '8px', marginBottom: '15px', borderLeft: '4px solid #FF7F0E' }}>
            <p><strong>⚠ Distributor API - Partial</strong></p>
            <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Last Update: Apr 21 10:00</p>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Parlor: ✓ | Retail: ✓ | HoReCa: ✗ | E-commerce: ✓
            </p>
            <button className="btn-warning btn-small" style={{ marginTop: '10px' }}>Configure Missing Connections</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsConfiguration;
