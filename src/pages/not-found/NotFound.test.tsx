import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("é exibida para rotas desconhecidas, com link para o início", () => {
    render(
      <MemoryRouter initialEntries={["/rota-que-nao-existe"]}>
        <Routes>
          <Route path="/" element={<p>início</p>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar ao início/i })).toHaveAttribute("href", "/");
  });
});
