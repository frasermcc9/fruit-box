import Log from "@frasermcc/log";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import GlobalCollection from "./db/models/global/GlobalCollection";
import {
  GameManager,
  GameManagerFactory,
  PlayerFlag,
} from "./GameManager/GameManager";
import { ControlledSettings } from "./GameManager/GameSettings";
import { User } from "./types/User";

export class IOSingleton {
  private static instance: IOSingleton;

  private gameManagerFactory?: GameManagerFactory;

  private gameMap: Map<string, GameManager> = new Map();

  private socketMap: Map<Socket, User> = new Map();

  private constructor(
    private readonly io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap
    >
  ) {
    this.io.on("connection", (socket) => {
      Log.info(`Socket from ${socket.handshake.address} connected.`);
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
    this.socketMap.set(socket, { startTime: new Date() });

    socket.on("requestCreateGame", ({ name }) => {
      this.ensureDependencies();
      const gameManager = this.gameManagerFactory!(200, 10, this.io);
      gameManager.addOwner(name, socket);

      socket.join(gameManager.getCode());
      this.gameMap.set(gameManager.getCode(), gameManager);

      socket.on(
        "requestSettingsUpdate",
        ({ settings }: { settings: ControlledSettings }) => {
          gameManager.setSettings(settings);
          this.io
            .to(gameManager.getCode())
            .emit("settingsUpdate", { settings });
        }
      );

      socket.emit("gameJoined", {
        code: gameManager.getCode(),
        players: gameManager.getPlayers(),
      });

      socket.once("startGame", ({ settings }) => {
        socket.removeAllListeners("requestSettingsUpdate");
        gameManager.setSettings(settings);
        gameManager.startGame();
      });

      socket.once("disconnect", () => {
        gameManager.clear();
        this.gameMap.delete(gameManager.getCode());
      });
    });

    socket.on("requestJoinGame", ({ code, name }) => {
      Log.info(`${name} is joining ${code}`);
      this.ensureDependencies();
      const room = this.gameMap.get(code);
      if (!room) {
        return socket.emit("roomJoinFail", { reason: "Room does not exist." });
      }
      const couldJoin = room.addPlayer(name, socket);
      if (!couldJoin) {
        return socket.emit("roomJoinFail", {
          reason: "Someone already has that name, or the game is started.",
        });
      }

      socket.join(room.getCode());

      socket.on("readyUp", () => {
        Log.trace(`${name} is ready up`);
        room.readyUp(name);
      });

      socket.emit("gameJoined", {
        code: room.getCode(),
        players: room.getPlayers(),
      });

      socket.once("disconnect", () => {
        room.removePlayer(name);
      });
    });

    socket.on("gameRequest", async ({ code, name }) => {
      socket.removeAllListeners("gameResult");
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

      socket.once("playAgain", () => {
        socket.emit("gameReset", {
          code: gameManager.getCode(),
          players: gameManager.getPlayers(),
        });
      });

      await new Promise<void>((res) => setTimeout(() => res(), 120 * 1000));

      socket.removeAllListeners("move").removeAllListeners("timeOver");
    });

    socket.on("quickplayOver", async () => {
      await (await GlobalCollection.getCollection()).addSeconds(120);
    });

    socket.on("quickplaySubmission", async ({ mode, score, name, layout }) => {
      Log.info(`${name} submitted a quickplay score of ${score}.`);
      (await GlobalCollection.getCollection()).addSubmission({
        board: mode,
        name,
        score,
        time: Date.now(),
        layout,
      });
    });

    socket.on("disconnect", async () => {
      socket.removeAllListeners();

      const start = this.socketMap.get(socket)?.startTime;
      const end = new Date();
      const duration = (end.getTime() - start!.getTime()) / 1000;
      Log.info(`A socket has disconnected after ${duration} seconds.`);

      this.socketMap.delete(socket);
    });
  }

  private ensureDependencies() {
    if (!this.gameManagerFactory) {
      throw new SyntaxError("GameManagerFactory is not set");
    }
  }
}
