import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const IOContext = createContext<Socket | null>(null);
const { Consumer, Provider } = IOContext;

export const useIOInitializer = (addr: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(addr);
    setSocket(socket);

    window.addEventListener("unload", () => socket.disconnect());

    return () => {
      socket.disconnect();
    };
  }, [addr]);

  return socket;
};

export const useIO = () => useContext(IOContext);

export { Provider as IOProvider, Consumer as IOConsumer, IOContext };
