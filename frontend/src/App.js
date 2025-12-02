import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage.js';
import SignupPage from './pages/SignupPage.js';
import DashboardPage from './pages/DashboardPage.js';
import ProfilePage from './pages/ProfilePage.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import GuestRoute from './components/GuestRoute.js';
import OrganizationalChart from "./pages/OrganizationalChart";
import Events from './pages/Events.js';
import Schedule from './pages/Schedule.js';
import Appointments from './pages/Appointment.js';
import { AuthProvider } from './context/AuthContext.js';
import Booked from './pages/Booked.js';
import AdminRoute from './components/AdminRoute.js';
import AdminDashboard from './pages/admin/AdminDashboard.js';
import AdminEvents from './pages/admin/AdminEvents.js';
import AdminSchedule from './pages/admin/AdminSchedule.js';
import AdminAppointments from './pages/admin/AdminAppointments.js';
import AdminLogs from './pages/admin/AdminLogs.js';
import AdminOrganizationalChart from './pages/admin/AdminOrganizationalChart.js';
import AdminLogin from './pages/AdminLogin.js';
import ForgotPasswordPage from './pages/ForgotPasswordPage.js';
import SystemSettings from './pages/admin/SystemSettings.js';

function App() {
  return (
    <AuthProvider>
    <div className="gradient-bg">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizational-chart"
          element={
            <ProtectedRoute>
              <OrganizationalChart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <Schedule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointment"
        element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booked"
        element={
          <ProtectedRoute>
            <Booked />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
        <Route
          path="/admin/login"
          element={
            <GuestRoute>
              <AdminLogin />
            </GuestRoute>
          }
        />
      <Route
        path="/admin/events"
        element={
          <AdminRoute>
            <AdminEvents />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/schedule"
        element={
          <AdminRoute>
            <AdminSchedule />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/organizational-chart"
        element={
          <AdminRoute>
            <AdminOrganizationalChart />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <AdminRoute>
            <AdminAppointments />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <AdminRoute>
            <AdminLogs />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <SystemSettings />
          </AdminRoute>
        }
      />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
    </AuthProvider>
  );
}

export default App;


