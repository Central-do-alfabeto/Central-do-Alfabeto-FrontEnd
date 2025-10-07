import { useLayoutEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { useAudioRunning } from "../../state/useAudioRunning";
import { currentPhaseIndex } from "../../store/gameState";

export default function PlayerMenu() {
    const audioPathName: string = 'Menu';
    const navigate = useNavigate();
    const [audioRunning, setAudioRunning] = useAudioRunning();

    useLayoutEffect(() => {
        playAudio("tela_inicial", setAudioRunning);
    }, [audioPathName, setAudioRunning]);

    return (
        <div className="container">
        
        <img 
          src="../../assets/images/logo-do-site.jpg"
          alt="logoDoSite"
          loading="lazy"
          decoding="async"
        />
        {/* <button className="icon" onClick={() => navigate('/settings')}> Settings no futuro
             <img 
                src="../../assets/images/settings-icon.png"
                alt="logoDoSite"
                loading="lazy"
                decoding="async"
            />
        </button> */}

        <div className="menu-icons">
        <button className="icon" onClick={() => playAudio("tela_inicial", setAudioRunning, true)} disabled={audioRunning}>
             <img 
                src="../../assets/images/sound-icon.png"
                alt="logoDoSite"
                loading="lazy"
                decoding="async"
            />
        </button>
        <button className="icon" onClick={() => navigate('/GameConfig')}>
            <img 
                src="../../assets/images/settings-icon.png"
                alt="logoDoSite"
                loading="lazy"
                decoding="async"
            />
        </button>
        </div>

        <div className="start-button">
        <button onClick={() => { if(currentPhaseIndex === 0) { navigate('/FirstPresentationSection') } else { navigate('/GameSectionPresentation') }}}>INICIAR</button>
        </div>

        </div>
    );
=======
import styles from "../../assets/styles/css/menu.module.css"; // ✅ agora usando CSS Modules

export default function PlayerMenu() {
  const audioPathName: string = 'Menu';
  const navigate = useNavigate();

  useLayoutEffect(() => {
    playAudio(audioPathName);
  }, []);

  return (
    <div className={styles.pageBackground}>
      <div className={styles.container}>

        <div className={styles.menuIcons}>
          <button className={styles.icon} onClick={() => playAudio(audioPathName)}>
            <img 
              src="/src/assets/images/sound-icon.png"
              alt="som"
              loading="lazy"
              decoding="async"
            />
          </button>
          <button className={styles.icon} onClick={() => navigate('/GameConfig')}>
            <img 
              src="/src/assets/images/settings-icon.png"
              alt="configurações"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>

        <div className={styles.startButton}>
          <button onClick={() => navigate('/GameSectionApresentation')}>
            INICIAR
          </button>
        </div>

      </div>
    </div>
  );
>>>>>>> Arthur
}
