import React, { useContext, useMemo, useState } from "react";
import { NavFunction } from "../../App";
import { useIO } from "../../hooks/useIO";
import LobbyReady from "./LobbyReady";

interface Props {
  nav: NavFunction;
  setContext: ({
    playerId,
    gameId,
  }: {
    playerId: string;
    gameId: string;
  }) => void;
}

const LobbyPage: React.FC<Props> = ({ nav, setContext }) => {
  const io = useIO();
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [players, setPlayers] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [requestedCode, setRequestedCode] = useState("");
  const [isOwner, setOwner] = useState(false);

  const requestCreateGame = () => {
    io?.emit("requestCreateGame", { name }).once("gameJoined", (args) => {
      setOwner(true);
      handleJoinGame(args);
    });
  };

  const requestJoinGame = () => {
    io?.emit("requestJoinGame", { name, code: requestedCode }).once(
      "gameJoined",
      handleJoinGame
    );
  };

  const handleJoinGame = ({
    code,
    players,
  }: {
    code: string;
    players: string[];
  }) => {
    setLobbyCode(code);
    setPlayers(players);

    io?.on("playerJoin", ({ players }) => {
      setPlayers(players);
    });

    io?.once("gameStarted", () => {
      nav("game");
      setContext({
        playerId: name,
        gameId: code,
      });
      io.removeAllListeners("playerJoin");
    });
  };

  const startGame = () => {
    io?.emit("startGame");
  };

  const readyUp = () => {
    io?.emit("readyUp");
  };

  return (
    <div className="flex flex-col justify-center h-screen items-center gap-y-8">
      <div className="font-bold text-4xl">Welcome to the Lobby</div>
      {lobbyCode === "" ? (
        <div className="flex flex-col">
          <input
            type="text"
            className="form-input font-semibold text-lg rounded transition-all outline-none focus:outline-none focus:border-green-500 border-2 focus:ring-0 mb-12"
            placeholder="Your nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex flex-col gap-y-6">
            <button
              onClick={requestCreateGame}
              className="transition-all duration-300 text-xl text-white bg-green-400 p-4 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
              disabled={name.length === 0}
            >
              Create Game
            </button>
            <div className="flex gap-x-4">
              <input
                type="text"
                className="form-input rounded transition-all outline-none focus:outline-none focus:border-green-500 border-2 focus:ring-0"
                placeholder="Or enter an existing code..."
                value={requestedCode}
                onChange={(e) => setRequestedCode(e.target.value)}
              />
              <button
                onClick={requestJoinGame}
                className="transition-all duration-300 w-32 text-xl text-white bg-green-400 p-3 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
                disabled={name.length === 0}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      ) : (
        <LobbyReady
          code={lobbyCode}
          players={players}
          user={name}
          owner={isOwner}
          handleStart={startGame}
          handleReady={readyUp}
        />
      )}
    </div>
  );
};

export default LobbyPage;
