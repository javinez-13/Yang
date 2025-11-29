import React, { useEffect, useState } from 'react';
import AppLayout from '../../components/AppLayout.js';
import { http } from '../../api/http.js';

export default function AdminSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    provider_id: '',
    day_of_week: '',
    start_time: '',
    end_time: ''
  });

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      // Load providers
      try {
        const { data: providersData } = await http.get('/admin/providers');
        setProviders(Array.isArray(providersData) ? providersData : []);
      } catch (err) {
        console.warn('Could not load providers:', err);
        setProviders([]);
      }

      // Load schedules
      try {
        const { data: scheduleData } = await http.get('/admin/schedules');
        setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
      } catch (err) {
        console.warn('Could not load schedules:', err);
        setSchedules([]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // When editing, only send time fields (provider and day cannot be changed)
        await http.put(`/admin/schedules/${editingId}`, {
          start_time: formData.start_time,
          end_time: formData.end_time
        });
      } else {
        await http.post('/admin/schedules', formData);
      }
      await loadData();
      setShowForm(false);
      setEditingId(null);
      setFormData({ provider_id: '', day_of_week: '', start_time: '', end_time: '' });
    } catch (err) {
      alert('Error saving schedule: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setFormData({
      provider_id: schedule.provider_id.toString(),
      day_of_week: schedule.day_of_week.toString(),
      start_time: schedule.start_time,
      end_time: schedule.end_time
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await http.delete(`/admin/schedules/${id}`);
      await loadData();
    } catch (err) {
      alert('Error deleting schedule: ' + (err.response?.data?.message || err.message));
    }
  };

  const getProviderName = (providerId) => {
    const provider = providers.find(p => p.id === providerId || p.id === parseInt(providerId));
    return provider ? (provider.full_name || provider.fullName) : `Provider #${providerId}`;
  };

  const getDayName = (dayOfWeek) => {
    const day = daysOfWeek.find(d => d.value === dayOfWeek);
    return day ? day.label : `Day ${dayOfWeek}`;
  };

  return (
    <AppLayout>
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2>Manage Schedule</h2>
          <button 
            className="primary-btn" 
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({ provider_id: '', day_of_week: '', start_time: '', end_time: '' });
            }}
          >
            Add Schedule
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
            <h3>{editingId ? 'Edit' : 'Add'} Schedule</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {!editingId ? (
                <>
                  <label>
                    Provider:
                    <select
                      value={formData.provider_id}
                      onChange={(e) => setFormData({ ...formData, provider_id: e.target.value })}
                      required
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    >
                      <option value="">Select Provider</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{(p.full_name || p.fullName)} ({p.email})</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Day of Week:
                    <select
                      value={formData.day_of_week}
                      onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                      required
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    >
                      <option value="">Select Day</option>
                      {daysOfWeek.map(d => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                <>
                  <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
                    <strong>Provider:</strong> {getProviderName(formData.provider_id)}
                  </div>
                  <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
                    <strong>Day:</strong> {getDayName(parseInt(formData.day_of_week))}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                    Note: Only time can be edited. Provider and day cannot be changed.
                  </p>
                </>
              )}
              <label>
                Start Time:
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                  style={{ width: '100%', padding: 8, marginTop: 4 }}
                />
              </label>
              <label>
                End Time:
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
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
                    setFormData({ provider_id: '', day_of_week: '', start_time: '', end_time: '' });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : schedules.length === 0 ? (
          <div style={{ 
            background: 'rgba(255,255,255,0.9)', 
            padding: 40, 
            borderRadius: 12, 
            textAlign: 'center' 
          }}>
            <p>No schedules found. Add a schedule to get started.</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: 10 }}>
              Note: Schedule management endpoints may need to be implemented in the backend.
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
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Provider</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Day</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Start Time</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>End Time</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(schedule => (
                  <tr key={schedule.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>{getProviderName(schedule.provider_id)}</td>
                    <td style={{ padding: 12 }}>{getDayName(schedule.day_of_week)}</td>
                    <td style={{ padding: 12 }}>{schedule.start_time}</td>
                    <td style={{ padding: 12 }}>{schedule.end_time}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          className="secondary-btn" 
                          style={{ padding: '4px 12px', fontSize: '0.9rem' }}
                          onClick={() => handleEdit(schedule)}
                        >
                          Edit
                        </button>
                        <button 
                          className="secondary-btn" 
                          style={{ padding: '4px 12px', fontSize: '0.9rem', color: '#c0392b' }}
                          onClick={() => handleDelete(schedule.id)}
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

