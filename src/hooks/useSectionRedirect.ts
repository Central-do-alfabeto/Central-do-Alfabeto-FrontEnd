import { useNavigate } from "react-router-dom";
import { currentPhaseIndex } from "../store/gameState";

export default function useSectionRedirect() {
    const navigate = useNavigate();

    function redirect(currentSection: string) {
        if (currentPhaseIndex === 0) { // A
            switch (currentSection) {
                case "GameSectionPresentation":    navigate("/GameSectionSpeech"); break;
                case "GameSectionSpeech":          navigate("/GameSectionMultipleChoice"); break;
                case "GameSectionMultipleChoice":  navigate("/GameSectionCongratulations"); break;
            }
        } else if ([1, 2, 3, 4].includes(currentPhaseIndex)) { // E I O U
            switch (currentSection) {
                case "GameSectionPresentation":    navigate("/GameSectionSpeech"); break;
                case "GameSectionSpeech":          navigate("/GameSectionMultipleChoice"); break;
                case "GameSectionMultipleChoice":  navigate("/GameSectionFinal"); break;
                case "GameSectionFinal":           navigate("/GameSectionCongratulations"); break;
            }
        } else { // Outras letras
            switch (currentSection) {
                case "GameSectionPresentation":    navigate("/GameSectionSpeech"); break;
                case "GameSectionSpeech":          navigate("/GameSectionMultipleChoice"); break;
                case "GameSectionMultipleChoice":  navigate("/GameSectionSpeechSyllable"); break;
                case "GameSectionSpeechSyllable":  navigate("/GameSectionFinal"); break;
                case "GameSectionFinal":           navigate("/GameSectionCongratulations"); break;
            }
        }
    }

    return { redirect };
}
