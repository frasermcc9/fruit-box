import Log from "@frasermcc/log";

export interface ClassicCheatEngineProps {
  originalBoard: number[];
  socketId: string;
  goal: number;
}

export class ClassicCheatEngine {
  private readonly originalBoard: number[];
  private readonly socketId: string;
  private readonly goal: number;

  constructor({ goal, originalBoard, socketId }: ClassicCheatEngineProps) {
    this.originalBoard = originalBoard;
    this.socketId = socketId;
    this.goal = goal;
  }

  public checkMove(currentBoard: number[], selectedIndices: number[]): boolean {
    Log.info(`${this.socketId}: Checking move: ${selectedIndices}`);

    if (selectedIndices.length > this.originalBoard.length) {
      Log.warn(
        `[ClassicCheatEngine]: ${this.socketId}: Selected indices greater than board size.`
      );
      return false;
    }

    const valid =
      selectedIndices.reduce((acc, idx) => acc + currentBoard[idx], 0) ===
      this.goal;

    if (!valid) {
      Log.warn(
        `[ClassicCheatEngine]: ${this.socketId}: Selected indices do not sum to goal.`
      );
      return false;
    }

    return true;
  }
}
