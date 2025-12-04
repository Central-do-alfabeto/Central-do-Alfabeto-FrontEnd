import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerAPI } from "../../services/api/registerAPI";  
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../assets/styles/css/register.module.css";
import logo from "../../assets/images/logo-do-site.png";

export default function Register() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { role = "educators" } = location.state || {};
  const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;
  const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const sanitizedNome = nomeCompleto.trim().replace(/\s+/g, " ");

    if (!sanitizedNome || !nomeRegex.test(sanitizedNome)) {
      alert("O nome deve conter apenas letras e espaços.");
      setNomeCompleto(sanitizedNome);
      return;
    }

    setNomeCompleto(sanitizedNome);
    if (!senhaRegex.test(password)) {
      alert("A senha deve ter no mínimo 8 caracteres, incluindo letras e números.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerAPI(email, password, sanitizedNome, role);
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
    }
  };

  const roleKey = role === "players" ? "players" : "educators";
  const pageThemeClass = roleKey === "players" ? styles.bgAluno : styles.bgEducador;
  const containerTheme = roleKey === "players" ? styles.aluno : styles.educador;

  return (
    <div className={`${styles.page} ${pageThemeClass}`}>
      <div className={`${styles.container} ${containerTheme}`}>
        <img src={logo} alt="Logo do Quebra-Cabeça do Autismo" className={styles.logo} />
        <h1>Cadastro de {roleKey === "players" ? "Aluno" : "Educador"}</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nome Completo"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
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

          <div className={styles.passwordField}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={32}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className={styles.togglePasswordButton}
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </button>
            <button type="button" onClick={() => navigate("/")} disabled={isSubmitting}>
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
