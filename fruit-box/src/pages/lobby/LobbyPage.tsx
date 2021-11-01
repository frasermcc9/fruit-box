import React, { useContext, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { Player } from "../../common/Player";
import { useIO } from "../../hooks/useIO";
import LobbyReady from "./LobbyReady";

interface Props {
  setName: (name: string) => void;
  name: string;
}

const LobbyPage: React.FC<Props> = ({ setName, name }) => {
  const io = useIO();
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);

  const [requestedCode, setRequestedCode] = useState("");
  const [isOwner, setOwner] = useState(false);

  const [showCountdown, setShowCountdown] = useState(false);

  const history = useHistory();

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
    players: Player[];
  }) => {
    setLobbyCode(code);
    setPlayers(players);

    io?.on("playerUpdate", ({ players }) => {
      setPlayers(players);
    });

    io?.once("gameStarted", () => {
      setShowCountdown(true);
      setName(name);
      io.removeAllListeners("playerUpdate");
      setTimeout(() => {
        history.push(`/game/${code}`);
      }, 5000);
    });
  };

  const startGame = () => {
    io?.emit("startGame");
  };

  const readyUp = () => {
    io?.emit("readyUp");
  };

  return (
    <div className="flex flex-col justify-center h-screen items-center gap-y-8 dark:text-gray-100">
      <div className="font-bold text-4xl">Welcome to the Lobby</div>
      {lobbyCode === "" ? (
        <div className="flex flex-col">
          <div className="border dark:border-dark-400 shadow p-4 rounded">
            <h1 className="text-center font-bold mb-6 text-xl">Multiplayer</h1>
            <input
              type="text"
              className="form-input font-semibold w-full text-lg rounded transition-all outline-none focus:outline-none focus:border-green-500 border-2 focus:ring-0 mb-12 dark:bg-dark-600"
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
                  className="form-input rounded transition-all outline-none focus:outline-none focus:border-green-500 border-2 focus:ring-0 dark:bg-dark-600"
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
          <button
            onClick={() => history.push("/quickplay")}
            className="transition-all duration-300 shadow my-20 text-xl text-white bg-blue-400 p-4 font-semibold rounded-xl hover:bg-blue-500 active:hover:bg-blue-600"
          >
            Single Player
          </button>
        </div>
      ) : (
        <LobbyReady
          code={lobbyCode}
          players={players}
          user={name}
          owner={isOwner}
          handleStart={startGame}
          handleReady={readyUp}
          showCountdown={showCountdown}
        />
      )}
    </div>
  );
};

export default LobbyPage;
