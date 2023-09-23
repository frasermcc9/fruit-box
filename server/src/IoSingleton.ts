import Log from "@frasermcc/log";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import GlobalCollection from "./db/models/global/GlobalCollection";
import { BaseGameManager } from "./service/game-manager/BaseGameManager";
import {
  GameManager,
  GameManagerFactory,
  PlayerFlag,
} from "./service/game-manager/GameManager";
import { ControlledSettings } from "./service/GameSettings";
import { User } from "./types/User";

export class IOSingleton {
  private static instance: IOSingleton;

  private gameManagerFactory?: GameManagerFactory;

  private gameMap: Map<string, GameManager> = new Map();
  private quickplayMap: Map<string, BaseGameManager> = new Map();

  private socketMap: Map<Socket, User> = new Map();

  private constructor(
    private readonly io: Server<
      DefaultEventsMap,
      DefaultEventsMap,
      DefaultEventsMap
    >
  ) {
    this.io.on("connection", (socket) => {
      const ip =
        socket.handshake.headers["x-forwarded-for"] || socket.handshake.address;

      Log.info(`Socket from ${ip} connected.`);
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

    socket.on("requestQuickplay", async ({ appleCount }) => {
      Log.trace(`Requesting quickplay: ID: ${socket.id}`);

      const gameManager = new BaseGameManager(appleCount, 10, socket);
      this.quickplayMap.set(socket.id, gameManager);
      socket.emit("quickplayResponse", {
        values: gameManager.getGameState(),
      });

      gameManager.startGame();

      socket.on("move", (indices: number[]) => gameManager.simulate(indices));
    });

    socket.on("quickplaySubmission", async ({ mode, name }) => {
      Log.trace(`Submitting quickplay: ID: ${socket.id}`);
      const game = this.quickplayMap.get(socket.id);

      if (!game) return;

      if (mode !== "classic") {
        return;
      }

      await game.post(name);
    });

    socket.on("disconnect", async () => {
      socket.removeAllListeners();

      const start = this.socketMap.get(socket)?.startTime;
      const end = new Date();
      const duration = (end.getTime() - start!.getTime()) / 1000;
      Log.info(`A socket has disconnected after ${duration} seconds.`);

      await (await GlobalCollection.getCollection()).addSeconds(duration);

      this.quickplayMap.delete(socket.id);
      this.socketMap.delete(socket);
    });
  }

  private ensureDependencies() {
    if (!this.gameManagerFactory) {
      throw new SyntaxError("GameManagerFactory is not set");
    }
  }
}
