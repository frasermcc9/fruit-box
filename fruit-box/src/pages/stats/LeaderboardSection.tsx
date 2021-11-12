import React from "react";
import useSWR from "swr";
import { apiBase, fetcher } from "../../utils/Api";
import { quickplayArray, QuickplayMode } from "../game/quickplay/QuickplayMode";

const LeaderboardSection: React.FC = () => {
  const { data } = useSWR<{
    [K in QuickplayMode]?: { name: string; score: number }[];
  }>(`${apiBase}/stats/boards`, fetcher);

  const [activeBoard, setActiveBoard] = React.useState<QuickplayMode>("blitz");

  if (!data) {
    return <div>Loading...</div>;
  }

  const selectedData = data[activeBoard];

  const resolveColor = (index: number) => {
    if (index === 0)
      return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800";
    if (index === 1)
      return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
    if (index === 2)
      return "bg-gradient-to-r from-yellow-600 to-yellow-700 text-gray-800";
    return "dark:bg-dark-600";
  };

  return (
    <>
      <div className="flex gap-x-4 justify-center">
        {quickplayArray.map((q) => (
          <LeaderboardSelector
            activeBoard={activeBoard}
            boardName={q.display}
            onChange={setActiveBoard}
            thisBoard={q.mode}
            key={q.mode}
          />
        ))}
      </div>
      <table className="-mt-2 table-fixed text-2xl font-semibold rounded dark:bg-dark-600 text-center shadow-lg divide-y divide-gray-200 dark:divide-gray-600">
        <tr className="dark:bg-dark-400 bg-gray-100 rounded ">
          <th className="w-48 rounded-tl py-4">Rank</th>
          <th className="w-48 py-4">Name</th>
          <th className="w-48 rounded-tr py-4">Score</th>
        </tr>
        {selectedData?.map((entry, index) => (
          <tr
            key={index}
            className={`${resolveColor(index)} px-6 py-4 w-screen max-w-xl ${
              index === selectedData.length - 1 ? "rounded-b" : ""
            }`}
          >
            <th className="w-48 py-4">{index + 1}</th>
            <th className="w-48 py-4">{entry.name}</th>
            <th className="w-48 py-4">{entry.score}</th>
          </tr>
        ))}
      </table>
    </>
  );
};

interface LeaderboardSelectorProps {
  activeBoard: QuickplayMode;
  thisBoard: QuickplayMode;
  onChange: (board: QuickplayMode) => void;
  boardName: string;
}

const LeaderboardSelector: React.FC<LeaderboardSelectorProps> = ({
  activeBoard,
  boardName,
  onChange,
  thisBoard,
}) => {
  const active = activeBoard === thisBoard;

  if (active) {
    return (
      <button
        className="px-4 py-2 bg-green-500 text-white text-xl font-semibold rounded-md shadow w-24"
        onClick={() => {}}
      >
        {boardName}
      </button>
    );
  }

  return (
    <button
      className="px-4 py-2 bg-dark-400 text-white text-xl font-semibold rounded-md shadow w-24"
      onClick={() => onChange(thisBoard)}
    >
      {boardName}
    </button>
  );
};

export default LeaderboardSection;
