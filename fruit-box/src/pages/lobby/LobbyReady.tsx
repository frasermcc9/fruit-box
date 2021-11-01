import React from "react";
import { Player } from "../../common/Player";
import { CheckCircleIcon, UserCircleIcon } from "@heroicons/react/outline";
import Countdown from "../game/Countdown";

interface Props {
  code: string;
  players: Player[];
  user: string;
  owner: boolean;
  handleStart: () => void;
  handleReady: () => void;
  showCountdown: boolean;
}

const LobbyReady: React.FC<Props> = ({
  code,
  players,
  user,
  owner,
  handleStart,
  handleReady,
  showCountdown,
}) => {
  const getDescriber = (player: Player) => {
    if (player.name === user) {
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
      <Countdown showCountdown={showCountdown} />

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
          <div key={player.name} className="p-4 px-8 flex justify-between">
            <div className="flex gap-x-4 items-center">
              <div className="font-semibold">{player.name}</div>
              {player.ready && (
                <CheckCircleIcon className="w-6 text-green-500" />
              )}
              {player.host && <UserCircleIcon className="w-6 text-red-500" />}
            </div>

            <div>{getDescriber(player)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LobbyReady;
