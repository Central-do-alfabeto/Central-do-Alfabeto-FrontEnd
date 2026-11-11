import { useNavigate } from "react-router-dom";
import { currentPhaseIndex, TotalAudioReproductions, TotalErrors } from "../store/gameState";
import { markPhaseCompletion } from "../store/phaseCompletion";
import { getNextSectionRoute } from "../utils/phaseFlow";

export default function useSectionRedirect() {
    const navigate = useNavigate();

    function redirect(currentSection: string) {
        const nextRoute = getNextSectionRoute(currentPhaseIndex, currentSection);
        if (nextRoute) {
            if (nextRoute === "/GameSectionCongratulations") {
                markPhaseCompletion(currentPhaseIndex, TotalErrors, TotalAudioReproductions);
            }
            navigate(nextRoute);
        }
    }

    return { redirect };
}
