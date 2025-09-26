import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginAPI } from "../../services/api/loginAPI";
import { setCurrentPhaseIndex } from "../../store/gameState";
import { Link } from "react-router-dom";
import { setStudents } from "../../store/TeacherStudentsInfo";


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
                navigate("/PlayerMenu");  // Redireciona ao menu do aluno
            } else {
                setStudents(user.teacherStudents);
                navigate("/TeacherMenu");  // Redireciona ao menu do educador
            }

        } catch (e: unknown) {
            alert('Email ou senha incorretos!');
            console.log(e);
        }
    };

    return (
        
        <div className="login-container">

        {/* <img src="imagens/logo do site.png" alt="Logo do Jogo Educacional" className="logo"> */}

        <h1>Entrar</h1>

        <form onSubmit={handleSubmit}>
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
            <button type="submit">Login</button>
        </form>
        <Link to="/">Ainda não tem conta? Cadastre-se</Link>
        </div>
    );
}