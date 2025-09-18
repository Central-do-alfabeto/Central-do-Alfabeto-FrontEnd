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
  } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Erro em sendRecording:", error.message);
            throw error;
        }
        console.error("Erro não esperado:", error);
        throw error;
  }
}