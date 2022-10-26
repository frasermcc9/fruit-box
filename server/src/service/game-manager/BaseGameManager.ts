import { Server, Socket } from "socket.io";
import GlobalCollection from "../../db/models/global/GlobalCollection";
import ScoreCollection from "../../db/models/score/ScoreCollection";

export class BaseGameManager {
  private originalValues: number[] = [];
  private values: number[] = [];

  private score = 0;

  private active = false;

  constructor(
    gameSize: number,
    private readonly goal: number,
    private readonly playerSocket: Socket
  ) {
    for (let i = 0; i < gameSize; i++) {
      this.values.push(1 + ~~(Math.random() * (goal - 1)));
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
    const valid =
      selectedIndices.reduce((acc, idx) => acc + this.values[idx], 0) ===
      this.goal;

    if (!valid) {
      return;
    }

    for (const index of selectedIndices) {
      this.values[index] = 0;
    }
    this.score += selectedIndices.length;
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
    await ScoreCollection.addSubmission({
      board: "classic",
      name,
      layout: this.originalValues,
      score: this.score,
      time: Date.now(),
    });
  }
}
