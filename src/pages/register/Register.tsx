import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
<<<<<<< HEAD
import { registerAPI } from "../../services/api/registerAPI";  
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./Register.css";
=======
import { registerAPI } from "../../services/api/registerAPI";
import styles from "../../assets/styles/css/register.module.css";
import logo from "../../assets/images/logo-do-site.png";
>>>>>>> Arthur

export default function Register() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
<<<<<<< HEAD
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { role = "educators" } = location.state || {};
=======
  const navigate = useNavigate();
  const location = useLocation();

  const role = location.state?.role === "players" ? "players" : "educators";
>>>>>>> Arthur

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

<<<<<<< HEAD
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await registerAPI(email, password, nomeCompleto, role);

      alert("Cadastro concluído!");
      navigate("/"); // redireciona para tela inicial
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro no cadastro:", error.message);
      } else {
        console.error("Erro no cadastro:", error);
      }
      alert("Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
=======
    try {
      await registerAPI(email, password, nomeCompleto, role);
      alert("Cadastro concluído!");
      navigate("/");
    } catch (err: any) {
      console.error("Erro no cadastro:", err.message);
      alert("Erro ao cadastrar. Tente novamente.");
>>>>>>> Arthur
    }
  };

  return (
<<<<<<< HEAD
    <div className="register-container">
      <h1>Cadastro de {role}</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome Completo"
          value={nomeCompleto}
          onChange={(e) => setNomeCompleto(e.target.value)}
          pattern="^[A-Za-zÀ-ÿ\s]+$"
          title="O nome deve conter apenas letras e espaços."
          maxLength={100}
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={100}
          required
        />

        <div className="input-with-icon">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
            title="A senha deve ter no mínimo 8 caracteres, incluindo letras e números."
            maxLength={32}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <button onClick={() => navigate("/")} disabled={isSubmitting}>Voltar</button>
=======
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
>>>>>>> Arthur
    </div>
  );
}
