import React, { useCallback, useMemo, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import AdminPageHeader from '../../components/AdminPageHeader.js';
import useAutoRefresh from '../../hooks/useAutoRefresh.js';
import { http } from '../../api/http.js';

export default function AdminSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingStatusId, setSavingStatusId] = useState(null);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [editingStatusValue, setEditingStatusValue] = useState('pending');

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [rawHours, rawMinutes] = timeStr.split(':');
    const hours = parseInt(rawHours, 10);
    const minutes = rawMinutes ?? '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/appointments/all');
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading appointments for admin schedule:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const { lastUpdated, isRefreshing, manualRefresh } = useAutoRefresh(loadData, 60000);

  const refreshDescriptor = lastUpdated
    ? `Updated • ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…';

  const parseDateTime = (appointment) => {
    if (!appointment?.appointment_date || !appointment?.appointment_time) return null;
    const time = appointment.appointment_time.length === 5
      ? `${appointment.appointment_time}:00`
      : appointment.appointment_time;
    return new Date(`${appointment.appointment_date}T${time}`);
  };

  const todaySummary = useMemo(() => {
    const now = new Date();

    const withDate = appointments
      .map((appt) => ({ ...appt, _dt: parseDateTime(appt) }))
      .filter(
        (appt) =>
          appt._dt instanceof Date &&
          !Number.isNaN(appt._dt.getTime()),
      )
      .sort((a, b) => a._dt.getTime() - b._dt.getTime());

    let previous = 0;
    let current = 0;
    let upcoming = 0;

    const THIRTY_MIN = 30 * 60 * 1000;

    withDate.forEach((appt) => {
      const diff = appt._dt.getTime() - now.getTime();
      if (diff < -THIRTY_MIN) {
        previous += 1;
      } else if (Math.abs(diff) <= THIRTY_MIN) {
        current += 1;
      } else {
        upcoming += 1;
      }
    });

    return {
      previous,
      current,
      upcoming,
      list: withDate,
    };
  }, [appointments]);

  const getStatusLabelAndColor = (appt) => {
    const now = new Date();
    const dt = parseDateTime(appt);
    if (!dt) return { label: appt.status || 'Unknown', color: '#7f8c8d' };

    const THIRTY_MIN = 30 * 60 * 1000;
    const diff = dt.getTime() - now.getTime();

    if (diff < -THIRTY_MIN) {
      return { label: 'Previous', color: '#7f8c8d' };
    }
    if (Math.abs(diff) <= THIRTY_MIN) {
      return { label: 'Current', color: '#27ae60' };
    }
    return { label: 'Upcoming', color: '#2980b9' };
  };

  const startEditingStatus = (appt) => {
    setEditingStatusId(appt.id);
    setEditingStatusValue(appt.status || 'pending');
  };

  const cancelEditingStatus = () => {
    setEditingStatusId(null);
    setEditingStatusValue('pending');
  };

  const saveStatus = async () => {
    if (!editingStatusId) return;
    setSavingStatusId(editingStatusId);
    try {
      const { data } = await http.patch(`/appointments/${editingStatusId}/status`, {
        status: editingStatusValue,
      });
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === data.id ? { ...appt, ...data } : appt)),
      );
      cancelEditingStatus();
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingStatusId(null);
    }
  };

  const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <AppLayout>
      <div className="admin-panel">
        <AdminPageHeader
          title="Schedule"
          subtitle="Admin Portal / Schedule"
          description="View all patient appointments in real-time and quickly manage the schedule."
          actions={
            <>
              <div className="refresh-pill">⟳ {isRefreshing ? 'Refreshing…' : refreshDescriptor}</div>
              <button className="secondary-btn" onClick={manualRefresh}>
                Refresh
              </button>
              <button className="primary-btn" style={{ marginLeft: 8 }}>
                Edit Schedule
              </button>
            </>
          }
        />

        <div className="admin-panel" style={{ marginTop: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <button
                className="secondary-btn"
                style={{
                  borderRadius: 999,
                  paddingInline: 24,
                  background: '#eef5ff',
                  color: '#222',
                }}
              >
                Today
              </button>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                fontSize: '0.9rem',
              }}
            >
              <div>
                <strong>Previous</strong>: {todaySummary.previous}
              </div>
              <div>
                <strong>Current</strong>: {todaySummary.current}
              </div>
              <div>
                <strong>Upcoming</strong>: {todaySummary.upcoming}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>Loading schedule…</div>
        ) : todaySummary.list.length === 0 ? (
          <div className="admin-panel" style={{ marginTop: 16 }}>
            <p>No appointments scheduled.</p>
          </div>
        ) : (
          <div className="admin-panel" style={{ marginTop: 16 }}>
            <div
              style={{
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: 600,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: '#fdf4f7',
                      textAlign: 'left',
                    }}
                  >
                    <th style={{ padding: 12, fontWeight: 600 }}>Time</th>
                    <th style={{ padding: 12, fontWeight: 600 }}>Patient</th>
                    <th style={{ padding: 12, fontWeight: 600 }}>Doctor</th>
                    <th style={{ padding: 12, fontWeight: 600 }}>Status</th>
                    <th style={{ padding: 12, fontWeight: 600 }}>When</th>
                    <th style={{ padding: 12, fontWeight: 600, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todaySummary.list.map((appt, index) => {
                    const dt = parseDateTime(appt);
                    const { label, color } = getStatusLabelAndColor(appt);
                    const isEditing = editingStatusId === appt.id;

                    return (
                      <tr
                        key={appt.id || index}
                        style={{
                          borderTop: '1px solid #f0e4ea',
                          background: index % 2 === 0 ? 'white' : '#fffafc',
                        }}
                      >
                        <td style={{ padding: 12, whiteSpace: 'nowrap' }}>
                          {dt ? formatTime(dt.toTimeString().slice(0, 5)) : '—'}
                        </td>
                        <td style={{ padding: 12 }}>{appt.patient_name || appt.patientName || '—'}</td>
                        <td style={{ padding: 12 }}>{appt.provider_name || appt.providerName || '—'}</td>
                        <td style={{ padding: 12 }}>
                          {isEditing ? (
                            <select
                              value={editingStatusValue}
                              onChange={(e) => setEditingStatusValue(e.target.value)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: 999,
                                border: '1px solid #ddd',
                                fontSize: '0.85rem',
                              }}
                            >
                              {statusOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '4px 10px',
                                borderRadius: 999,
                                background: '#eef2ff',
                                fontSize: '0.8rem',
                                textTransform: 'capitalize',
                              }}
                            >
                              {appt.status || 'pending'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: 12 }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '4px 12px',
                              borderRadius: 999,
                              background: color,
                              color: 'white',
                              fontSize: '0.78rem',
                            }}
                          >
                            {label}
                          </span>
                        </td>
                        <td style={{ padding: 12, textAlign: 'right' }}>
                          {isEditing ? (
                            <>
                              <button
                                className="secondary-btn"
                                onClick={cancelEditingStatus}
                                style={{ marginRight: 8 }}
                                disabled={savingStatusId === appt.id}
                              >
                                Cancel
                              </button>
                              <button
                                className="primary-btn"
                                onClick={saveStatus}
                                disabled={savingStatusId === appt.id}
                              >
                                {savingStatusId === appt.id ? 'Saving…' : 'Save'}
                              </button>
                            </>
                          ) : (
                            <button
                              className="secondary-btn"
                              onClick={() => startEditingStatus(appt)}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
