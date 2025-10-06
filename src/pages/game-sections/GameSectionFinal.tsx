import useRecorder from "../../hooks/useRecorder";
import { Words } from "../../store/gameConstants";
import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { useState, useEffect } from "react";
import sendRecording from "../../services/api/sendRecording";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";

export default function GameSectionFinal() {
  const [canGoNextWord1, setCanGoNext1] = useState(false);
  const [canGoNextWord2, setCanGoNext2] = useState(false);
  const [canGoNextWord3, setCanGoNext3] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);
  const [clickedWord, setClickedWord] = useState("");
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const { redirect } = useSectionRedirect();
  const navigate = useNavigate();


  const word1 = Words[currentPhaseIndex].word1;
  const word2 = Words[currentPhaseIndex].word2;
  const word3 = Words[currentPhaseIndex].word3;

  async function handleResult(audioBlob: Blob) {
    const result = await sendRecording(audioBlob);

    if (result === clickedWord) {
      if (clickedWord === word1) setCanGoNext1(true);
      if (clickedWord === word2) setCanGoNext2(true);
      if (clickedWord === word3) setCanGoNext3(true);
    } else {
      playAudio(`Helper${currentPhaseIndex}`, setAudioRunning, true);
      incrementTotalErrors();
    }

    setCanGoNext(
      (clickedWord === word1 ? true : canGoNextWord1) &&
      (clickedWord === word2 ? true : canGoNextWord2) &&
      (clickedWord === word3 ? true : canGoNextWord3)
    );
  }

  useEffect(() => {
    setCanGoNext(false);
    if (!showText) {
      playAudio('repita_palavra_mostrada', setAudioRunning);
    }
  }, [showText, setAudioRunning]);

  return (
    <div>
      <form>
        {showText && <p>Grave cada palavra corretamente para continuar! 🎯</p>}

        <label onClick={() => playAudio(word1, setAudioRunning, true)}>{word1}</label>
        <button
          id="startRecordingWord1"
          onClick={() => { toggleRecording(); setClickedWord(word1); }}
          disabled={canGoNextWord1 || (isRecording && clickedWord !== word1) || audioRunning}
        >
          {isRecording && clickedWord === word1 ? "⏹️ Parar" : "🎙️ Gravar"}
        </button>

        <label onClick={() => playAudio(word2, setAudioRunning, true)}>{word2}</label>
        <button
          id="startRecordingWord2"
          onClick={() => { toggleRecording(); setClickedWord(word2); }}
          disabled={canGoNextWord2 || (isRecording && clickedWord !== word2) || audioRunning}
        >
          {isRecording && clickedWord === word2 ? "⏹️ Parar" : "🎙️ Gravar"}
        </button>

        <label onClick={() => playAudio(word3, setAudioRunning, true)}>{word3}</label>
        <button
          id="startRecordingWord3"
          onClick={() => { toggleRecording(); setClickedWord(word3); }}
          disabled={canGoNextWord3 || (isRecording && clickedWord !== word3) || audioRunning}
        >
          {isRecording && clickedWord === word3 ? "⏹️ Parar" : "🎙️ Gravar"}
        </button>

        <button
          className="section2"
          disabled={!canGoNext || audioRunning}
          onClick={() => redirect('/GameSectionFinal')}
        >
          {showText && <div>Próxima fase</div>}
        </button>

        <button
          onClick={() => navigate("/PlayerMenu")}
          disabled={audioRunning}
        >
          {showText && <div>Voltar ao menu</div>}
        </button>
      </form>
    </div>
  );
}
