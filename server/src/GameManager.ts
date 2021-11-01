import crypto from "crypto";
import { Server } from "socket.io";

export class GameManagerImpl implements GameManager {
  private values: number[] = [];
  private scores: Record<string, number> = {};

  private readonly code: string;
  private players: string[] = [];
  private owner?: string;

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
    if (this.players.includes(player)) {
      return false;
    }

    if (owner === PlayerFlag.OWNER) {
      this.owner = player;
    }

    this.players.push(player);
    this.scores[player] = 0;
    this.io.to(this.code).emit("playerJoin", { players: this.players });

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

  getPlayers(): string[] {
    return this.players;
  }

  getScores(): Record<string, number> {
    return this.scores;
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
  getPlayers(): string[];
  getScores(): Record<string, number>;
}
