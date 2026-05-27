import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const AdminRoute: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
};
