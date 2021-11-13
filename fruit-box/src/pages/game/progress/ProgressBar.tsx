import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useQuickplay } from "../../../hooks/useQuickplay";
import "./ProgressBar.css";

interface Props {
  percentage: number;
}

const ProgressBar: React.FC<Props> = ({ percentage }) => {
  const progressBar = useRef<HTMLDivElement>(null);

  const [{ timerPaused }] = useQuickplay();

  const isMd = useMediaQuery("(min-width: 768px)", true, false);

  useEffect(() => {
    if (progressBar.current && !timerPaused) {
      if (isMd) {
        progressBar.current.style.width = "100%";
        progressBar.current.style.height = `${percentage}%`;
      } else {
        progressBar.current.style.height = "100%";
        progressBar.current.style.width = `${percentage}%`;
      }
    }
  }, [percentage, timerPaused, isMd]);

  return (
    <div className="bg-gray-800 rounded-xl p-1 shadow md:h-full h-8 flex items-end mx-2 md:mx-0">
      <div
        ref={progressBar}
        className={`transition-all w-full h-full px-3 rounded-lg ${
          timerPaused
            ? "bg-blue-400 dark:bg-blue-600"
            : "bg-green-400 dark:bg-green-600"
        } `}
      />
    </div>
  );
};

export default ProgressBar;
