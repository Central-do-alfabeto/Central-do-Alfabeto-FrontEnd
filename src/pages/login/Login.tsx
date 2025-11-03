import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { loginAPI } from "../../services/api/loginAPI";
import { setPlayerID, syncCurrentPhaseIndex } from "../../store/gameState";
import { setStudents } from "../../store/TeacherStudentsInfo";
import { setAuthSession } from "../../store/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../assets/styles/css/login.module.css";
import logo from "../../assets/images/logo-do-site.png";


const resolveRole = (role?: string, fallbackIsStudent?: boolean): "STUDENT" | "EDUCATOR" => {
    const normalized = role?.trim().toLowerCase();

    if (normalized === "educador" || normalized === "educator" || normalized === "teacher") {
        return "EDUCATOR";
    }

    if (normalized === "aluno" || normalized === "student" || normalized === "estudante") {
        return "STUDENT";
    }

    return fallbackIsStudent ? "STUDENT" : "EDUCATOR";
};

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
            const role = resolveRole(user.role, user.isStudent);
            const isStudent = role === "STUDENT";

            setAuthSession({
                token: user.token,
                role,
                userId: user.userId,
                playerMeta: isStudent
                    ? {
                        currentPhaseIndex: typeof user.currentPhaseIndex === "number" ? user.currentPhaseIndex : undefined,
                        email,
                    }
                    : undefined,
            });

            if (isStudent) {
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
        <div className={styles.page}>
            <div className={styles.loginContainer}>
                <img src={logo} alt="Logo do Quebra-Cabeça do Autismo" className={styles.logo} />

                <h1 className={styles.title}>Entrar</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <div className={styles.passwordField}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                        <button
                            type="button"
                            className={styles.togglePasswordButton}
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            disabled={isLoading}
                        >
                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </button>
                    </div>

                    <button type="submit" className={styles.button} disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Login"}
                    </button>
                </form>

                <Link to="/" className={styles.link}>
                    Ainda não tem conta? Cadastre-se
                </Link>
                <button
                    type="button"
                    className={styles.backButton}
                    onClick={() => navigate("/")}
                    disabled={isLoading}
                >
                    Voltar
                </button>
            </div>
        </div>
    );
}
