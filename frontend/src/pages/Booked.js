import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout.js';
import { FaPhoneAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import { http } from '../api/http.js';
import './Booked.css';

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

export default function Booked() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // expected state shape: { service, dateIso, time, id, status }
  const booking = state || null;

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
      <div className="booked-page" style={{ padding: 24 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0 }}>BOOKED</h1>
            <p style={{ margin: '6px 0 0', color: '#666' }}>Your confirmed appointment</p>
          </div>
        </header>

        <main style={{ display: 'grid', gridTemplateColumns: '280px 1fr 220px', gap: 20, marginTop: 20 }}>
          <aside style={{ background: '#f9e9e9', padding: 16, borderRadius: 12 }}>
            <h3>Booked Appointment</h3>
            <p style={{ margin: '8px 0 4px', fontWeight: 600 }}>Service Type</p>
            <div style={{ background: '#fff', padding: 10, borderRadius: 8 }}>
              <p style={{ margin: 0 }}>{booking?.service ?? '—'}</p>
            </div>
          </aside>

          <section style={{ background: '#fff', padding: 18, borderRadius: 12 }}>
            <h3 style={{ marginTop: 0 }}>Booked</h3>
            {loading ? (
              <p>Loading appointments...</p>
            ) : appointments.length === 0 && !booking ? (
              <div style={{ padding: 20, color: '#666' }}>
                <p>No bookings yet. Create one from the <button onClick={() => navigate('/schedule')} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>Schedule</button> page.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {appointments.map((apt) => (
                  <div key={apt.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: '#888' }}>{formatDate(apt.appointment_date)}</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{apt.appointment_time}</div>
                      <div style={{ marginTop: 8 }}>{apt.service_type}</div>
                      {apt.provider_name && (
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Provider: {apt.provider_name}</div>
                      )}
                      <div style={{ marginTop: 8 }}>
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
                      </div>
                    </div>
                  </div>
                ))}
                {booking && !appointments.find(a => a.id === booking.id) && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, border: '1px solid #eee', borderRadius: 8, background: '#f0f8ff' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: '#888' }}>{formatDate(booking.dateIso)}</div>
                      <div style={{ fontSize: 20, fontWeight: 700 }}>{booking.time}</div>
                      <div style={{ marginTop: 8 }}>{booking.service}</div>
                      {booking.status && (
                        <div style={{ marginTop: 8 }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: 4, 
                            background: getStatusColor(booking.status) + '20',
                            color: getStatusColor(booking.status),
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            textTransform: 'capitalize'
                          }}>
                            {booking.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <aside style={{ padding: 16 }}>
            <div style={{ background: '#fff', padding: 12, borderRadius: 12, marginBottom: 12 }}>
              <h4 style={{ marginTop: 0 }}>Contact</h4>
              <p style={{ margin: 0 }}><FaPhoneAlt /> 1-800-HEALTH</p>
            </div>
            <div style={{ background: '#fff', padding: 12, borderRadius: 12 }}>
              <h4 style={{ marginTop: 0 }}>Follow</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                <FaFacebook /> <FaInstagram />
              </div>
            </div>
          </aside>
        </main>
      </div>
    </AppLayout>
  );
}
