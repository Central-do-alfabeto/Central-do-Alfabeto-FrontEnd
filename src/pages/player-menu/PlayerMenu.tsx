import { useLayoutEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
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
}
