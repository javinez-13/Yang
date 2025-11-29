import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const AdminRoute = ({ children }) => {
  const { token, loading, user } = useAuth();

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default AdminRoute;
