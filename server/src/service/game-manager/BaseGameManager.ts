import { Socket } from "socket.io";
import ScoreCollection from "../../db/models/score/ScoreCollection";
import { WeightedRandom } from "../random/weighted-random";
import Log from "@frasermcc/log";

const rng = new WeightedRandom([100, 100, 100, 100, 100, 100, 100, 100, 100]);

export class BaseGameManager {
  private originalValues: number[] = [];
  private values: number[] = [];

  private score = 0;

  private active = false;

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
  }

  getGameState(): number[] {
    return this.values.slice();
  }

  simulate(selectedIndices: number[]): void {
    if (!this.active) {
      return;
    }

    if (selectedIndices.some((idx) => this.values[idx] === 0)) {
      Log.info(`${this.socketId}: Invalid move, potentially a cheat.`);
      return;
    }

    const valid =
      selectedIndices.reduce((acc, idx) => acc + this.values[idx], 0) ===
      this.goal;

    if (!valid) {
      Log.info(`${this.socketId}: Invalid move, potentially a cheat.`);
      return;
    }

    for (const index of selectedIndices) {
      this.values[index] = 0;
    }

    this.score += selectedIndices.length;
    Log.info(`${this.socketId}: Score Updated to ${this.score}.`);
  }

  getScore(): number {
    return this.score;
  }

  async startGame(): Promise<void> {
    this.playerSocket.emit("quickplayStart", { values: this.getGameState() });
    this.active = true;

    await new Promise<void>((res) => setTimeout(() => res(), 122 * 1000));

    this.active = false;
    this.end();
  }

  end(): void {
    this.playerSocket.emit("quickplayEnd", { score: this.getScore() });
    this.playerSocket.removeAllListeners("move");
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
