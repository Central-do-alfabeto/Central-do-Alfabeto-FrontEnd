import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { loginAPI } from "../../services/api/loginAPI";
import { setPlayerID, syncCurrentPhaseIndex } from "../../store/gameState";
import { setStudents } from "../../store/teacherStudentsInfo";
import { setAuthSession } from "../../store/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./Login.css";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        setIsLoading(true);

        try {
            const user = await loginAPI(email, password);

            setAuthSession({
                token: user.token,
                role: user.isStudent ? "STUDENT" : "EDUCATOR",
                userId: user.userId,
            });

            if (user.isStudent) {
                setPlayerID(user.userId);
                if (typeof user.currentPhaseIndex === "number") {
                    syncCurrentPhaseIndex(user.currentPhaseIndex);
                }
                navigate("/PlayerMenu");  // Redireciona ao menu do aluno
            } else {
                setStudents(Array.isArray(user.teacherStudents) ? user.teacherStudents : []);
                navigate("/TeacherMenu");  // Redireciona ao menu do educador
            }

        } catch (e: unknown) {
            alert('Email ou senha incorretos!');
            console.log(e);
        } finally {
            setIsLoading(false);
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

            <div className="input-with-icon">
                <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    disabled={isLoading}
                >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
            </div>

            <button type="submit" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Login"}
            </button>
        </form>
        <div className="login-footer">
            <Link to="/">Ainda não tem conta? Cadastre-se</Link>
            <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isLoading}
            >
                Voltar
            </button>
        </div>
        </div>
    );
}