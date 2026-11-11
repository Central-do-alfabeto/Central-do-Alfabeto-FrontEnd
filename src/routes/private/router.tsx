import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isDemoMode } from '../../config/env';
import Login from '../../pages/login/Login'
import Index from '../../pages/index/Index';
import PlayerMenu from '../../pages/player-menu/PlayerMenu';
import Register from '../../pages/register/Register';
import EducatorDashboard from '../../pages/educator-dashboard/EducatorDashboard';
import GameSectionSpeech from '../../pages/game-sections/GameSectionSpeech';
import GameSectionMultipleChoice from '../../pages/game-sections/GameSectionMultipleChoice';
import GameSectionFinal from '../../pages/game-sections/GameSectionFinal';
import GameSectionSpeechSyllable from '../../pages/game-sections/GameSectionSpeechSyllable';
import GameConfig from '../../pages/game-configurations/GameConfig';
import GameSectionCongratulations from '../../pages/game-sections/GameSectionCongratulations';
import GameSectionPresentation from '../../pages/game-sections/GameSectionPresentation';
import FirstPresentationSection from '../../pages/first-presentation-section/FirstPresentationSection';
import GameComplete from '../../pages/game-complete/GameComplete';
import NotFound from '../../pages/not-found/NotFound';
import ProtectedRoute from '../ProtectedRoute';
import ProgressProtectedRoute from '../ProgressProtectedRoute';

// Em subcaminhos (GitHub Pages) o BASE_URL termina com "/"; o basename do roteador não deve.
const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export function Router() {
  // Modo demonstração (sem backend): entra direto no jogo; contas e painel do educador não existem.
  const demo = isDemoMode();
  const toGame = <Navigate to="/PlayerMenu" replace />;

  return (
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Routes>
        <Route path="/" element={demo ? toGame : <Index/>}/>
        <Route path="/Login" element={demo ? toGame : <Login/>}/>
        <Route path="/Register" element={demo ? toGame : <Register/>}/>
        <Route path="/PlayerMenu" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <PlayerMenu/>
          </ProtectedRoute>
        }/>
        <Route path="/EducatorDashboard" element={
          <ProtectedRoute allowedRoles={['EDUCATOR']}>
            <EducatorDashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/GameConfig" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <GameConfig/>
          </ProtectedRoute>
        }/>
        <Route path="/FirstPresentationSection" element={
          <ProgressProtectedRoute>
            <FirstPresentationSection/>
          </ProgressProtectedRoute>
        }/>
        <Route path="/GameSectionPresentation" element={
          <ProgressProtectedRoute>
            <GameSectionPresentation/>
          </ProgressProtectedRoute>
        }/>
        <Route path="/GameSectionSpeech" element={
          <ProgressProtectedRoute>
            <GameSectionSpeech/>
          </ProgressProtectedRoute>
        }/>
        <Route path="/GameSectionMultipleChoice" element={
          <ProgressProtectedRoute>
            <GameSectionMultipleChoice/>
          </ProgressProtectedRoute>
        }/>
        <Route path="/GameSectionSpeechSyllable" element={
          <ProgressProtectedRoute>
            <GameSectionSpeechSyllable/>
          </ProgressProtectedRoute>
        }/>
        <Route path="/GameSectionFinal" element={
          <ProgressProtectedRoute>
            <GameSectionFinal/>
          </ProgressProtectedRoute>
        }/>
        <Route path="/GameSectionCongratulations" element={
          <ProgressProtectedRoute>
            <GameSectionCongratulations/>
          </ProgressProtectedRoute>
        }/>
        <Route path="/GameComplete" element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <GameComplete/>
          </ProtectedRoute>
        }/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}