import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout.js';
import { http } from '../../api/http.js';

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: '',
    siteEmail: '',
    maintenanceMode: false,
    maxAppointmentsPerDay: 10,
    appointmentDuration: 30,
    allowSelfRegistration: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from an API endpoint
      // For now, we'll use default values
      const savedSettings = localStorage.getItem('systemSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      // In a real app, this would save to an API endpoint
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings: ' + (err.response?.data?.message || err.message) });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: 20 }}>
          <p>Loading settings...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ padding: 20 }}>
        <h2>System Settings</h2>
        
        {message && (
          <div
            style={{
              padding: 12,
              marginBottom: 20,
              borderRadius: 8,
              background: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: 'rgba(255,255,255,0.9)',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1a1a1a' }}>
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="input-field"
                placeholder="Enter site name"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1a1a1a' }}>
                Site Email
              </label>
              <input
                type="email"
                value={settings.siteEmail}
                onChange={(e) => handleChange('siteEmail', e.target.value)}
                className="input-field"
                placeholder="admin@example.com"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1a1a1a' }}>
                Max Appointments Per Day
              </label>
              <input
                type="number"
                value={settings.maxAppointmentsPerDay}
                onChange={(e) => handleChange('maxAppointmentsPerDay', parseInt(e.target.value) || 0)}
                className="input-field"
                min="1"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: '#1a1a1a' }}>
                Default Appointment Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.appointmentDuration}
                onChange={(e) => handleChange('appointmentDuration', parseInt(e.target.value) || 0)}
                className="input-field"
                min="15"
                step="15"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                style={{ width: 20, height: 20, cursor: 'pointer' }}
              />
              <label htmlFor="maintenanceMode" style={{ fontWeight: 600, color: '#1a1a1a', cursor: 'pointer' }}>
                Maintenance Mode
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="checkbox"
                id="allowSelfRegistration"
                checked={settings.allowSelfRegistration}
                onChange={(e) => handleChange('allowSelfRegistration', e.target.checked)}
                style={{ width: 20, height: 20, cursor: 'pointer' }}
              />
              <label htmlFor="allowSelfRegistration" style={{ fontWeight: 600, color: '#1a1a1a', cursor: 'pointer' }}>
                Allow Self Registration
              </label>
            </div>

            <div style={{ marginTop: 8 }}>
              <button
                type="submit"
                className="primary-btn"
                disabled={saving}
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

