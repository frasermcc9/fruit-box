import React, { useContext } from "react";
import { ControlledSettings } from "../common/ControlledSettings";
import { Player } from "../common/Player";

interface Lobby {
  name: string;
  players: Player[];
  code: string;
  settings: ControlledSettings;
  setLobbyContext: React.Dispatch<
    React.SetStateAction<Omit<Lobby, "setLobbyContext">>
  >;
}

const LobbyContext = React.createContext<Lobby>({
  name: "",
  players: [],
  code: "",
  settings: {
    gameDuration: 120,
    regenerationTime: 10,
  },
  setLobbyContext: () => {},
});

const useLobby = () => useContext(LobbyContext);

export default useLobby;
export type { Lobby };
export { LobbyContext };
