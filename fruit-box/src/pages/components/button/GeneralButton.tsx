import React from "react";

interface Props {
  onClick: () => void;
  text: string;
}

const GeneralButton: React.FC<Props> = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 md:w-32 text-xl text-white bg-green-500 p-3 font-semibold rounded-xl hover:bg-green-600 active:hover:bg-green-700 disabled:bg-gray-500"
    >
      {text}
    </button>
  );
};

export default GeneralButton;
