import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerAPI } from "../../services/api/registerAPI";  
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./Register.css";

export default function Register() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { role = "educators" } = location.state || {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    }
  };

  return (
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
    </div>
  );
}
