import React, { useCallback, useMemo, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import AdminPageHeader from '../../components/AdminPageHeader.js';
import useAutoRefresh from '../../hooks/useAutoRefresh.js';
import { http } from '../../api/http.js';

const statusClassMap = {
  pending: 'status-chip status-chip--pending',
  confirmed: 'status-chip status-chip--confirmed',
  completed: 'status-chip status-chip--completed',
  cancelled: 'status-chip status-chip--cancelled',
};

export default function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/admin/appointments');
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const { lastUpdated, isRefreshing, manualRefresh } = useAutoRefresh(loadAppointments, 45000);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await http.put(`/admin/appointments/${id}/status`, { status: newStatus });
      await loadAppointments();
    } catch (error) {
      alert('Error updating status: ' + (error.response?.data?.message || error.message));
    }
  };

  const stats = useMemo(() => {
    const base = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    rows.forEach((row) => {
      const key = row.status?.toLowerCase();
      if (base[key] !== undefined) {
        base[key] += 1;
      }
    });
    return base;
  }, [rows]);

  const today = new Date().toLocaleDateString();

  const todaysAppointments = useMemo(
    () =>
      rows.filter((row) => {
        if (!row.appointment_date) return false;
        return new Date(row.appointment_date).toLocaleDateString() === today;
      }),
    [rows, today]
  );

  const upcomingAppointments = useMemo(() => {
    return [...rows]
      .filter((row) => {
        if (!row.appointment_date) return false;
        const apptDate = new Date(row.appointment_date);
        return apptDate >= new Date();
      })
      .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
      .slice(0, 5);
  }, [rows]);

  const refreshDescriptor = lastUpdated
    ? `Updated  ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing';

  const renderStatusChip = (status) => {
    const key = status?.toLowerCase();
    const className = statusClassMap[key] || 'status-chip';
    return <span className={className}>{status || 'Unknown'}</span>;
  };

  return (
    <AppLayout>
      <div className="admin-panel">
        <AdminPageHeader
          title="Appointment Management"
          subtitle="Admin Portal / Appointment Management"
          description="Review requests, confirm timeslots and monitor outcomes in real time."
          actions={
            <>
              <div className="refresh-pill"> {isRefreshing ? 'Refreshing' : refreshDescriptor}</div>
              <button className="secondary-btn" onClick={manualRefresh}>
                Refresh
              </button>
            </>
          }
        />

        {loading ? (
          <p>Loading appointments</p>
        ) : rows.length === 0 ? (
          <div className="admin-panel" style={{ marginBottom: 0 }}>
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="admin-split">
            <div className="admin-panel" style={{ marginBottom: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Provider</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <strong>{row.patient_name || 'N/A'}</strong>
                        <p className="page-note" style={{ margin: 0 }}>{row.patient_email || row.patient_phone || ''}</p>
                      </td>
                      <td>{row.provider_name || 'N/A'}</td>
                      <td>{row.service_type || 'N/A'}</td>
                      <td>{row.appointment_date ? new Date(row.appointment_date).toLocaleDateString() : ''}</td>
                      <td>{row.appointment_time || ''}</td>
                      <td>{renderStatusChip(row.status)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {row.status === 'pending' && (
                            <>
                              <button
                                className="primary-btn"
                                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                                onClick={() => handleStatusChange(row.id, 'confirmed')}
                              >
                                Accept
                              </button>
                              <button
                                className="secondary-btn"
                                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem', background: '#ffe1e6', color: '#a12b45' }}
                                onClick={() => handleStatusChange(row.id, 'cancelled')}
                              >
                                Deny
                              </button>
                            </>
                          )}
                          <select
                            value={row.status}
                            onChange={(event) => handleStatusChange(row.id, event.target.value)}
                            style={{
                              padding: '0.45rem 0.85rem',
                              borderRadius: 14,
                              border: '1px solid #ddd',
                              fontSize: '0.9rem',
                              background: '#fff',
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

            <aside className="side-panel">
              <h3>Today&apos;s queue</h3>
              <p className="page-note">Auto-refresh keeps this view current every 45 seconds.</p>
              {todaysAppointments.length === 0 ? (
                <p style={{ marginTop: '1rem' }}>No visits scheduled for today.</p>
              ) : (
                <div className="upcoming-list">
                  {todaysAppointments.map((item) => (
                    <div key={`today-${item.id}`} className="upcoming-item">
                      <strong>{item.patient_name || 'Patient'}</strong>
                      <div className="page-note">
                        {item.appointment_time || 'TBD'}  {item.provider_name || 'Team assignment'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 style={{ marginTop: '2rem' }}>Status overview</h3>
              <div className="upcoming-list">
                {Object.entries(stats).map(([label, value]) => (
                  <div key={label} className="upcoming-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>

              <h3 style={{ marginTop: '2rem' }}>Next up</h3>
              <div className="upcoming-list">
                {upcomingAppointments.length === 0 && <p className="page-note">No upcoming records.</p>}
                {upcomingAppointments.map((item) => (
                  <div key={`upcoming-${item.id}`} className="upcoming-item">
                    <strong>{item.service_type || 'Appointment'}</strong>
                    <div className="page-note">
                      {item.appointment_date ? new Date(item.appointment_date).toLocaleDateString() : 'TBD'} {' '}
                      {item.appointment_time || 'TBD'}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
