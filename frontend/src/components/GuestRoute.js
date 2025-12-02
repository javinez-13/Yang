import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const GuestRoute = ({ children }) => {
  const { token, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#1a8bc1', fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  // If user is already authenticated, redirect based on role
  if (token) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;

