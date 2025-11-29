import Footer from './Footer.js';
import useAuth from '../hooks/useAuth.js';
import { Link, useNavigate } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout gradient-bg">
      <div className="app-shell">
        <div className="top-nav">
          <div>
            <h2 style={{ margin: 0 }}>YangConnect Health Portal</h2>
            <p style={{ margin: 0, color: '#5a4f62' }}>Always-On patient assistance</p>
          </div>
          <div className="user-pill">
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.fullName?.[0] ?? 'Y'}
            </div>
            <div>
              <strong>{user?.fullName}</strong>
              <div style={{ fontSize: '0.85rem', color: '#5a4f62' }}>{user?.email}</div>
            </div>
            <button className="secondary-btn" style={{ padding: '0.35rem 1rem' }} onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="secondary-btn" style={{ textDecoration: 'none', textAlign: 'center', flex: '0 0 auto' }}>
            Dashboard
          </Link>
          <Link to="/profile" className="secondary-btn" style={{ textDecoration: 'none', textAlign: 'center', flex: '0 0 auto' }}>
            Profile
          </Link>
        </nav>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;


