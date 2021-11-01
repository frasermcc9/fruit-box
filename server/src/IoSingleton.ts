import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameManager, GameManagerFactory, PlayerFlag } from "./GameManager";

export class IOSingleton {
  private static instance: IOSingleton;

  private gameManagerFactory?: GameManagerFactory;

  private gameMap: Map<string, GameManager> = new Map();

  private constructor(
    private readonly io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap
    >
  ) {
    this.io.on("connection", (socket) => {
      console.log("New Connection!");
      this.onConnection(socket);
    });
  }

  public static initialize(
    server: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
  ): void {
    IOSingleton.instance = new IOSingleton(server);
  }

  public static getInstance(): IOSingleton {
    if (!IOSingleton.instance) {
      throw new SyntaxError("IOSingleton is not initialized");
    }
    return IOSingleton.instance;
  }

  public setGameManagerFactory(factory: GameManagerFactory) {
    this.gameManagerFactory = factory;
  }

  private onConnection(
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
  ) {
    socket.on("requestCreateGame", ({ name }) => {
      this.ensureDependencies();
      const gameManager = this.gameManagerFactory!(200, 10, this.io);
      gameManager.addPlayer(name, PlayerFlag.OWNER);

      socket.join(gameManager.getCode());
      this.gameMap.set(gameManager.getCode(), gameManager);
      socket.emit("gameJoined", {
        code: gameManager.getCode(),
        players: gameManager.getPlayers(),
      });

      socket.once("startGame", () => {
        gameManager.startGame();
      });
    });

    socket.on("requestJoinGame", ({ code, name }) => {
      this.ensureDependencies();
      const room = this.gameMap.get(code);
      if (!room) {
        return socket.emit("roomJoinFail", { reason: "Room does not exist." });
      }
      const couldJoin = room.addPlayer(name);
      if (!couldJoin) {
        return socket.emit("roomJoinFail", {
          reason: "Someone already has that name, or the game is started.",
        });
      }

      socket.join(room.getCode());

      socket.once("readyUp", () => {
        room.readyUp(name);
      });

      socket.emit("gameJoined", {
        code: room.getCode(),
        players: room.getPlayers(),
      });
    });

    socket.on("gameRequest", async ({ code, name }) => {
      socket.removeAllListeners("gameResult");
      socket.removeAllListeners("readyUp");

      this.ensureDependencies();

      const gameManager = this.gameMap.get(code);

      if (!gameManager) return;

      socket.on("move", (indices: number[]) => {
        gameManager.simulate(indices, name);
        this.io
          .to(code)
          .emit(
            "moveResult",
            gameManager.getGameState(),
            gameManager.getScores()
          );
      });

      socket.emit("gameResponse", gameManager.getGameState());

      await Promise.race([
        new Promise<void>((res) => socket.once("timeOver", () => res())),
        new Promise<void>((res) => setTimeout(() => res(), 121 * 1000)),
      ]);

      socket.removeAllListeners("move").removeAllListeners("timeOver");
      socket.emit("gameResult", gameManager.getScores());

      this.gameMap.delete(code);
    });

    socket.on("disconnect", () => {});
  }

  private ensureDependencies() {
    if (!this.gameManagerFactory) {
      throw new SyntaxError("GameManagerFactory is not set");
    }
  }
}
