import { PageColor } from "../../state/pageColor";
import { paletasDisponiveis } from "../../store/paletaCores";
import { useShowText } from "../../state/showText";

export default function Config() {
  const [paleta, setPaleta] = PageColor();
  const [showText, setShowText] = useShowText();

  const handleLogout = () => {
    // método de logout aqui
  };

  return (
    <div className="config-container">
      <h1>Configurações</h1>

      <div className="config-item">
        <label>Página Cor:</label>
        <select
          value={Object.keys(paletasDisponiveis).find(key => paletasDisponiveis[key] === paleta)}
          onChange={(e) => setPaleta(e.target.value as keyof typeof paletasDisponiveis)}
        >
          {Object.keys(paletasDisponiveis).map((nome) => (
            <option key={nome} value={nome}>
              {nome.charAt(0).toUpperCase() + nome.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="config-item">
        <label>
          <input
            type="checkbox"
            checked={showText}
            onChange={(e) => setShowText(e.target.checked)}
          />
          Exibir texto
        </label>
      </div>

      <div className="config-item">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}