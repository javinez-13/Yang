import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout.js';
import { http } from '../api/http.js';

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const { data } = await http.get('/appointments/my-appointments');
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading appointments:', err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    loadAppointments();
  }, []);

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
        <h2>My Appointments</h2>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 40, 
            borderRadius: 12, 
            textAlign: 'center' 
          }}>
            <p>No appointments scheduled.</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: 10 }}>
              Book an appointment from the <a href="/schedule" style={{ color: '#007bff' }}>Schedule</a> page.
            </p>
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
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Service</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Provider</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}><strong>{apt.service_type}</strong></td>
                    <td style={{ padding: 12 }}>{apt.provider_name || 'N/A'}</td>
                    <td style={{ padding: 12 }}>{formatDate(apt.appointment_date)}</td>
                    <td style={{ padding: 12 }}>{apt.appointment_time}</td>
                    <td style={{ padding: 12 }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: 4, 
                        background: getStatusColor(apt.status) + '20',
                        color: getStatusColor(apt.status),
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        textTransform: 'capitalize'
                      }}>
                        {apt.status}
                      </span>
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

export default Appointments;
