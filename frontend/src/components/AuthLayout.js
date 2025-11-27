import { Link } from 'react-router-dom';
import Footer from './Footer.js';

const AuthLayout = ({ children, helperText, helperLink, primaryCta }) => {
  return (
    <div className="page-shell">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
        <div>
          <strong>YangConnect</strong>
          <div style={{ fontSize: '0.9rem', color: '#5d5366' }}>Health Portal</div>
        </div>
        {primaryCta ?? (
          <Link to="/dashboard" className="primary-btn" style={{ textDecoration: 'none', maxWidth: '120px', textAlign: 'center' }}>
            Admin
          </Link>
        )}
      </header>
      <main style={{ padding: '0 2rem 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="yang-card">
          <section className="form-panel">
            {children}
            <p style={{ marginTop: '1rem', color: '#4d4457' }}>
              {helperText}{' '}
              <Link to={helperLink.to} style={{ color: '#1a8bc1', fontWeight: 600 }}>
                {helperLink.label}
              </Link>
            </p>
          </section>
          <section className="hero-panel">
            <div className="logo-badge">
              <span role="img" aria-label="Health">
                🩺
              </span>
            </div>
            <p className="brand-title">YangConnect</p>
            <p className="brand-subtitle">Health Portal</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;


