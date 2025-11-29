import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import { http } from '../../api/http.js';

export default function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/admin/appointments');
      setRows(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await http.put(`/admin/appointments/${id}/status`, { status: newStatus });
      await loadAppointments();
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'completed': return '#3498db';
      case 'cancelled': return '#e74c3c';
      default: return '#666';
    }
  };

  return (
    <AppLayout>
      <div style={{ padding: 20 }}>
        <h2>Appointment Records</h2>
        {loading ? (
          <p>Loading...</p>
        ) : rows.length === 0 ? (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 40, 
            borderRadius: 12, 
            textAlign: 'center' 
          }}>
            <p>No appointments found.</p>
          </div>
        ) : (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            borderRadius: 12, 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Patient</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Provider</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Service</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>{r.id}</td>
                    <td style={{ padding: 12 }}><strong>{r.patient_name || 'N/A'}</strong></td>
                    <td style={{ padding: 12 }}>{r.provider_name || 'N/A'}</td>
                    <td style={{ padding: 12 }}>{r.service_type || 'N/A'}</td>
                    <td style={{ padding: 12 }}>{new Date(r.appointment_date).toLocaleDateString()}</td>
                    <td style={{ padding: 12 }}>{r.appointment_time}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        background: getStatusColor(r.status) + '20',
                        color: getStatusColor(r.status),
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textTransform: 'capitalize'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {r.status === 'pending' && (
                          <>
                            <button
                              className="primary-btn"
                              style={{ 
                                padding: '6px 16px', 
                                fontSize: '0.85rem',
                                background: '#27ae60',
                                border: 'none',
                                borderRadius: 4,
                                color: 'white',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleStatusChange(r.id, 'confirmed')}
                            >
                              Accept
                            </button>
                            <button
                              className="secondary-btn"
                              style={{ 
                                padding: '6px 16px', 
                                fontSize: '0.85rem',
                                background: '#e74c3c',
                                border: 'none',
                                borderRadius: 4,
                                color: 'white',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleStatusChange(r.id, 'cancelled')}
                            >
                              Deny
                            </button>
                          </>
                        )}
                        <select
                          value={r.status}
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          style={{ 
                            padding: '4px 8px', 
                            borderRadius: 4, 
                            border: '1px solid #ddd',
                            fontSize: '0.9rem',
                            minWidth: 120
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
