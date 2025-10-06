import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAPI } from "../../services/api/loginAPI";
import { setCurrentPhaseIndex } from "../../store/gameState";
import { Link } from "react-router-dom";
import { setStudents } from "../../store/TeacherStudentsInfo";
import styles from "../../assets/styles/css/login.module.css"; // ✅ Import CSS Modules
import logo from "../../assets/images/logo-do-site.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await loginAPI(email, password);
      if (user.isStudent) {
        setCurrentPhaseIndex(user.currentPhaseIndex);
        navigate("/PlayerMenu");
      } else {
        setStudents(user.teacherStudents);
        navigate("/TeacherMenu");
      }
    } catch (err: any) {
      console.error("Erro no login:", err.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.loginContainer}>
        <img src={logo} alt="Logo do Quebra-Cabeça do Autismo" className={styles.logo} />

        <h1 className={styles.title}>Entrar</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />

          <button type="submit" className={styles.button}>Login</button>
        </form>

        <Link to="/" className={styles.link}>
          Ainda não tem conta? Cadastre-se
        </Link>
      </div>
    </div>
  );
}
