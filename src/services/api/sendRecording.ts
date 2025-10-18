import { isAxiosError } from "axios";
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

    if (typeof response.data === "string") {
      return response.data;
    }

    if (response.data && typeof response.data.message === "string") {
      return response.data.message;
    }

    console.warn(
      "Resposta inesperada em sendRecording:",
      response.data
    );
    return "";
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data;
      const message =
        typeof data === "string"
          ? data
          : data?.message ?? "Não foi possível processar o áudio.";

      console.error(
        `Erro em sendRecording: status ${status ?? "desconhecido"}`,
        message
      );

      throw new Error(message);
    }

    if (error instanceof Error) {
      console.error("Erro em sendRecording:", error.message);
      throw error;
    }

    console.error("Erro não esperado:", error);
    throw new Error("Não foi possível processar o áudio.");
  }
}