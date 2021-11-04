import React from "react";
import Modal from "../components/Modal";
import LeaderBoard from "./Leaderboard";

interface Props {
  scores: Record<string, number>;
  playAgain: () => void;
}

const GameOverModal: React.FC<Props> = ({ scores, playAgain }) => {
  return (
    <Modal>
      <div className="flex flex-col items-center dark:text-gray-100 gap-y-16 max-w-lg w-full">
        <div>
          <LeaderBoard scores={scores} />
        </div>
        <button
          onClick={playAgain}
          className="transition-all duration-300 w-32 text-xl text-white bg-green-400 p-3 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
        >
          Play Again
        </button>
      </div>
    </Modal>
  );
};

export default GameOverModal;
