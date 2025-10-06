import { Letters } from "../../store/gameConstants";
import { currentPhaseIndex, incrementTotalErrors } from "../../store/gameState";
import { playAudio } from "../../utils/playAudio";
import { useState, useEffect } from "react";
import useRecorder from "../../hooks/useRecorder";
import { useNavigate } from "react-router-dom";
import sendRecording from "../../services/api/sendRecording";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";
import useSectionRedirect from "../../hooks/useSectionRedirect";

export default function GameSectionSpeechSyllable() {
  const [canGoNextWords, setCanGoNextWords] = useState([false, false, false, false, false]);
  const [canGoNext, setCanGoNext] = useState(false);
  const [clickedWord, setClickedWord] = useState("");
  const { isRecording, toggleRecording } = useRecorder(handleResult);
  const navigate = useNavigate();
  const [audioRunning, setAudioRunning] = useAudioRunning();
  const [showText] = useShowText();
  const { redirect } = useSectionRedirect();

  const letter = Letters[currentPhaseIndex];
  const syllables = ["a", "e", "i", "o", "u"].map(v => `${letter}${v}`);
  const helperAudioName = `Helper${currentPhaseIndex}_GameSectionSpeechSyllable`; // COMENTÁRIO DO BRIAN: Precisa de um áudio de erro aqui


  async function handleResult(audioBlob: Blob) {
    const result = await sendRecording(audioBlob);
    const idx = syllables.indexOf(clickedWord);

    if (result === clickedWord && idx !== -1) {
      setCanGoNextWords(prev => {
        const updated = [...prev];
        updated[idx] = true;
        return updated;
      });
    } else {
      incrementTotalErrors();
      playAudio(helperAudioName, setAudioRunning, true);
    }

    setCanGoNext(
      syllables.every((_, i) => (i === idx ? true : canGoNextWords[i]))
    );
  }

  useEffect(() => {
    setCanGoNext(false);
    if (!showText) {
      playAudio(`silaba_${syllables[0]}`, setAudioRunning);
    }
  }, [showText, setAudioRunning, helperAudioName, syllables]);

  return (
    <div>
      {showText && <p>Grave cada sílaba corretamente para continuar! 🎤</p>}

      {syllables.map((syll, idx) => (
        <div key={syll}>
          <div
            onClick={() => playAudio(`silaba_${syll}`, setAudioRunning, true)}
          >
            {syll}
          </div>
          <button
            onClick={() => {
              toggleRecording();
