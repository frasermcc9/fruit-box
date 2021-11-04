import React from "react";
import participation from "../../../res/trophy/fail.webp";
import bronze from "../../../res/trophy/bronze.png";
import silver from "../../../res/trophy/silver.png";
import gold from "../../../res/trophy/gold.png";
import Modal from "../../components/Modal";

interface Props {
  score: number;
  reset: () => void;
}

const QuickPlayOver: React.FC<Props> = ({ score, reset }) => {
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
      <div className="flex flex-col items-center dark:text-gray-100">
        <img src={selectTrophy(score)} alt="trophy" className="w-32 mb-4" />
        <h1 className="text-4xl font-bold mb-8">Game Over</h1>
        <h1 className="font-semibold text-lg mb-2">Final Score</h1>
        <span className="font-bold text-6xl mb-8">{score}</span>
        <button
          onClick={reset}
          className="transition-all duration-300 w-32 text-xl text-white bg-green-400 p-3 font-semibold rounded-xl hover:bg-green-500 active:hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-auto"
        >
          Play Again
        </button>
      </div>
    </Modal>
  );
};

export default QuickPlayOver;
