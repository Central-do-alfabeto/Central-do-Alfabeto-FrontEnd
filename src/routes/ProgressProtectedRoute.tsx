import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthSession } from '../store/auth';
import { currentPhaseIndex, inGameFlow } from '../store/gameState';
import { isGameComplete } from '../store/gameConstants';
import { GAME_COMPLETE_ROUTE } from '../utils/phaseFlow';

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

  // Todas as letras já foram concluídas: nenhuma atividade de fase existe mais.
  if (isGameComplete(currentPhaseIndex)) {
    return <Navigate to={GAME_COMPLETE_ROUTE} replace />;
  }

  return <>{children}</>;
}