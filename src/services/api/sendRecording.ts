import axios from "axios";

export default async function sendRecording(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/audio/transcribe`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.message;
  } catch (error: any) {
    console.error("Erro ao enviar gravação:", error);
    return "Erro ao enviar gravação";
  }
}