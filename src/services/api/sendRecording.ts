import apiClient from "./apiClient";

export default async function sendRecording(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audioFile", audioBlob, "recording.webm");

  try {
    const response = await apiClient.post(`/audio/transcribe`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.message;
  } catch (error) {
        if (error instanceof Error) {
            console.error("Erro em sendRecording:", error.message);
        } else {
            console.error("Erro não esperado:", error);
        }
        throw error;
  }
}