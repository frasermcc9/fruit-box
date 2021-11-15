import React from "react";
import useSWR from "swr";
import { apiBase, fetcher } from "../../utils/Api";
import { quickplayArray, QuickplayMode } from "../game/quickplay/QuickplayMode";
import { ReplyIcon, XCircleIcon } from "@heroicons/react/outline";
import { useHistory } from "react-router";

const LeaderboardSection: React.FC = () => {
  const { data } = useSWR<{
    [K in QuickplayMode]?: {
      name: string;
      score: number;
      uuid?: string;
      layout?: number[];
    }[];
  }>(`${apiBase}/stats/boards`, fetcher);

  const history = useHistory();

  const [activeBoard, setActiveBoard] =
    React.useState<QuickplayMode>("blitz_daily");

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

  const handleClick = (id?: string, layout?: number[]) => {
    if (!id || !layout) {
      return;
    }

    sessionStorage.setItem(id, JSON.stringify(layout));
    history.push("/quickplay?replay=" + id);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center max-w-xl">
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
        <thead>
          <tr className="dark:bg-dark-400 bg-gray-100 rounded ">
            <th className="w-48 rounded-tl py-4">Rank</th>
            <th className="w-48 py-4">Name</th>
            <th className="w-48 py-4">Score</th>
            <th className="w-24 rounded-tr py-4">Play it</th>
          </tr>
        </thead>
        <tbody>
          {selectedData?.map((entry, index) => (
            <React.Fragment key={index}>
              <tr
                className={`${resolveColor(
                  index
                )} px-6 py-4 w-screen max-w-xl ${
                  index === selectedData.length - 1 ? "rounded-b" : ""
                }`}
              >
                <th className="w-48 py-4">{index + 1}</th>
                <th className="w-48 py-4">{entry.name}</th>
                <th className="w-48 py-4">{entry.score}</th>
                <th
                  className="w-16 py-4"
                  onClick={() => handleClick(entry.uuid, entry.layout)}
                >
                  {entry.layout && entry.uuid ? (
                    <ReplyIcon className="w-8 mx-auto cursor-pointer" />
                  ) : (
                    <XCircleIcon className="w-8 mx-auto cursor-not-allowed" />
                  )}
                </th>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
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
        className="px-4 py-2 bg-green-500 text-white text-xl font-semibold rounded-md shadow w-40"
        onClick={() => {}}
      >
        {boardName}
      </button>
    );
  }

  return (
    <button
      className="px-4 py-2 bg-dark-400 text-white text-xl font-semibold rounded-md shadow w-40"
      onClick={() => onChange(thisBoard)}
    >
      {boardName}
    </button>
  );
};

export default LeaderboardSection;
