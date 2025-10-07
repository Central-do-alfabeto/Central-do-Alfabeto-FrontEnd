import { useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD


export default function FirstPresentationSection() {
=======
export function FirstPresentationSection() {
>>>>>>> 896aafc7c65cbed0fcbbd53d29f75ad77e52ad85
const [audioRunning, setAudioRunning] = useAudioRunning();
const [showText] = useShowText();
const navigate = useNavigate();

    useEffect(() => {
        if (!showText) {
            playAudio("introdução", setAudioRunning);
        }
    }, [showText, setAudioRunning]);


  return (
    <section className="">
      <div>
        <h1>Introdução</h1>
        {showText && <p>Bem-vindo à Central do Alfabeto!</p>}
        {/*Aqui vai ficar uma imagem depois*/}
      </div>
      <button disabled={audioRunning} onClick={() => navigate("/GameSectionPresentation")}>
      </button>
      <button disabled={audioRunning} onClick={() => navigate("/PlayerMenu")}></button>
    </section>
  );
}
