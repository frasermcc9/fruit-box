import {
  SunIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  CodeIcon,
} from "@heroicons/react/outline";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";

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

  const goToHelp = () => {
    history.push("/tutorial");
  };

  const goToStats = () => {
    history.push("/stats");
  };

  return (
    <div className="fixed top-2 left-2 flex gap-x-2">
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
