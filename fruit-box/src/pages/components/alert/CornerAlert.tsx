import { XIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect } from "react";

interface AlertProps {
  message?: string;
  mode?: Mode;
  icon?: JSX.Element;
}

interface AlertContext {
  resetAlert: () => void;
  createAlert: (props: AlertProps) => void;
}

type Mode = "success" | "error" | "warning" | "info";

export const CornerAlertVar: AlertContext = {
  createAlert: (props: AlertProps) => {},
  resetAlert: () => {},
};

const CornerAlertContext = React.createContext<AlertContext>(CornerAlertVar);

export const useAlert = () => useContext(CornerAlertContext);

export const CornerAlertManager: React.FC = ({ children }) => {
  const [state, setState] = React.useState<AlertProps>({
    icon: <></>,
    message: "",
    mode: "info",
  });

  const create = (p: AlertProps) => {
    setState(p);
  };

  const resetAlert = () => {
    setState({
      icon: <></>,
      message: "",
      mode: "info",
    });
  };

  return (
    <CornerAlertContext.Provider value={{ createAlert: create, resetAlert }}>
      <CornerAlert {...state} onDismiss={() => resetAlert()} />
      {children}
    </CornerAlertContext.Provider>
  );
};

interface CornerAlertProps extends AlertProps {
  onDismiss: () => void;
}

export const CornerAlert: React.FC<CornerAlertProps> = ({
  message,
  mode = "info",
  onDismiss,
  icon,
}) => {
  const colorMap: Record<Mode, string> = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
  };

  const [topClassValue, setTopClassValue] = React.useState("-bottom-14");

  const [internalMessage, setInternalMessage] = React.useState(message);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (message) {
      setTopClassValue("bottom-10");
      return setInternalMessage(message);
    }

    if (internalMessage) {
      setTopClassValue("-bottom-12");
      timeout = setTimeout(() => {
        setInternalMessage("");
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [message]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${topClassValue} left-14 z-50 fixed`}
    >
      <div
        className={`shadow-lg rounded py-2 px-4 bg-dark-400 text-white dark:bg-gray-100 dark:text-dark-800`}
      >
        <div className="flex w-full items-center justify-between gap-x-2">
          <div className={`w-6 ${colorMap[mode]} motion-safe:animate-pulse`}>
            {icon}
          </div>
          <div className="text-sm font-medium">{internalMessage}</div>
          <div
            onClick={onDismiss}
            className="dark:hover:bg-gray-300 hover:bg-plainGray-600 ml-6 rounded outline-none focus:outline-none"
          >
            <XIcon className="w-8 p-1 cursor-pointer" onClick={onDismiss} />
          </div>
        </div>
      </div>
    </div>
  );
};
