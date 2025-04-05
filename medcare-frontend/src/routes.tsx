// src/routes.tsx
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import NotFound from './pages/error/NotFound';
import Unauthorized from './pages/error/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import DoctorManagement from './pages/admin/DoctorManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import Reports from './pages/admin/Reports';

// Receptionist pages
import ReceptionistDashboard from './pages/receptionist/Dashboard';
import AppointmentManagement from './pages/receptionist/AppointmentManagement';

// Auth provider hook
import useAuth from './hooks/useAuth';

// Import the UserRole enum
import { UserRole } from './types/user.types';

// Auth guard component
interface AuthGuardProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user && !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Route configurations
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/admin',
    element: (
      <AuthGuard allowedRoles={[UserRole.ADMIN]}>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'users', element: <UserManagement /> },
      { path: 'doctors', element: <DoctorManagement /> },
      { path: 'services', element: <ServiceManagement /> },
      { path: 'reports', element: <Reports /> },
    ],
  },
  {
    path: '/receptionist',
    element: (
      <AuthGuard allowedRoles={[UserRole.RECEPTIONIST, UserRole.ADMIN]}>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      { path: '', element: <Navigate to="dashboard" /> },
      { path: 'dashboard', element: <ReceptionistDashboard /> },
      { path: 'appointments', element: <AppointmentManagement /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];