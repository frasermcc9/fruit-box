import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./styles/tailwind.css";
import GamePage from "./pages/game/GamePage";
import { io } from "socket.io-client";
import { IOProvider, useIOInitializer } from "./hooks/useIO";
import LobbyPage from "./pages/lobby/LobbyPage";

export type NavFunction = (s: "lobby" | "game") => void;

const App: React.FC = () => {
  const endpoint = process.env.REACT_APP_ENDPOINT;
  const socket = useIOInitializer(endpoint || "");

  const [page, setPage] = React.useState("lobby");
  const [gameContext, setGameContext] = React.useState<{
    gameId: string;
    playerId: string;
  }>({ gameId: "", playerId: "" });

  return (
    <IOProvider value={socket}>
      {page === "lobby" && (
        <LobbyPage nav={setPage} setContext={setGameContext} />
      )}
      {page === "game" && <GamePage context={gameContext} />}
    </IOProvider>
  );
};

export default App;
