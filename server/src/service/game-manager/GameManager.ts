import crypto from "crypto";
import { Server, Socket } from "socket.io";
import { Player, PlayerDetail } from "../../Player";
import Log from "@frasermcc/log";
import { TimeManager } from "../../util/TimeManager";
import { ControlledSettings } from "../GameSettings";

export class GameManagerImpl implements GameManager {
  private values: number[] = [];
  private scores: Record<string, number> = {};

  private readonly code: string;
  private players: Player[] = [];
  private owner?: Player;

  private started: boolean = false;

  private timeManager?: TimeManager;
  private userSettings?: ControlledSettings;

  constructor(
    private readonly gameSize: number,
    private readonly goal: number,
    private readonly io: Server
  ) {
    for (let i = 0; i < gameSize; i++) {
      this.values.push(1 + ~~(Math.random() * (goal - 1)));
    }
    this.code = crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  private genAppleVal() {
    return 1 + ~~(Math.random() * (this.goal - 1));
  }

  setSettings(settings: ControlledSettings) {
    this.userSettings = settings;
  }

  initTimeManager(): void {
    if (!this.userSettings) {
      return;
    }

    this.timeManager = new TimeManager(() => {
      for (let i = 0; i < this.players.length; i++) {
        const modify = ~~(this.values.length * Math.random());
        this.values[modify] = this.genAppleVal();
      }
      this.io
        .to(this.code)
        .emit("moveResult", this.getGameState(), this.getScores());
    }, this.userSettings.regenerationTime * 1000);
  }

  addOwner(name: string, socket: Socket): void {
    this.addPlayer(name, socket, PlayerFlag.OWNER);
  }

  addPlayer(player: string, socket: Socket, owner?: PlayerFlag) {
    Log.trace(`Adding player ${player}.`);
    if (this.started) {
      return false;
    }

    if (this.players.filter((p) => p.name === player).length > 0) {
      return false;
    }

    if (owner === PlayerFlag.OWNER) {
      const owner = new Player(player, socket, true);
      this.players.push(owner);
      this.owner = owner;
    } else {
      const newPlayer = new Player(player, socket);
      this.players.push(newPlayer);
    }

    this.scores[player] = 0;

    Log.trace(`Emitting playerUpdate => ${this.code}`);
    this.io.to(this.code).emit("playerUpdate", { players: this.getPlayers() });

    return true;
  }

  getGameState(): number[] {
    return this.values.slice();
  }

  simulate(selectedIndices: number[], player: string): void {
    const valid =
      selectedIndices.reduce((acc, idx) => acc + this.values[idx], 0) ===
      this.goal;

    if (!valid) {
      return;
    }

    this.timeManager?.resetTimer();

    for (const index of selectedIndices) {
      this.values[index] = 0;
    }
    this.scores[player] += selectedIndices.length;
  }

  getCode(): string {
    return this.code;
  }

  getPlayers(): PlayerDetail[] {
    return this.players.map((p) => p.toDTO());
  }

  getScores(): Record<string, number> {
    return this.scores;
  }

  async startGame(): Promise<void> {
    this.started = true;
    this.players.forEach((p) => (p.ready = false));

    this.io.to(this.code).emit("gameStarted", {
      values: this.values,
      players: this.getPlayers(),
      settings: this.userSettings,
    });

    this.initTimeManager();
    this.timeManager?.begin();

    Log.info(
      `Starting game with duration ${this.userSettings?.gameDuration} and regeneration time ${this.userSettings?.regenerationTime}`
    );

    await new Promise<void>((res) =>
      setTimeout(() => res(), (this.userSettings?.gameDuration ?? 122) * 1000)
    );
    this.timeManager?.end();
    this.io.to(this.code).emit("gameResult", this.getScores());
    this.reset();
  }

  readyUp(player: string): void {
    const playerObj = this.players.find((p) => p.name === player);
    if (!playerObj) {
      return;
    }
    playerObj.ready = true;
    this.io.to(this.code).emit("playerUpdate", { players: this.getPlayers() });
  }

  reset(): void {
    this.started = false;
    this.values = [];

    for (let i = 0; i < this.gameSize; i++) {
      this.values.push(1 + ~~(Math.random() * (this.goal - 1)));
    }

    for (const key of Object.keys(this.scores)) {
      this.scores[key] = 0;
    }

    this.owner?.socket.once("startGame", () => {
      this.startGame();
    });
  }

  clear(): void {
    for (const player of this.players) {
      player.socket.emit("terminated");
      player.socket.leave(this.code);
    }
  }

  removePlayer(player: string): void {
    this.players = this.players.filter((p) => p.name !== player);
    delete this.scores[player];
    this.io.to(this.code).emit("playerUpdate", { players: this.getPlayers() });
  }
}

export enum PlayerFlag {
  OWNER,
}

export type GameManagerFactory = (
  gameSize: number,
  goal: number,
  io: Server
) => GameManager;

export const gameManagerFactory: GameManagerFactory = (
  gameSize: number,
  gameGoal: number,
  io: Server
) => {
  return new GameManagerImpl(gameSize, gameGoal, io);
};

export interface GameManager {
  simulate(indices: number[], player: string): void;
  getGameState(): number[];
  addPlayer(player: string, socket: Socket, owner?: PlayerFlag): boolean;
  addOwner(name: string, owner?: Socket): void;
  getCode(): string;
  getPlayers(): PlayerDetail[];
  getScores(): Record<string, number>;
  startGame(): void;
  readyUp(player: string): void;
  reset(): void;
  clear(): void;
  removePlayer(player: string): void;
  setSettings(settings: ControlledSettings): void;
}
