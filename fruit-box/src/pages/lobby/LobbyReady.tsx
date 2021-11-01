import React, { useEffect } from "react";
import { useIO } from "../../hooks/useIO";

interface Props {
  code: string;
  players: string[];
  user: string;
  owner: boolean;
  handleStart: () => void;
  handleReady: () => void;
}

const LobbyReady: React.FC<Props> = ({
  code,
  players,
  user,
  owner,
  handleStart,
  handleReady,
}) => {
  const getDescriber = (player: string) => {
    if (player === user) {
      return "You";
    }
  };

  const actionDispatcher = () => {
    if (owner) {
      handleStart();
      return;
    }
    handleReady();
  };

  const buttonText = owner ? "Start" : "Ready Up";

  return (
    <div className="flex flex-col gap-y-4 w-full items-center">
      <button
        onClick={actionDispatcher}
        className="transition-all duration-300 w-32 text-xl text-white bg-green-400 p-3 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
      >
        {buttonText}
      </button>

      <div className="flex flex-col items-center">
        <div className="font-bold text-xl">Code</div>
        <div className="text-4xl">{code}</div>
      </div>
      <div className="shadow-md rounded w-1/3 mx-auto divide-green-500 divide-y-2">
        {players.map((player) => (
          <div key={player} className="p-4 px-8 flex justify-between">
            <div className="font-semibold">{player}</div>
            <div>{getDescriber(player)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LobbyReady;
