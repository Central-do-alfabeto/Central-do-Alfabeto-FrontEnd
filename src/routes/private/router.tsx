import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../../pages/login/Login'
import Index from '../../pages/index/Index';
import PlayerMenu from '../../pages/player-menu/PlayerMenu';
import Register from '../../pages/register/Register';
import TeacherMenu from '../../pages/teacher-menu/TeacherMenu';
import GameSectionSpeech from '../../pages/game-sections/GameSectionSpeech';
import GameSectionMultipleChoice from '../../pages/game-sections/GameSectionMultipleChoice';
import GameSectionFinal from '../../pages/game-sections/GameSectionFinal';
import GameSectionSpeechSyllable from '../../pages/game-sections/GameSectionSpeechSyllable';
import GameConfig from '../../pages/game-configurations/GameConfig';
import GameSectionCongratulations from '../../pages/game-sections/GameSectionCongratulations';
import GameSectionPresentation from '../../pages/game-sections/GameSectionPresentation';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/PlayerMenu" element={<PlayerMenu/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path="/TeacherMenu" element={<TeacherMenu/>}/>
        <Route path="/GameSectionPresentation" element={<GameSectionPresentation/>}/>
        <Route path="/GameSectionSpeech" element={<GameSectionSpeech/>}/>
        <Route path="/GameSectionMultipleChoice" element={<GameSectionMultipleChoice/>}/>
        <Route path="/GameSectionSpeechSyllable" element={<GameSectionSpeechSyllable/>}/>
        <Route path="/GameSectionFinal" element={<GameSectionFinal/>}/>
        <Route path="/GameSectionCongratulations" element={<GameSectionCongratulations/>}/>
        <Route path="/GameConfig" element={<GameConfig/>}/>
      </Routes>
    </BrowserRouter>
  );
}