import crypto from "crypto";
import { Server } from "socket.io";
import { Player } from "./Player";

export class GameManagerImpl implements GameManager {
  private values: number[] = [];
  private scores: Record<string, number> = {};

  private readonly code: string;
  private players: Player[] = [];
  private owner?: string;

  private started: boolean = false;

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

  addPlayer(player: string, owner?: PlayerFlag) {
    if (this.started) {
      return false;
    }

    if (this.players.filter((p) => p.name === player).length > 0) {
      return false;
    }

    if (owner === PlayerFlag.OWNER) {
      this.owner = player;
      this.players.push(new Player(player, true));
    } else {
      this.players.push(new Player(player));
    }

    this.scores[player] = 0;
    this.io.to(this.code).emit("playerUpdate", { players: this.players });

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

    for (const index of selectedIndices) {
      this.values[index] = 0;
    }
    this.scores[player] += selectedIndices.length;
  }

  getCode(): string {
    return this.code;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getScores(): Record<string, number> {
    return this.scores;
  }

  startGame(): void {
    this.started = true;
    this.io.to(this.code).emit("gameStarted", {
      values: this.values,
      players: this.players,
    });
  }

  readyUp(player: string): void {
    const playerObj = this.players.find((p) => p.name === player);
    if (!playerObj) {
      return;
    }
    playerObj.ready = true;
    this.io.to(this.code).emit("playerUpdate", { players: this.players });
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
  addPlayer(player: string, owner?: PlayerFlag): boolean;
  getCode(): string;
  getPlayers(): Player[];
  getScores(): Record<string, number>;
  startGame(): void;
  readyUp(player: string): void;
}
