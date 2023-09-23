import { Socket } from "socket.io";
import ScoreCollection from "../../db/models/score/ScoreCollection";
import { WeightedRandom } from "../random/weighted-random";
import Log from "@frasermcc/log";
import { ClassicCheatEngine, Dimensions } from "./ClassicCheatEngine";

const rng = new WeightedRandom([100, 100, 100, 100, 100, 100, 100, 100, 100]);

export class BaseGameManager {
  private originalValues: number[] = [];
  private values: number[] = [];

  private score = 0;

  private active = false;
  private cheatEngine: ClassicCheatEngine;

  constructor(
    gameSize: number,
    private readonly goal: number,
    private readonly playerSocket: Socket,
    private readonly socketId?: string
  ) {
    for (let i = 0; i < gameSize; i++) {
      this.values.push(rng.next() + 1);
    }
    this.originalValues = this.values.slice();

    this.cheatEngine = new ClassicCheatEngine({
      goal,
      originalBoard: this.originalValues,
      socketId: this.socketId ?? "",
    });
  }

  getGameState(): number[] {
    return this.values.slice();
  }

  simulate(selectedIndices: number[], boardDimensions: Dimensions): void {
    if (!boardDimensions)
      return Log.warn(`${this.socketId}: Board dimensions not provided.`);

    if (!this.active) return Log.warn(`${this.socketId}: Game is not active.`);

    const isValidMove = this.cheatEngine.checkMove(
      this.values,
      selectedIndices,
      boardDimensions
    );

    if (!isValidMove) return;

    const nonZeroIndices = selectedIndices.filter(
      (index) => this.values[index] !== 0
    );

    for (const index of nonZeroIndices) {
      this.values[index] = 0;
    }

    this.score += nonZeroIndices.length;
    Log.info(`${this.socketId}: Score Updated to ${this.score}.`);
  }

  getScore(): number {
    return this.score;
  }

  async startGame(): Promise<void> {
    this.playerSocket.emit("quickplayStart", { values: this.getGameState() });
    this.active = true;

    const twoMinutesAndBuffer = 122 * 1000;
    await new Promise<void>((res) =>
      setTimeout(() => res(), twoMinutesAndBuffer)
    );

    this.active = false;
    this.end();
  }

  end(): void {
    this.playerSocket.emit("quickplayEnd", { score: this.getScore() });
    this.playerSocket.removeAllListeners("move");

    Log.info(`${this.socketId}: Game ended with score ${this.score}.`);
  }

  async post(name: string): Promise<void> {
    if (this.score > this.originalValues.length) {
      return Log.error(
        `${this.socketId}: Score is greater than the number of apples.`
      );
    }

    await ScoreCollection.addSubmission({
      board: "classic",
      name,
      layout: this.originalValues,
      score: this.score,
      time: Date.now(),
    });
    return Log.info(`${this.socketId}: Submitted score of ${this.score}.`);
  }
}
