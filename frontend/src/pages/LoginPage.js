import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.js';
import useAuth from '../hooks/useAuth.js';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', agree: true });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.agree) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }
    try {
      setError(null);
      setSubmitting(true);
      await login({ email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Unable to log in';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      helperText="Do not have an account?"
      helperLink={{ label: 'Sign up', to: '/signup' }}
      showBackButton={false}
    >
      <div>
        <h2 style={{ margin: '0 0 0.35rem' }}>Already have an Account?</h2>
        <p style={{ margin: 0, color: '#5f5365' }}>Sign in to access the YangConnect health portal.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          <input
            className="input-field"
            placeholder="Email Address"
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
          <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ color: '#1a8bc1', fontWeight: 600, textDecoration: 'none' }}>
              Forgot password?
            </Link>
          </div>
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={form.agree} onChange={(e) => setForm((prev) => ({ ...prev, agree: e.target.checked }))} />
          <span>I agree the Terms of Service and Privacy Policy</span>
        </label>
        {error && (
          <div style={{ color: '#c0392b', fontWeight: 600 }}>
            {error}
          </div>
        )}
        <div className="dual-actions">
          <button type="submit" className="primary-btn" disabled={submitting} style={{ flex: 1 }}>
            {submitting ? 'Signing in…' : 'Log In'}
          </button>
          <button type="button" className="secondary-btn" style={{ flex: 1 }} onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
