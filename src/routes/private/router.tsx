import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from '../ProtectedRoute';
import ProgressProtectedRoute from '../ProgressProtectedRoute';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Register" element={<Register/>}/>
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
      </Routes>
    </BrowserRouter>
  );
}