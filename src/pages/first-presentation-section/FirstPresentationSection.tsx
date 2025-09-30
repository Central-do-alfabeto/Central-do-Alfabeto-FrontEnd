import { useEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useAudioRunning } from "../../state/useAudioRunning";
import { useShowText } from "../../state/useShowText";



export function FirstPresentationSection() {
const [audioRunning, setAudioRunning] = useAudioRunning();
const [showText] = useShowText();

    useEffect(() => {
        if (!showText) {
            playAudio("introdução", setAudioRunning);
        }
    }, [showText, setAudioRunning]);


  return (
    <section className="">
      
    </section>
  );
}