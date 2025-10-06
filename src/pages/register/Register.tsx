import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerAPI } from "../../services/api/registerAPI";
import styles from "../../assets/styles/css/register.module.css";
import logo from "../../assets/images/logo-do-site.png";

export default function Register() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role === "players" ? "players" : "educators";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await registerAPI(email, password, nomeCompleto, role);
      alert("Cadastro concluído!");
      navigate("/");
    } catch (err: any) {
      console.error("Erro no cadastro:", err.message);
      alert("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div
      className={`${styles.page} ${
        role === "players" ? styles.bgAluno : styles.bgEducador
      }`}
    >
      <div
        className={`${styles.container} ${
          role === "players" ? styles.aluno : styles.educador
        }`}
      >
        <img
          src={logo}
          alt="Logo do Quebra-Cabeça do Autismo"
          className={styles.logo}
        />
        <h1>
          Cadastro de {role === "players" ? "Aluno" : "Educador"}
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome Completo"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className={styles.buttonGroup}>
            <button type="submit">Cadastrar</button>
            <button type="button" onClick={() => navigate("/")}>
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
