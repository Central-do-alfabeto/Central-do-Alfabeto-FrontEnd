import { clearAuthSession } from "../../store/auth";
import { clearPlayerSessionState } from "../../store/gameState";

const NOTICE_KEY = "auth.sessionExpiredNotice";

export const SESSION_EXPIRED_MESSAGE = "Sua sessão expirou. Entre de novo para continuar.";

/** Há um aviso de sessão expirada para mostrar na tela de login? */
export function hasSessionExpiredNotice(): boolean {
  try {
    return sessionStorage.getItem(NOTICE_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearSessionExpiredNotice() {
  try {
    sessionStorage.removeItem(NOTICE_KEY);
  } catch {
    /* nada a limpar */
  }
}

function goToLogin() {
  if (window.location.pathname.endsWith("/Login")) return;
  window.location.assign(`${import.meta.env.BASE_URL}Login`);
}

/** Limpa a sessão, guarda o aviso e leva ao login. */
export function handleSessionExpired(redirect: () => void = goToLogin) {
  clearAuthSession();
  clearPlayerSessionState();
  try {
    sessionStorage.setItem(NOTICE_KEY, "1");
  } catch {
    /* sem armazenamento: o redirecionamento ainda acontece */
  }
  redirect();
}
