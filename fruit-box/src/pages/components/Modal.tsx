import React from "react";
import "./Modal.css";

const Modal: React.FC = ({ children }) => {
  return (
    <div className="fixed w-screen h-screen top-0 left-0 modal-centered">
      <div className="max-w-lg w-full h-full mx-auto my-auto md:block hidden">
        <div className="p-10 px-20 mt-[50%] max-w-lg rounded bg-white dark:bg-dark-600 shadow-lg">
          {children}
        </div>
      </div>
      <div className="max-w-lg w-full h-full mx-auto my-auto md:hidden block">
        <div className="p-10 px-20 w-full h-full rounded bg-white dark:bg-dark-600 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
