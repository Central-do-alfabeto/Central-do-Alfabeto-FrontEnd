import { useLayoutEffect } from "react";
import { playAudio } from "../../utils/playAudio";
import { useNavigate } from "react-router-dom";
import { useAudioRunning } from "../../state/useAudioRunning";

export default function PlayerMenu() {
    const audioPathName: string = 'Menu';
    const navigate = useNavigate();
    const [audioRunning, setAudioRunning] = useAudioRunning();

    useLayoutEffect(() => {
        playAudio(audioPathName, setAudioRunning);
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
        <button className="icon" onClick={() => playAudio(audioPathName, setAudioRunning, true)} disabled={audioRunning}>
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
        <button onClick={() => navigate('/GameSectionPresentation')}>INICIAR</button>
        </div>

        </div>
    );
}