import React, { useState } from "react";
import "./styles/tailwind.css";
import GamePage from "./pages/game/GamePage";
import { IOProvider, useIOInitializer } from "./hooks/useIO";
import LobbyPage from "./pages/lobby/LobbyPage";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import QuickPlayPage from "./pages/game/quickplay/QuickPlayPage";

const App: React.FC = () => {
  const endpoint = process.env.REACT_APP_ENDPOINT;
  const socket = useIOInitializer(endpoint || "");

  const [name, setName] = useState("");

  return (
    <IOProvider value={socket}>
      <Router>
        <Switch>
          <Route path="/game/:gameId">
            <GamePage playerId={name} />
          </Route>
          <Route path="/quickplay">
            <QuickPlayPage />
          </Route>
          <Route path="/">
            <LobbyPage setName={setName} name={name} />
          </Route>
        </Switch>
      </Router>
    </IOProvider>
  );
};

export default App;
