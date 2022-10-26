import React, { useCallback } from "react";
import { useIO } from "../../../hooks/useIO";
import bronze from "../../../res/trophy/bronze.png";
import participation from "../../../res/trophy/fail.webp";
import gold from "../../../res/trophy/gold.png";
import silver from "../../../res/trophy/silver.png";
import Modal from "../../components/Modal";

interface Props {
  score: number;
  reset: () => void;
  mode: string;
}

const QuickPlayOver: React.FC<Props> = ({ score, reset, mode }) => {
  const socket = useIO();

  const [name, setName] = React.useState("");

  const submitScore = useCallback(() => {
    socket?.emit("quickplaySubmission", {
      mode,
      name,
    });
    reset();
  }, [mode, name, reset, socket]);

  const selectTrophy = (score: number) => {
    if (score < 50) {
      return participation;
    }
    if (score >= 50 && score <= 72) {
      return bronze;
    }
    if (score >= 73 && score <= 90) {
      return silver;
    }
    return gold;
  };

  return (
    <Modal>
      <div className="flex flex-col items-center dark:text-gray-100 text-center">
        <img src={selectTrophy(score)} alt="trophy" className="w-32 mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4 sm:mb-8">
          Game Over
        </h1>
        <h1 className="font-semibold text-lg mb-2">Final Score</h1>
        <span className="font-bold text-6xl mb-4 sm:mb-8">{score}</span>
        <button
          onClick={reset}
          className="transition-all duration-300 w-32 text-xl text-white bg-green-400 p-3 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
        >
          Play Again
        </button>
        {mode === "replay" || (
          <div className="flex flex-col gap-y-2 mt-8 mb-4">
            <input
              type="text"
              className="form-input rounded transition-all outline-none focus:outline-none focus:border-green-500 border-2 focus:ring-0 dark:bg-dark-600"
              placeholder="Name for leaderboard..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={submitScore}
              className="transition-all duration-300 text-xl text-white bg-green-400 p-2 md:p-3 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
              disabled={name.length === 0}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuickPlayOver;
