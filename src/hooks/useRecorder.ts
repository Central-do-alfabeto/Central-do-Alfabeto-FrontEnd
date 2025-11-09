import { useRef, useState } from "react";
import { convertWebMToWAV } from "../utils/audioUtils";

export default function useRecorder(onStopCallback: (audioBlob: Blob) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const releaseStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          try {
            const webmBlob = new Blob(audioChunksRef.current, {
              type: "audio/webm;codecs=opus",
            });
            const wavBlob = await convertWebMToWAV(webmBlob);
            onStopCallback(wavBlob);
          } finally {
            releaseStream();
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Não foi possível iniciar a gravação:", error);
        releaseStream();
        mediaRecorderRef.current = null;
        setIsRecording(false);
      }
    } else {
      mediaRecorderRef.current?.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  };

  return { isRecording, toggleRecording };
}
