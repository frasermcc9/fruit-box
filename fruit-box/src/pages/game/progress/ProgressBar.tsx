import React from "react";
import "./ProgressBar.css";

const ProgressBar: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-1 shadow h-full flex items-end">
      <div className="w-full h-full px-3 rounded-lg bg-green-400 dark:bg-green-600 progress" />
    </div>
  );
};

export default ProgressBar;
