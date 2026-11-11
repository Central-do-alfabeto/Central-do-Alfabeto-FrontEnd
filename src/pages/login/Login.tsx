import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useState } from "react";
import { loginAPI } from "../../services/api/loginAPI";
import { clearPlayerSessionState, setPlayerID, syncCurrentPhaseIndex } from "../../store/gameState";
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

    if (normalized === "aluno" || normalized === "student" || normalized === "estudante" || normalized === "player") {
        return "STUDENT";
    }

    return fallbackIsStudent ? "STUDENT" : "EDUCATOR";
};

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [keepConnected, setKeepConnected] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isLoading) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const user = await loginAPI(email, password);
            const role = resolveRole(user.role, user.isStudent);
            const isStudent = role === "STUDENT";
            const resolvedPhaseIndex = isStudent && typeof user.currentPhaseIndex === "number"
                ? user.currentPhaseIndex
                : 0;

            if (isStudent) {
                clearPlayerSessionState();
            }

            setAuthSession(
                {
                    token: user.token,
                    role,
                    userId: user.userId,
                    playerMeta: isStudent
                        ? {
                            currentPhaseIndex: resolvedPhaseIndex,
                            email,
                        }
                        : undefined,
                    profile: {
                        name: user.userName ?? undefined,
                        email: user.email ?? email,
                    },
                },
                {
                    persistent: keepConnected,
                }
            );

            if (isStudent) {
                setPlayerID(user.userId);
                syncCurrentPhaseIndex(resolvedPhaseIndex);
                navigate("/PlayerMenu");  // Redireciona ao menu do aluno
            } else {
                setStudents(Array.isArray(user.teacherStudents) ? user.teacherStudents : []);
                navigate("/EducatorDashboard");  // Redireciona ao painel do educador
            }

        } catch (e: unknown) {
            const noResponse = isAxiosError(e) && !e.response;
            setErrorMessage(
                noResponse
                    ? 'Não foi possível conectar ao servidor. Verifique a internet e tente de novo.'
                    : 'E-mail ou senha incorretos. Confira os dados e tente de novo.'
            );
            console.error('Falha no login:', e);
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
                        aria-label="E-mail"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />

                    <div className={styles.passwordField}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            aria-label="Senha"
                            autoComplete="current-password"
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

                    <label className={styles.keepConnected}>
                        <input
                            type="checkbox"
                            checked={keepConnected}
                            onChange={(event) => setKeepConnected(event.target.checked)}
                            disabled={isLoading}
                        />
                        <span>Manter conectado</span>
                    </label>

                    {errorMessage && (
                        <p role="alert" className={styles.errorMessage}>
                            {errorMessage}
                        </p>
                    )}

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
