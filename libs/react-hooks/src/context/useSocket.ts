import { Socket } from 'socket.io-client';
import { createStatefulContext } from './useStatefulContext';

const [useSocket, SocketContextProvider] = createStatefulContext<{
  socket: Socket | null;
}>({
  socket: null,
});

export { useSocket, SocketContextProvider };
