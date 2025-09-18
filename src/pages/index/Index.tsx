import { useNavigate } from "react-router-dom";

export default function Index() {
    const navigate = useNavigate();

    return (
        <div className="content">
        <img src="/logo do site.png" alt="Logo do Quebra-Cabeça do Autismo" className="logo" />

        <h1>Bem-vindo!</h1>
        <p>Este é um lugar feito com carinho para te ajudar!</p>

        <div className="linha-topo">
        <button className="botao-estudante" onClick={() => navigate("/Register", { state: { role: "players" } })}>
            📖 Criar conta de estudantes
        </button>

        <button className="botao-educador" onClick={() => navigate("/Register", { state: { role: "educators" } })}>
            🧑‍🏫 Criar conta de educador/responsável
        </button>
        </div>

        <div className="linha-login">
        <button className="botao-login" onClick={() => navigate("/Login")}>
            🔑 Fazer login
        </button>
        </div>

        {/*Navegação temporária*/}
        <div className="linha-login">
        <button className="botao-login" onClick={() => navigate("/GameSectionSpeech")}>
            Sessão1
        </button>
        </div>
        <div className="linha-login">
        <button className="botao-login" onClick={() => navigate("/GameSectionMultipleChoice")}>
            Sessão2
        </button>
        </div>
        <div className="linha-login">
        <button className="botao-login" onClick={() => navigate("/GameSectionFinal")}>
            Sessão3
        </button>
        </div>
        <div className="linha-login">
        <button className="botao-login" onClick={() => navigate("/GameSectionSpeechSyllable")}>
            Sessão4
        </button>
        </div>
        <div className="linha-login">
        <button className="botao-login" onClick={() => navigate("/GameSectionApresentation")}>
            Sessão5
        </button>
        </div>
        <div className="linha-login">
        <button className="botao-login" onClick={() => navigate("/PlayerMenu")}>
            PlayerMenu
        </button>
        </div>
        <div className="linha-login">
        <button className="botao-login" onClick={() => navigate("/GameConfig")}>
            Config
        </button>
        </div>

    </div>
    );
}