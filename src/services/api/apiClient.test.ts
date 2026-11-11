import { beforeEach, describe, expect, it, vi } from "vitest";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";

const { redirect } = vi.hoisted(() => ({ redirect: vi.fn() }));

vi.mock("./sessionExpired", async (importOriginal) => {
  const original = await importOriginal<typeof import("./sessionExpired")>();
  return { ...original, handleSessionExpired: () => original.handleSessionExpired(redirect) };
});

import apiClient from "./apiClient";
import { hasSessionExpiredNotice } from "./sessionExpired";
import { getAuthToken, setAuthSession } from "../../store/auth";

function answerWith(status: number, data: unknown) {
  apiClient.defaults.adapter = async (config: InternalAxiosRequestConfig) => {
    const response = { data, status, statusText: "", headers: {}, config };
    if (status >= 400) {
      throw new AxiosError("falhou", String(status), config, undefined, response);
    }
    return response;
  };
}

function logIn() {
  setAuthSession({ token: "token-expirado", role: "STUDENT", userId: "u1" });
}

describe("apiClient: sessão expirada", () => {
  beforeEach(() => {
    redirect.mockReset();
    sessionStorage.setItem("PlayerID", "u1");
  });

  it("401 em requisição autenticada limpa a sessão, avisa e leva ao login", async () => {
    logIn();
    answerWith(401, "");

    await expect(apiClient.post("/players/u1/progress", {})).rejects.toBeTruthy();

    expect(getAuthToken()).toBeNull();
    expect(sessionStorage.getItem("PlayerID")).toBeNull();
    expect(hasSessionExpiredNotice()).toBe(true);
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("403 sem corpo de erro, com token enviado, também expira a sessão", async () => {
    logIn();
    answerWith(403, "");

    await expect(apiClient.get("/educators/u1/students")).rejects.toBeTruthy();

    expect(getAuthToken()).toBeNull();
    expect(redirect).toHaveBeenCalledTimes(1);
  });

  it("403 com corpo de erro de permissão não encerra a sessão", async () => {
    logIn();
    answerWith(403, { message: "Sem permissão para este recurso" });

    await expect(apiClient.get("/educators/student-progress/x")).rejects.toBeTruthy();

    expect(getAuthToken()).toBe("token-expirado");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("401 no login (credenciais erradas) não é tratado como sessão expirada", async () => {
    logIn();
    answerWith(401, "");

    await expect(apiClient.post("/auth/login", {})).rejects.toBeTruthy();

    expect(getAuthToken()).toBe("token-expirado");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("requisição sem token não dispara o aviso", async () => {
    answerWith(401, "");

    await expect(apiClient.get("/audio/transcribe")).rejects.toBeTruthy();

    expect(redirect).not.toHaveBeenCalled();
    expect(hasSessionExpiredNotice()).toBe(false);
  });

  it("respostas de sucesso passam sem alteração", async () => {
    logIn();
    answerWith(200, { ok: true });

    const response = await apiClient.get("/qualquer");

    expect(response.data).toEqual({ ok: true });
    expect(getAuthToken()).toBe("token-expirado");
  });
});
