import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "../assets/styles/css/game-section-congratulations.module.css";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Evita a tela branca: qualquer erro de renderização mostra uma mensagem amigável
 * com um botão para voltar ao início (recarrega a página, limpando o estado com erro).
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro inesperado na aplicação:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className={styles.page}>
        <div className={styles.container} role="alert">
          <p className={styles.message}>
            <span aria-hidden="true" style={{ display: "block", fontSize: "56px" }}>
              😕
            </span>
            Ops! Algo deu errado.
            <br />
            Vamos tentar de novo?
          </p>

          <div className={styles.buttonRow}>
            <a className={styles.nextButton} href={import.meta.env.BASE_URL ?? "/"}>
              <span aria-hidden="true">🏠</span>
              <span> Voltar ao início</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
