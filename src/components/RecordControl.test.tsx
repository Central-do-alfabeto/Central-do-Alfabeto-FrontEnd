import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import RecordControl from "./RecordControl";
import type { SpeechCapture } from "../hooks/useSpeechCapture";

function makeCapture(overrides: Partial<SpeechCapture> = {}): SpeechCapture {
  return {
    engine: "web-speech",
    status: "idle",
    isListening: false,
    isBusy: false,
    error: null,
    micBlocked: false,
    toggle: vi.fn(),
    retryMicrophone: vi.fn(),
    ...overrides,
  };
}

describe("RecordControl", () => {
  it("mostra botão de gravar com nome acessível e inicia a captura", () => {
    const capture = makeCapture();
    render(<RecordControl capture={capture} onAssistedCorrect={vi.fn()} targetLabel="letra B" />);

    fireEvent.click(screen.getByRole("button", { name: "Gravar letra B" }));
    expect(capture.toggle).toHaveBeenCalled();
  });

  it("mostra o estado 'ouvindo' enquanto o microfone está ativo", () => {
    const capture = makeCapture({ status: "listening", isListening: true, isBusy: true });
    render(<RecordControl capture={capture} onAssistedCorrect={vi.fn()} />);

    expect(screen.getByText(/ouvindo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /parar de gravar/i })).toBeInTheDocument();
  });

  it("mostra a mensagem de erro na própria tela", () => {
    const capture = makeCapture({ error: "Não ouvi nada." });
    render(<RecordControl capture={capture} onAssistedCorrect={vi.fn()} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Não ouvi nada.");
  });

  it("no modo assistido, o adulto confirma ou pede para tentar de novo", () => {
    const onCorrect = vi.fn();
    const onRetry = vi.fn();
    render(
      <RecordControl
        capture={makeCapture({ engine: "assisted" })}
        onAssistedCorrect={onCorrect}
        onAssistedRetry={onRetry}
      />
    );

    expect(screen.getByText(/não consegue ouvir a fala/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /a criança falou certo/i }));
    fireEvent.click(screen.getByRole("button", { name: /tentar de novo/i }));
    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("com o microfone negado, explica e oferece tentar o microfone de novo", () => {
    const capture = makeCapture({
      engine: "assisted",
      micBlocked: true,
      error: "O microfone está bloqueado neste site.",
    });
    render(<RecordControl capture={capture} onAssistedCorrect={vi.fn()} />);

    expect(screen.getByRole("alert")).toHaveTextContent(/bloqueado/i);
    fireEvent.click(screen.getByRole("button", { name: /tentar usar o microfone/i }));
    expect(capture.retryMicrophone).toHaveBeenCalled();
  });
});
