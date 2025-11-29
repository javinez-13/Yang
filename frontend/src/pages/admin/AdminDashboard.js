import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout.js';

export default function AdminDashboard() {
  return (
    <AppLayout>
      <div style={{ padding: 20 }}>
        <h2>Admin Dashboard</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 16, 
          marginTop: 20 
        }}>
          <Link 
            to="/admin/events" 
            style={{ 
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.9)',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>Manage Events</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Create and manage events</p>
          </Link>
          <Link 
            to="/admin/schedule" 
            style={{ 
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.9)',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>Manage Schedule</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Manage provider schedules</p>
          </Link>
          <Link 
            to="/admin/appointments" 
            style={{ 
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.9)',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>Appointment Records</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>View all appointments</p>
          </Link>
          <Link 
            to="/admin/logs" 
            style={{ 
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.9)',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>System Logs</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>View system activity logs</p>
          </Link>
          <Link 
            to="/admin/organizational-chart" 
            style={{ 
              textDecoration: 'none',
              background: 'rgba(255,255,255,0.9)',
              padding: 20,
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>Organizational Chart</h3>
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Manage organizational structure</p>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
