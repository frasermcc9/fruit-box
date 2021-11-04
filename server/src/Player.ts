import { Socket } from "socket.io";

export class Player {
  name: string;
  ready: boolean;
  host: boolean;
  socket: Socket;

  room?: string;

  constructor(name: string, socket: Socket, host?: boolean) {
    this.name = name;
    this.ready = false;
    this.host = host ?? false;
    this.socket = socket;
  }

  addToRoom(room: string) {
    this.room = room;
  }

  removeFromRoom() {
    this.room = undefined;
  }

  toDTO(): PlayerDetail {
    return {
      name: this.name,
      ready: this.ready,
      host: this.host,
      room: this.room,
    };
  }
}

export interface PlayerDetail {
  name: string;
  ready: boolean;
  host: boolean;
  room?: string;
}
