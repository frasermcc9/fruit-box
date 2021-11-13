import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HeaderButtons from "./global/HeaderButtons";
import { AudioSettingsContextProvider } from "./hooks/useAudio";
import { IOProvider, useIOInitializer } from "./hooks/useIO";
import { Lobby, LobbyContext } from "./hooks/useLobby";
import { useLocalStorageOnLoad } from "./hooks/useLocalStorage";
import { CornerAlertManager } from "./pages/components/alert/CornerAlert";
import GamePage from "./pages/game/GamePage";
import QuickPlayPage from "./pages/game/quickplay/QuickPlayPage";
import LobbyPage from "./pages/lobby/LobbyPage";
import StatsPage from "./pages/stats/StatsPage";
import HelpPage from "./pages/tutorial/HelpPage";
import "./styles/tailwind.css";

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
            <AudioSettingsContextProvider>
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
            </AudioSettingsContextProvider>
          </CornerAlertManager>
        </LobbyContext.Provider>
      </IOProvider>
    </div>
  );
};

export default App;
