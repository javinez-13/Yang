import { useState } from 'react';
import AuthLayout from '../components/AuthLayout.js';
import { http } from '../api/http.js';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      await http.post('/auth/request-password-reset', { email });
      setStatus({ type: 'success', message: 'Check your inbox for reset instructions.' });
      setEmail('');
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'We could not process that request yet. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      helperText="Remembered your password?"
      helperLink={{ label: 'Back to login', to: '/login' }}
      backFallback="/login"
    >
      <div>
        <h2 style={{ margin: '0 0 0.35rem' }}>Reset your password</h2>
        <p style={{ margin: 0, color: '#5f5365' }}>
          Enter the email associated with your account and we will send a secure reset link.
        </p>
      </div>

      {status && (
        <div
          style={{
            padding: '0.85rem 1rem',
            borderRadius: 16,
            background: status.type === 'success' ? '#e3faf3' : '#ffe9ec',
            color: status.type === 'success' ? '#17694e' : '#a03a47',
            fontWeight: 600,
          }}
        >
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          <input
            className="input-field"
            placeholder="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <button type="submit" className="primary-btn" disabled={submitting}>
          {submitting ? 'Requesting reset' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
