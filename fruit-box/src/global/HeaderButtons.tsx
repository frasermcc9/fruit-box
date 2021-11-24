import {
  SunIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  CodeIcon,
  MusicNoteIcon,
  VolumeOffIcon,
} from "@heroicons/react/outline";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useAudioSettings } from "../hooks/useAudio";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ReactComponent as AmogusIcon } from '../res/amogus.svg'

const HeaderButtons = () => {
  const [theme, setTheme] = useLocalStorage<string>(
    "preferredTheme",
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  const swapTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.body.classList.remove("dark");
    document.body.classList.remove("light");
    document.body.classList.add(theme);
  }, [setTheme, theme]);

  const history = useHistory();

  const goHome = () => {
    history.push("/");
  }

  const goToHelp = () => {
    history.push("/tutorial");
  };

  const goToStats = () => {
    history.push("/stats");
  };

  const [{ playAudio }, setAudioSettings] = useAudioSettings();
  useEffect(() => {
    setAudioSettings({
      playAudio: JSON.parse(localStorage.getItem("playAudio")!) ?? false,
    });
  }, []);
  useEffect(() => {
    localStorage.setItem("playAudio", playAudio.toString());
  }, [playAudio]);

  return (
    <div className="sm:fixed top-2 left-2 flex gap-x-2">
      <HeaderButton 
        action={goHome}
        icon={<AmogusIcon height={32} width={32} />}
      />
      <HeaderButton
        action={swapTheme}
        icon={
          theme === "light" ? (
            <SunIcon className="w-8 text-current" />
          ) : (
            <MoonIcon className="w-8 text-current" />
          )
        }
      />
      <HeaderButton
        action={goToHelp}
        icon={<QuestionMarkCircleIcon className="w-8 text-current" />}
      />
      <HeaderButton
        action={goToStats}
        icon={<ChartBarIcon className="w-8 text-current" />}
      />
      <HeaderButton
        action={() =>
          window.open("https://github.com/frasermcc9/fruit-box", "_blank")
        }
        icon={<CodeIcon className="w-8 text-current" />}
      />
      <HeaderButton
        action={() =>
          setAudioSettings((p) => ({ ...p, playAudio: !p.playAudio }))
        }
        icon={
          playAudio ? (
            <MusicNoteIcon className="w-8 text-current" />
          ) : (
            <VolumeOffIcon className="w-8 text-current" />
          )
        }
      />
    </div>
  );
};

const HeaderButton: React.FC<{ action: () => void; icon: JSX.Element }> = ({
  action,
  icon,
}) => {
  return (
    <button
      className="transition-all dark:hover:bg-dark-600 hover:bg-gray-100 p-2 rounded"
      onClick={action}
    >
      {icon}
    </button>
  );
};

export default HeaderButtons;
