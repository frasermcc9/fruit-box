import Log from "@frasermcc/log";

export interface ClassicCheatEngineProps {
  originalBoard: number[];
  socketId: string;
  goal: number;
}

export interface Dimensions {
  x: number;
  y: number;
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

  public checkMove(
    currentBoard: number[],
    selectedIndices: number[],
    dimensions: Dimensions
  ): boolean {
    Log.info(
      `[ClassicCheatEngine]: ${this.socketId}: Checking move: ${selectedIndices}`
    );

    if (selectedIndices.length > this.originalBoard.length) {
      Log.warn(
        `[ClassicCheatEngine]: ${this.socketId}: Selected indices greater than board size.`
      );
      return false;
    }

    const valid = this.checkBoundingBox(
      currentBoard,
      selectedIndices,
      dimensions
    );

    if (!valid) {
      Log.warn(
        `[ClassicCheatEngine]: ${this.socketId}: Selected indices do not sum to goal.`
      );
      return false;
    }

    return true;
  }

  private checkBoundingBox(
    currentBoard: number[],
    selectedIndices: number[],
    dimensions: Dimensions
  ): boolean {
    const indexToCoord = (index: number): [number, number] => [
      index % dimensions.x,
      Math.floor(index / dimensions.x),
    ];

    const coordToIndex = (x: number, y: number): number => y * dimensions.x + x;

    let coords = selectedIndices.map(indexToCoord);
    let minX = dimensions.x,
      minY = dimensions.y,
      maxX = -1,
      maxY = -1;

    // Find the bounding square
    for (const [x, y] of coords) {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    // Check the sum of all elements inside the square
    let sum = 0;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const index = coordToIndex(x, y);
        sum += currentBoard[index];
      }
    }

    return sum === this.goal;
  }
}
