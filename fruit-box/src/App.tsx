import React, { useEffect, useState } from "react";
import "./styles/tailwind.css";
import GamePage from "./pages/game/GamePage";
import { IOProvider, useIOInitializer } from "./hooks/useIO";
import LobbyPage from "./pages/lobby/LobbyPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import QuickPlayPage from "./pages/game/quickplay/QuickPlayPage";
import { CornerAlertManager } from "./pages/components/alert/CornerAlert";
import { useLocalStorageOnLoad } from "./hooks/useLocalStorage";
import { Lobby, LobbyContext } from "./hooks/useLobby";

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
    <IOProvider value={socket}>
      <LobbyContext.Provider value={{ ...lobbyContext, setLobbyContext }}>
        <CornerAlertManager>
          <Router>
            <Switch>
              <Route path="/game/:gameId">
                <GamePage />
              </Route>
              <Route path="/quickplay">
                <QuickPlayPage />
              </Route>
              <Route path="/">
                <LobbyPage />
              </Route>
            </Switch>
          </Router>
        </CornerAlertManager>
      </LobbyContext.Provider>
    </IOProvider>
  );
};

export default App;
