import React from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../../components/AppLayout.js';
import AdminPageHeader from '../../components/AdminPageHeader.js';

export default function AdminDashboard() {
  const tiles = [
    { label: 'Manage Events', description: 'Create and publish programs', to: '/admin/events' },
    { label: 'Manage Schedule', description: 'Adjust provider availability', to: '/admin/schedule' },
    { label: 'Appointment Management', description: 'Triage and confirm visits', to: '/admin/appointments' },
    { label: 'System Logs', description: 'Audit sign-ins & changes', to: '/admin/logs' },
    { label: 'System Settings', description: 'Branding & platform controls', to: '/admin/settings' },
    { label: 'Organizational Chart', description: 'Keep teams aligned', to: '/admin/organizational-chart' },
  ];

  return (
    <AppLayout>
      <div className="admin-panel">
        <AdminPageHeader
          title="Admin Portal"
          subtitle="YangConnect • Admin Portal"
          description="High-level access to appointments, schedules, events and audit history."
        />
        <div className="admin-card-grid">
          {tiles.map((tile) => (
            <Link key={tile.label} to={tile.to} className="admin-card-link">
              <div>
                <strong>{tile.label}</strong>
                <small>{tile.description}</small>
              </div>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
