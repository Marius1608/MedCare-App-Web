// src/routes.tsx
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/auth/Login';
import NotFound from './pages/error/NotFound';
import Unauthorized from './pages/error/Unauthorized';


import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import DoctorManagement from './pages/admin/DoctorManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import Reports from './pages/admin/Reports';

import ReceptionistDashboard from './pages/receptionist/Dashboard';
import AppointmentManagement from './pages/receptionist/AppointmentManagement';

type UserRole = 'ADMIN' | 'RECEPTIONIST';

interface AuthGuardProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log("No user found in localStorage, redirecting to login");
    return <Navigate to="/login" />;
  }
  
  const user = JSON.parse(userStr);
  if (!allowedRoles.includes(user.role)) {
    console.log("User role not allowed:", user.role);
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
      <AuthGuard allowedRoles={['ADMIN']}>
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
      <AuthGuard allowedRoles={['RECEPTIONIST', 'ADMIN']}>
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