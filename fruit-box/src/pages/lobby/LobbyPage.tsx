import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Player } from "../../common/Player";
import { useIO } from "../../hooks/useIO";
import useLobby from "../../hooks/useLobby";
import { useLocalStorageOnLoad } from "../../hooks/useLocalStorage";
import LobbyReady from "./LobbyReady";

interface Props {}

const LobbyPage: React.FC<Props> = () => {
  const io = useIO();
  const { code, name, players, setLobbyContext, settings } = useLobby();
  const history = useHistory();
  const { search } = useLocation();

  const [requestedCode, setRequestedCode] = useState("");

  const [showCountdown, setShowCountdown] = useState(false);

  const saveName = useLocalStorageOnLoad("username");

  useEffect(() => {
    if (code.length === 0) {
      return;
    }
    handleJoinGame({
      code,
      players,
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const invite = params.get("invite");
    if (invite) {
      setRequestedCode(invite);
    }
  }, [search]);

  useEffect(() => {
    io?.once("gameJoined", handleJoinGame);
    io?.once("gameStarted", ({ players, settings }) => {
      setShowCountdown(true);
      setLobbyContext((old) => ({ ...old, players, settings }));
      io?.removeAllListeners("playerUpdate");
      setTimeout(() => {
        history.push(`/game/${code}`);
      }, 5000);
    });
    return () => {
      io?.off("gameJoined", handleJoinGame);
      io?.removeAllListeners("gameStarted");
    };
  }, [io, code]);

  const requestCreateGame = () => {
    io?.emit("requestCreateGame", { name });
  };

  const requestJoinGame = (code?: string) => {
    io?.emit("requestJoinGame", { name, code: code ?? requestedCode });
  };

  const handleJoinGame = ({
    code,
    players,
  }: {
    code: string;
    players: Player[];
  }) => {
    setLobbyContext((old) => ({ ...old, code, players }));

    io?.on("playerUpdate", ({ players }) => {
      setLobbyContext((old) => ({ ...old, players }));
    });
  };

  const startGame = () => {
    io?.emit("startGame", { settings });
  };

  const readyUp = () => {
    io?.emit("readyUp");
  };

  return (
    <>
      <div className="w-full mx-auto max-w-xl px-4 flex flex-col justify-center mt-8 md:h-screen md:mt-0 gap-y-8 dark:text-gray-100 mb-10 md:mb-0">
        <div className="font-bold md:text-4xl text-2xl text-center">
          <div className="relative">
            Apple Game
            <div className="transform rotate-[20deg] text-red-500 absolute right-32 -top-4">
              200
            </div>
          </div>
        </div>
        {code === "" ? (
          <div className="flex flex-col w-full">
            <div className="border dark:border-dark-400 shadow p-4 rounded">
              <h1 className="text-center font-bold mb-6 md:text-xl text:lg">
                Multiplayer
              </h1>
              <input
                type="text"
                className="form-input font-semibold w-full text-lg rounded transition-all outline-none focus:outline-none focus:border-green-500 border-2 focus:ring-0 mb-5 dark:bg-dark-600"
                placeholder="Your nickname"
                value={name}
                onChange={(e) => {
                  saveName(e.target.value);
                  setLobbyContext((old) => ({ ...old, name: e.target.value }));
                }}
              />
              <div className="flex flex-col">
                <div className="flex flex-col border-t border-b pt-4 pb-6 border-gray-300">
                  <h2 className="text-center font-semibold text-lg pb-2">
                    Create a lobby
                  </h2>
                  <button
                    onClick={requestCreateGame}
                    className="transition-all duration-300 text-xl text-white bg-green-400 p-4 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
                    disabled={name.length === 0}
                  >
                    Create Game
                  </button>
                </div>
                <div className="flex flex-col border-t pt-6 pb-4 border-gray-300">
                  <h2 className="text-center font-semibold text-lg pb-2">
                    Join a lobby
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <input
                      type="text"
                      className="form-input rounded transition-all outline-none focus:outline-none focus:border-green-500 border-2 focus:ring-0 dark:bg-dark-600 flex-grow"
                      placeholder="Or enter an existing code..."
                      value={requestedCode}
                      onChange={(e) => setRequestedCode(e.target.value)}
                    />
                    <button
                      onClick={() => requestJoinGame()}
                      className="transition-all duration-300 md:w-32 text-xl text-white bg-green-400 p-3 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
                      disabled={name.length === 0}
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border dark:border-dark-400 shadow p-4 rounded flex flex-col my-8">
              <h1 className="text-center font-bold md:text-xl text:lg">
                Single player
              </h1>
              <button
                onClick={() => history.push("/quickplay")}
                className="transition-all duration-300 shadow mt-8 text-xl text-white p-3 font-semibold rounded-lg bg-blue-400 hover:bg-blue-500 active:hover:bg-blue-600"
              >
                Blitz
              </button>
              <button
                onClick={() => history.push("/quickplay?classic=true")}
                className="transition-all duration-300 shadow mt-4 text-xl text-white p-3 font-semibold rounded-lg bg-red-400 hover:bg-red-500 active:hover:bg-red-600"
              >
                Classic
              </button>
            </div>
          </div>
        ) : (
          <LobbyReady
            code={code}
            players={players}
            user={name}
            owner={players.find((p) => p.name === name)?.host ?? false}
            handleStart={startGame}
            handleReady={readyUp}
            showCountdown={showCountdown}
          />
        )}
      </div>
    </>
  );
};

export default LobbyPage;
