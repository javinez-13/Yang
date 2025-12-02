import React, { useCallback, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import AdminPageHeader from '../../components/AdminPageHeader.js';
import useAutoRefresh from '../../hooks/useAutoRefresh.js';
import { http } from '../../api/http.js';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(200);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await http.get(`/admin/logs?limit=${limit}`);
      setLogs(data);
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const { lastUpdated, isRefreshing, manualRefresh } = useAutoRefresh(loadLogs, 60000);

  const handleClear = async () => {
    if (!confirm('Clear visible logs? This cannot be undone.')) return;
    try {
      await http.delete('/admin/logs');
      await loadLogs();
    } catch (err) {
      alert('Unable to clear logs: ' + (err.response?.data?.message || err.message));
    }
  };

  const refreshDescriptor = lastUpdated
    ? `Updated • ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…';

  return (
    <AppLayout>
      <div className="admin-panel">
        <AdminPageHeader
          title="System Logs"
          subtitle="Admin Portal / System Logs"
          description="Trace user sign-ins, data sync routines and platform level changes."
          actions={
            <>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                Limit
                <select
                  value={limit}
                  onChange={(event) => setLimit(Number(event.target.value))}
                  style={{ padding: '4px 8px', borderRadius: 12, border: '1px solid #ddd' }}
                >
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={500}>500</option>
                </select>
              </label>
              <div className="refresh-pill">⟳ {isRefreshing ? 'Refreshing…' : refreshDescriptor}</div>
              <button className="secondary-btn" onClick={manualRefresh}>
                Refresh
              </button>
              <button className="secondary-btn" style={{ background: '#ffe0e0', color: '#7a1d20' }} onClick={handleClear}>
                Clear logs
              </button>
            </>
          }
        />

        {loading ? (
          <p>Loading log entries…</p>
        ) : logs.length === 0 ? (
          <p>No logs found.</p>
        ) : (
          <div className="admin-panel" style={{ marginBottom: 0, maxHeight: '70vh', overflowY: 'auto' }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 180, fontWeight: 600, color: '#6c5a67' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong>{log.message}</strong>
                    {log.meta?.full_name && (
                      <span className="page-note" style={{ marginLeft: 6 }}>
                        — {log.meta.full_name} ({log.meta.email})
                      </span>
                    )}
                    {log.meta?.role && (
                      <span className="status-chip status-chip--confirmed" style={{ marginLeft: 8, textTransform: 'capitalize' }}>
                        {log.meta.role}
                      </span>
                    )}
                    {log.meta && Object.keys(log.meta).length > 0 && (
                      <details style={{ marginTop: 8 }}>
                        <summary className="page-note" style={{ cursor: 'pointer' }}>
                          View payload
                        </summary>
                        <pre
                          style={{
                            marginTop: 8,
                            padding: 12,
                            background: '#fdf4f8',
                            borderRadius: 12,
                            overflowX: 'auto',
                          }}
                        >
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
