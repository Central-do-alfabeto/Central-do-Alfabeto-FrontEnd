import axios, { isAxiosError } from "axios";
import { getAuthToken } from "../../store/auth";
import { handleSessionExpired } from "./sessionExpired";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login e cadastro respondem 401/409 por motivos próprios (credenciais, e-mail repetido).
const PUBLIC_ENDPOINT = /\/(auth\/login|players\/register|educators\/register)\b/;

function hasErrorBody(data: unknown): boolean {
  if (data === null || data === undefined || data === "") return false;
  if (typeof data === "object") return Object.keys(data as object).length > 0;
  return true;
}

/**
 * 401 em requisição autenticada significa token ausente, inválido ou expirado.
 * 403 sem corpo de erro, também em requisição autenticada, é tratado do mesmo jeito;
 * 403 com corpo é falta de permissão e segue como erro comum.
 */
export function isSessionExpiredError(error: unknown): boolean {
  if (!isAxiosError(error) || !error.response) return false;

  const { status, data } = error.response;
  const config = error.config;
  if (!config || PUBLIC_ENDPOINT.test(config.url ?? "")) return false;

  const sentToken = Boolean(config.headers?.Authorization);
  if (!sentToken) return false;

  return status === 401 || (status === 403 && !hasErrorBody(data));
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isSessionExpiredError(error)) {
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
