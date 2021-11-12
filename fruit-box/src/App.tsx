import React, { useEffect, useState } from "react";
import "./styles/tailwind.css";
import GamePage from "./pages/game/GamePage";
import { IOProvider, useIOInitializer } from "./hooks/useIO";
import LobbyPage from "./pages/lobby/LobbyPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import QuickPlayPage from "./pages/game/quickplay/QuickPlayPage";
import { CornerAlertManager } from "./pages/components/alert/CornerAlert";
import {
  useLocalStorage,
  useLocalStorageOnLoad,
} from "./hooks/useLocalStorage";
import { Lobby, LobbyContext } from "./hooks/useLobby";
import {
  SunIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/outline";
import HelpPage from "./pages/tutorial/HelpPage";
import HeaderButtons from "./global/HeaderButtons";
import StatsPage from "./pages/stats/StatsPage";

const App: React.FC = () => {
  const endpoint = process.env.REACT_APP_ENDPOINT;
  const socket = useIOInitializer(endpoint || "");

  const [lobbyContext, setLobbyContext] = useState<
    Omit<Lobby, "setLobbyContext">
  >({
    name: "",
    players: [],
    code: "",
    settings: {
      gameDuration: 120,
      regenerationTime: 10,
    },
  });

  useEffect(() => {
    socket?.once("terminated", () => {
      window.location.reload();
    });

    return () => {
      socket?.removeAllListeners("terminated");
    };
  }, [socket]);

  useLocalStorageOnLoad<string>("username", (v) => {
    setLobbyContext({
      ...lobbyContext,
      name: v,
    });
  });

  return (
    <div className="dark:text-gray-100 text-gray-800">
      <IOProvider value={socket}>
        <LobbyContext.Provider value={{ ...lobbyContext, setLobbyContext }}>
          <CornerAlertManager>
            <Router>
              <HeaderButtons />
              <Switch>
                <Route path="/game/:gameId">
                  <GamePage />
                </Route>
                <Route path="/quickplay">
                  <QuickPlayPage />
                </Route>
                <Route path="/tutorial">
                  <HelpPage />
                </Route>
                <Route path="/stats">
                  <StatsPage />
                </Route>
                <Route path="/">
                  <LobbyPage />
                </Route>
              </Switch>
            </Router>
          </CornerAlertManager>
        </LobbyContext.Provider>
      </IOProvider>
    </div>
  );
};

export default App;
