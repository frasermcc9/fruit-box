import {
  SunIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
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

  return (
    <>
      <button
        className="transition-all fixed top-2 right-2"
        onClick={swapTheme}
      >
        {theme === "light" ? (
          <SunIcon className="w-8 text-current" />
        ) : (
          <MoonIcon className="w-8 text-current" />
        )}
      </button>
      <button className="transition-all fixed top-2 left-2" onClick={goToHelp}>
        <QuestionMarkCircleIcon className="w-8 text-current" />
      </button>
    </>
  );
};

export default HeaderButtons;
