import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthSession } from '../store/auth';
import { inGameFlow } from '../store/gameState';

interface ProgressProtectedRouteProps {
  children: ReactNode;
}

export default function ProgressProtectedRoute({ children }: ProgressProtectedRouteProps) {
  const session = getAuthSession();

  if (!session || session.role !== 'STUDENT') {
    return <Navigate to="/Login" replace />;
  }

  if (!inGameFlow) {
    return <Navigate to="/PlayerMenu" replace />;
  }

  return <>{children}</>;
}