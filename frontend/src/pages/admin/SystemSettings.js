import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout.js';

export default function SystemSettings() {
  const navigate = useNavigate();

  const navigationItems = useMemo(
    () => [
      { title: 'System Logs', subtitle: 'Security & audit history', to: '/admin/logs' },
      { title: 'Appointment Management', subtitle: 'Confirm & manage visits', to: '/admin/appointments' },
      { title: 'Events', subtitle: 'Hospital-wide announcements', to: '/admin/events' },
      { title: 'Schedule', subtitle: 'Provider availability grid', to: '/admin/schedule' },
      { title: 'Organizational Chart', subtitle: 'Teams & reporting lines', to: '/admin/organizational-chart' },
    ],
    []
  );

  return (
    <AppLayout>
      <div
        style={{
          minHeight: 'calc(100vh - 160px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '32px 16px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 880,
            background: 'rgba(255,255,255,0.96)',
            borderRadius: 28,
            boxShadow: '0 26px 60px rgba(0,0,0,0.12)',
            padding: '20px 28px 16px',
          }}
        >
          {/* Header bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 12, color: '#9b8c9f' }}>YangConnect / Admin Portal / System Settings</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: '#4d3f51', fontSize: 18 }}>
              <span aria-hidden="true">⚙️</span>
              <span aria-hidden="true">👤</span>
            </div>
          </div>

          {/* Title strip */}
          <div
            style={{
              borderRadius: 18,
              background: '#f7f2f5',
              padding: '10px 18px',
              marginBottom: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 14,
            }}
          >
            <span style={{ fontWeight: 600, color: '#4b3a4e' }}>System Settings</span>
            <span style={{ fontSize: 11, color: '#9b8c9f' }}>Tap a row to open its admin panel</span>
          </div>

          {/* Settings list */}
          <div
            style={{
              borderRadius: 18,
              overflow: 'hidden',
              border: '1px solid #efe1ea',
              background: '#ffffff',
            }}
          >
            {navigationItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => navigate(item.to)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '11px 18px',
                  border: 'none',
                  borderBottom:
                    index === navigationItems.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.04)',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#4b3a4e' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#a397aa', marginTop: 2 }}>{item.subtitle}</div>
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '1px solid #e0cedb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    color: '#b08aa6',
                    background: '#faf4f7',
                  }}
                >
                  ›
                </div>
              </button>
            ))}
          </div>

          {/* Footer strip inside card */}
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 10,
              color: '#a397aa',
            }}
          >
            <span>24/7 Hotline • 1-800-HEALTH (432584)</span>
            <span>yangconnect-admin@portal.com</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
