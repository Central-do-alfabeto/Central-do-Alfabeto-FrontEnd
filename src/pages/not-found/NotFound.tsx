import { Link } from "react-router-dom";
import styles from "../../assets/styles/css/game-section-congratulations.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p className={styles.message}>
          <span aria-hidden="true" style={{ display: "block", fontSize: "56px" }}>
            🔎
          </span>
          Página não encontrada.
        </p>

        <div className={styles.buttonRow}>
          <Link className={styles.nextButton} to="/">
            <span aria-hidden="true">🏠</span>
            <span> Voltar ao início</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
