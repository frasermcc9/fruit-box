import React from "react";
import useSWR from "swr";
import { apiBase, fetcher } from "../../utils/Api";

const TimeSection: React.FC = () => {
  const { data } = useSWR(`${apiBase}/stats/time`, fetcher);
  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsLeft = Math.floor(seconds % 60);

    return {
      days,
      hours,
      minutes,
      seconds: secondsLeft,
    };
  };

  if (!data) return null;

  const { days, hours, minutes, seconds } = formatTime(data);

  return (
    <div className="dark:bg-dark-600 shadow-xl rounded-lg p-4 px-8 my-4 text-center">
      <h2 className="text-3xl font-semibold mb-4">Time Wasted</h2>
      <div className="mt-8">
        <p className="text-lg mb-4 font-semibold">
          When you clicked on this page...
        </p>
        <div className="flex gap-x-4">
          <div>
            <span className="text-5xl font-bold">{days}</span>
            <span className="text-xl font-medium"> days</span>
          </div>
          <div>
            <span className="text-5xl font-bold">{hours}</span>
            <span className="text-xl font-medium"> hours</span>
          </div>
          <div>
            <span className="text-5xl font-bold">{minutes}</span>
            <span className="text-xl font-medium"> minutes</span>
          </div>
          <div>
            <span className="text-5xl font-bold">{seconds}</span>
            <span className="text-xl font-medium"> seconds</span>
          </div>
        </div>
        <div className="mt-8 text-lg font-semibold">
          Have been wasted on this game...
        </div>
      </div>
    </div>
  );
};

export default TimeSection;
