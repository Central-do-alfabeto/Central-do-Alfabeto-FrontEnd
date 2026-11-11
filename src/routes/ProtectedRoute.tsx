import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthSession } from '../store/auth';
import { isDemoMode } from '../config/env';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  // Modo demonstração: não há contas; só as telas do jogador existem.
  if (isDemoMode()) {
    const isStudentArea = !allowedRoles || allowedRoles.includes('STUDENT');
    return isStudentArea ? <>{children}</> : <Navigate to="/PlayerMenu" replace />;
  }

  const session = getAuthSession();

  if (!session) {
    return <Navigate to="/Login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}