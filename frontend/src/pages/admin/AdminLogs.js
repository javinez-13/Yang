import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import { http } from '../../api/http.js';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(200);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const { data } = await http.get(`/admin/logs?limit=${limit}`);
      setLogs(data);
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [limit]);

  return (
    <AppLayout>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>System Logs</h2>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <label>
              Limit:
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                style={{ marginLeft: 8, padding: '4px 8px', borderRadius: 4, border: '1px solid #ddd' }}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
              </select>
            </label>
            <button className="secondary-btn" onClick={loadLogs}>Refresh</button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 40, 
            borderRadius: 12, 
            textAlign: 'center' 
          }}>
            <p>No logs found.</p>
          </div>
        ) : (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            borderRadius: 12, 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {logs.map(l => (
                <div 
                  key={l.id} 
                  style={{ 
                    padding: 16, 
                    borderBottom: '1px solid #eee',
                    background: l.id % 2 === 0 ? '#fafafa' : 'white'
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ 
                      minWidth: 180, 
                      fontSize: '0.85rem', 
                      color: '#666',
                      fontWeight: 600
                    }}>
                      {new Date(l.created_at).toLocaleString()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        marginBottom: 8, 
                        fontWeight: 500,
                        color: '#1a1a1a'
                      }}>
                        {l.message}
                        {l.meta && l.meta.full_name && (
                          <span style={{ 
                            marginLeft: 8, 
                            color: '#666', 
                            fontWeight: 400,
                            fontSize: '0.9rem'
                          }}>
                            — {l.meta.full_name} ({l.meta.email})
                            {l.meta.role && (
                              <span style={{ 
                                marginLeft: 4, 
                                padding: '2px 6px', 
                                background: l.meta.role === 'admin' ? '#e74c3c' : l.meta.role === 'provider' ? '#3498db' : '#27ae60',
                                color: 'white',
                                borderRadius: 3,
                                fontSize: '0.75rem',
                                textTransform: 'capitalize'
                              }}>
                                {l.meta.role}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                      {l.meta && Object.keys(l.meta).length > 0 && (
                        <details style={{ marginTop: 8 }}>
                          <summary style={{ 
                            cursor: 'pointer', 
                            color: '#666', 
                            fontSize: '0.85rem',
                            userSelect: 'none'
                          }}>
                            View Details
                          </summary>
                          <pre style={{ 
                            marginTop: 8, 
                            padding: 12, 
                            background: '#f5f5f5', 
                            borderRadius: 6,
                            overflow: 'auto',
                            fontSize: '0.85rem',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}>
                            {JSON.stringify(l.meta, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
