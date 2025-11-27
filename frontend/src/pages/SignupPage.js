import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.js';
import useAuth from '../hooks/useAuth.js';

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    contactNumber: '',
    age: '',
    agree: true,
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.agree) {
      setError('Please agree to the Terms of Service to continue.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);
      await signup({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        address: form.address || undefined,
        contactNumber: form.contactNumber || undefined,
        age: form.age ? Number(form.age) : undefined,
      });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign up');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout helperText="Already registered?" helperLink={{ label: 'Log in', to: '/login' }}>
      <div>
        <h2 style={{ margin: '0 0 0.35rem' }}>Create Your Account</h2>
        <p style={{ margin: 0, color: '#5f5365' }}>Complete the form to access the YangConnect health portal.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input className="input-field" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} required />
        <input className="input-field" placeholder="Email Address" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
        <input className="input-field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required minLength={8} />
        <input className="input-field" placeholder="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} required />
        <input className="input-field" placeholder="Address" value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
        <input className="input-field" placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm((prev) => ({ ...prev, contactNumber: e.target.value }))} />
        <input className="input-field" placeholder="Age" type="number" value={form.age} onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))} min={1} max={120} />
        <label className="checkbox-row">
          <input type="checkbox" checked={form.agree} onChange={(e) => setForm((prev) => ({ ...prev, agree: e.target.checked }))} />
          <span>I agree the Terms of Service and Privacy Policy</span>
        </label>
        {error && <div style={{ color: '#c0392b', fontWeight: 600 }}>{error}</div>}
        <div className="dual-actions">
          <button type="submit" className="primary-btn" disabled={submitting} style={{ flex: 1 }}>
            {submitting ? 'Creating account…' : 'Sign In'}
          </button>
          <button type="button" className="secondary-btn" style={{ flex: 1 }} onClick={() => navigate('/login')}>
            Log In
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;


