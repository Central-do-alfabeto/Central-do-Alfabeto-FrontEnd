import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerAPI } from "../../services/api/registerAPI";  
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Register() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { role = "educators" } = location.state || {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await registerAPI(email, password, nomeCompleto, role);

      alert("Cadastro concluído!");
      navigate("/"); // redireciona para tela inicial
    } catch (err: any) {
      console.error("Erro no cadastro:", err.message);
      alert("Erro ao cadastrar. Tente novamente.");
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
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </button>

        <button type="submit">Cadastrar</button>
      </form>

      <button onClick={() => navigate("/")}>Voltar</button>
    </div>
  );
}
