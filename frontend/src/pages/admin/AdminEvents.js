import React, { useCallback, useMemo, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import AdminPageHeader from '../../components/AdminPageHeader.js';
import useAutoRefresh from '../../hooks/useAutoRefresh.js';
import { http } from '../../api/http.js';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/admin/events');
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const { lastUpdated, isRefreshing, manualRefresh } = useAutoRefresh(load, 60000);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await http.put(`/admin/events/${editingId}`, formData);
      } else {
        await http.post('/admin/events', formData);
      }
      await load();
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', description: '', event_date: '', location: '' });
    } catch (err) {
      alert('Error saving event: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (event) => {
    setEditingId(event.id);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date.split('T')[0],
      location: event.location || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await http.delete(`/admin/events/${id}`);
      await load();
    } catch (err) {
      alert('Error deleting event: ' + (err.response?.data?.message || err.message));
    }
  };

  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => new Date(event.event_date) >= new Date())
        .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
        .slice(0, 4),
    [events]
  );

  const refreshDescriptor = lastUpdated
    ? `Updated • ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Syncing…';

  return (
    <AppLayout>
      <div className="admin-panel">
        <AdminPageHeader
          title="Events"
          subtitle="Admin Portal / Events"
          description="Curate vaccination drives, health fairs and internal gatherings."
          actions={
            <>
              <div className="refresh-pill">⟳ {isRefreshing ? 'Refreshing…' : refreshDescriptor}</div>
              <button
                className="secondary-btn"
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData({ title: '', description: '', event_date: '', location: '' });
                }}
              >
                Add Event
              </button>
              <button className="secondary-btn" onClick={manualRefresh}>
                Refresh
              </button>
            </>
          }
        />

        {showForm && (
          <div className="admin-panel" style={{ marginTop: 0 }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit event' : 'Add new event'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label>
                Title
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                  required
                  className="input-field"
                />
              </label>
              <label>
                Description
                <textarea
                  value={formData.description}
                  onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                  rows={3}
                  className="input-field"
                  style={{ minHeight: 80 }}
                />
              </label>
              <label>
                Event Date
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(event) => setFormData({ ...formData, event_date: event.target.value })}
                  required
                  className="input-field"
                />
              </label>
              <label>
                Location
                <input
                  type="text"
                  value={formData.location}
                  onChange={(event) => setFormData({ ...formData, location: event.target.value })}
                  className="input-field"
                />
              </label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button type="submit" className="primary-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: '', description: '', event_date: '', location: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading events…</p>
        ) : events.length === 0 ? (
          <p>No events found. Add an event to get started.</p>
        ) : (
          <div className="admin-split">
            <div className="admin-panel" style={{ marginBottom: 0 }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>
                        <strong>{event.title}</strong>
                      </td>
                      <td>{event.description || '—'}</td>
                      <td>{new Date(event.event_date).toLocaleDateString()}</td>
                      <td>{event.location || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="secondary-btn" onClick={() => handleEdit(event)}>
                            Edit
                          </button>
                          <button
                            className="secondary-btn"
                            style={{ color: '#c0392b' }}
                            onClick={() => handleDelete(event.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="side-panel">
              <h3>Upcoming Events</h3>
              <p className="page-note">Auto-refresh keeps stakeholders in sync.</p>
              <div className="upcoming-list">
                {upcomingEvents.length === 0 && <p>No scheduled events.</p>}
                {upcomingEvents.map((item) => (
                  <div key={item.id} className="upcoming-item">
                    <strong>{item.title}</strong>
                    <div className="page-note">
                      {new Date(item.event_date).toLocaleDateString()} · {item.location || 'To be announced'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="calendar-shell">
                <strong>
                  {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                </strong>
                <p className="page-note">Events sync to staff calendars every hour.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
