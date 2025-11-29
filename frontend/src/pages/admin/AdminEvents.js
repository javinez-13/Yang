import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
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
    location: ''
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await http.get('/admin/events');
      setEvents(data);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <AppLayout>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>Manage Events</h2>
          <button 
            className="primary-btn" 
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ title: '', description: '', event_date: '', location: '' });
            }}
          >
            Add Event
          </button>
        </div>

        {showForm && (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 20, 
            borderRadius: 12, 
            marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3>{editingId ? 'Edit' : 'Add'} Event</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label>
                Title:
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </label>
              <label>
                Description:
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </label>
              <label>
                Event Date:
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </label>
              <label>
                Location:
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="primary-btn">Save</button>
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
          <p>Loading…</p>
        ) : events.length === 0 ? (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 40, 
            borderRadius: 12, 
            textAlign: 'center' 
          }}>
            <p>No events found. Add an event to get started.</p>
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
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Title</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Description</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Location</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}><strong>{event.title}</strong></td>
                    <td style={{ padding: 12 }}>{event.description || '—'}</td>
                    <td style={{ padding: 12 }}>{new Date(event.event_date).toLocaleDateString()}</td>
                    <td style={{ padding: 12 }}>{event.location || '—'}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          className="secondary-btn" 
                          style={{ padding: '4px 12px', fontSize: '0.9rem' }}
                          onClick={() => handleEdit(event)}
                        >
                          Edit
                        </button>
                        <button 
                          className="secondary-btn" 
                          style={{ padding: '4px 12px', fontSize: '0.9rem', color: '#c0392b' }}
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
        )}
      </div>
    </AppLayout>
  );
}
