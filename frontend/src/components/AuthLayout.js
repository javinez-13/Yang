import { Link } from 'react-router-dom';
import Footer from './Footer.js';
import BackButton from './BackButton.js';

const AuthLayout = ({
  children,
  helperText,
  helperLink,
  primaryCta,
  showBackButton = true,
  backFallback = '/',
}) => {
  return (
    <div className="page-shell">
      <header className="auth-header">
        <div className="auth-brand">
          <div className="auth-logo" aria-hidden="true">
            🩺
          </div>
          <div>
            <strong>YangConnect</strong>
            <div className="auth-brand-subtitle">Health Portal</div>
          </div>
        </div>
        <div className="auth-meta">
          <div className="meta-chip">24/7 Care Desk • 1-800-432-2584</div>
          <div className="meta-chip">support@yangconnect.com</div>
        </div>
        {primaryCta ?? (
          <Link
            to="/admin/login"
            className="primary-btn"
            style={{ textDecoration: 'none', maxWidth: '140px', textAlign: 'center' }}
          >
            Admin
          </Link>
        )}
      </header>
      <main className="auth-main">
        {showBackButton && <BackButton fallback={backFallback} />}
        <div className="yang-card">
          <section className="form-panel">
            {children}
            {helperText && helperLink && (
              <p className="auth-helper">
                {helperText}{' '}
                <Link to={helperLink.to} className="auth-helper-link">
                  {helperLink.label}
                </Link>
              </p>
            )}
          </section>
          <section className="hero-panel">
            <div className="logo-badge">
              <span role="img" aria-label="Health">
                🩺
              </span>
            </div>
            <p className="brand-title">YangConnect</p>
            <p className="brand-subtitle">Health Portal</p>
            <div className="auth-hero-list">
              <span>✔ Virtual consults</span>
              <span>✔ Smart scheduling</span>
              <span>✔ Admin insights</span>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;


