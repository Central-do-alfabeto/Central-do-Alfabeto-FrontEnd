import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthSession } from '../store/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const session = getAuthSession();

  if (!session) {
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}