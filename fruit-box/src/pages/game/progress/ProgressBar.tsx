import React, { useEffect, useRef } from "react";
import "./ProgressBar.css";

interface Props {
  duration: number;
}

const ProgressBar: React.FC<Props> = ({ duration }) => {
  const progressBar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressBar.current) {
      progressBar.current.style.animationDuration = `${duration - 5}s`;
    }
  }, [progressBar, duration]);

  return (
    <div className="bg-gray-800 rounded-xl p-1 shadow h-full flex items-end">
      <div
        ref={progressBar}
        className="w-full h-full px-3 rounded-lg bg-green-400 dark:bg-green-600 progress"
      />
    </div>
  );
};

export default ProgressBar;
