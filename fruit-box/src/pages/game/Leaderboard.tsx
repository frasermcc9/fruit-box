import React from "react";

interface Props {
  scores: Record<string, number>;
}

const LeaderBoard: React.FC<Props> = ({ scores }) => {
  return (
    <div className="shadow-md max-w-xl mx-auto divide-y-2 divide-green-500 dark:text-gray-100 dark:bg-dark-400 rounded">
      {Object.entries(scores)
        .sort(([_, score], [_2, score2]) => score2 - score)
        .map(([name, score]) => {
          return (
            <div key={name} className="flex justify-between w-full p-4 text-xl">
              <div className="font-semibold">{name}</div>
              <div>{score}</div>
            </div>
          );
        })}
    </div>
  );
};

export default LeaderBoard;
