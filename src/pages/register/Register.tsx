import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerAPI } from "../../services/api/registerAPI";  

export default function Register() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

   const { role = "teacher" } = location.state || {};

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

        <button type="submit">Cadastrar</button>
      </form>

      <button onClick={() => navigate("/")}>Voltar</button>
    </div>
  );
}
