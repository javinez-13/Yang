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

  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className="app-layout gradient-bg">
      <div className="app-shell">
        <div className="top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link 
              to={dashboardPath} 
              style={{ 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                color: '#1a1a1a',
                fontSize: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
              title="Home"
            >
              🏠
            </Link>
            <div>
              <h2 style={{ margin: 0 }}>YangConnect Health Portal</h2>
              <p style={{ margin: 0, color: '#5a4f62' }}>Always-On patient assistance</p>
            </div>
          </div>
          <div className="user-pill">
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.fullName?.[0] ?? 'Y'}
            </div>
            <Link 
              to="/profile" 
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <div>
                <strong>{user?.fullName}</strong>
                <div style={{ fontSize: '0.85rem', color: '#5a4f62' }}>{user?.email}</div>
              </div>
            </Link>
            <button className="secondary-btn" style={{ padding: '0.35rem 1rem' }} onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;


