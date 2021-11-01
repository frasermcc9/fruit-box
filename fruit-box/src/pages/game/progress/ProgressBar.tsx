import React from "react";
import "./ProgressBar.css";

const ProgressBar: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-1 shadow">
      <div className="w-full py-4 rounded-lg bg-green-500 progress" />
    </div>
  );
};

export default ProgressBar;
