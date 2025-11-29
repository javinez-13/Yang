import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.js';
import useAuth from '../hooks/useAuth.js';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@yangconnect.com', password: 'admin1234', agree: true });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setError(null);
      setSubmitting(true);
      await login({ email: form.email, password: form.password });
      // attempt to go to admin dashboard; AdminRoute will redirect if not admin
      navigate('/admin');
    } catch (err) {
      // Try to extract a helpful message from axios/server error
      const message = err?.response?.data?.message || err?.message || 'Unable to log in';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout helperText="Back to user login" helperLink={{ label: 'User Login', to: '/login' }}>
      <div>
        <h2 style={{ margin: '0 0 0.35rem' }}>Admin Sign In</h2>
        <p style={{ margin: 0, color: '#5f5365' }}>Sign in with your admin account to manage the portal.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          <input
            className="input-field"
            placeholder="Admin Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
        </label>
        <label>
          <input
            className="input-field"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
        </label>
        {error && (
          <div style={{ color: '#c0392b', fontWeight: 600 }}>{error}</div>
        )}
        <div className="dual-actions">
          <button type="submit" className="primary-btn" disabled={submitting} style={{ flex: 1 }}>
            {submitting ? 'Signing in…' : 'Admin Log In'}
          </button>
        </div>
        <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
          Tip: Use email <strong>admin@yangconnect.com</strong> and password <strong>admin1234</strong> for the seeded admin account.
        </div>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
