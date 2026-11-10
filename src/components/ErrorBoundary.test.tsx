import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

function Broken(): never {
  throw new Error("falha de teste");
}

describe("ErrorBoundary", () => {
  it("mostra os filhos quando não há erro", () => {
    render(
      <ErrorBoundary>
        <p>conteúdo normal</p>
      </ErrorBoundary>
    );

    expect(screen.getByText("conteúdo normal")).toBeInTheDocument();
  });

  it("mostra mensagem amigável e link para o início quando um filho quebra", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Algo deu errado");
    expect(screen.getByRole("link", { name: /voltar ao início/i })).toHaveAttribute("href", "/");
  });
});
