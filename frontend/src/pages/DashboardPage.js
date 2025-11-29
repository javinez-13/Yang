import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import AppLayout from '../components/AppLayout.js';
import { http } from '../api/http.js';
import useAuth from '../hooks/useAuth.js';

const cardPalette = ['#b9f1c4', '#cbe8ff', '#dbceff', '#ffcab9', '#ffe8af'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const { data } = await http.get('/dashboard/summary');
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load dashboard');
      }
    };
    loadSummary();
  }, []);

  const linkMap = {
    "Organizational Chart": "/organizational-chart",
    "Events": "/events",
    "Schedule": "/schedule",
    "Appointment": "/booked"
  };

  return (
    <AppLayout>
      <section style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '28px', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Welcome back, {user?.fullName?.split(' ')[0] ?? 'Patient'}!</h2>
        <p style={{ marginTop: '0.5rem', color: '#5f5365' }}>Choose a service below to continue your journey.</p>

        {summary && (
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <div className="status-pill">Patients enrolled: {summary.totalUsers}</div>
            <div className="status-pill">Avg. age: {summary.averageAge ?? '—'}</div>
          </div>
        )}
      </section>

      {error && <p style={{ color: '#c0392b' }}>{error}</p>}

      <div className="dashboard-grid">
        {["Organizational Chart", "Events", "Schedule", "Appointment"].map((label, index) => (
          <Link
            key={label}
            to={linkMap[label]}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <article className="dashboard-card" style={{ background: cardPalette[index] }}>
              <h3>{label}</h3>

              {label === "Appointment" && summary ? (
                <div>
                  <p style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Latest Registrations</p>
                  <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                    {summary.latestUsers.map((item) => (
                      <li key={item.id} style={{ fontWeight: 600 }}>
                        {item.fullName}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p style={{ fontSize: '1rem', fontWeight: 500 }}>Tap to view details</p>
              )}
            </article>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
