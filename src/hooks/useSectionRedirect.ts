import { useNavigate } from "react-router-dom";
import { currentPhaseIndex } from "../store/gameState";
import { getNextSectionRoute } from "../utils/phaseFlow";

export default function useSectionRedirect() {
    const navigate = useNavigate();

    function redirect(currentSection: string) {
        const nextRoute = getNextSectionRoute(currentPhaseIndex, currentSection);
        if (nextRoute) {
            navigate(nextRoute);
        }
    }

    return { redirect };
}
