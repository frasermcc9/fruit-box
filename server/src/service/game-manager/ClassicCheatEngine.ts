import Log from "@frasermcc/log";

export interface ClassicCheatEngineProps {
  originalBoard: number[];
  socketId: string;
  goal: number;
  validDimensions: Dimensions[];
}

export interface Dimensions {
  x: number;
  y: number;
}

export class ClassicCheatEngine {
  private readonly originalBoard: number[];
  private readonly socketId: string;
  private readonly goal: number;
  private readonly validDimensions: Dimensions[];

  constructor({
    goal,
    originalBoard,
    socketId,
    validDimensions,
  }: ClassicCheatEngineProps) {
    this.originalBoard = originalBoard;
    this.socketId = socketId;
    this.goal = goal;
    this.validDimensions = validDimensions;
  }

  public getValidIndices(
    currentBoard: number[],
    selectedIndices: number[],
    dimensions: Dimensions
  ): number[] {
    Log.info(
      `[ClassicCheatEngine]: ${this.socketId}: Checking move: ${selectedIndices}`
    );

    if (
      !this.validDimensions.some(
        (d) => d.x === dimensions.x && d.y === dimensions.y
      )
    ) {
      Log.warn(
        `[ClassicCheatEngine]: ${this.socketId}: Invalid dimensions (${dimensions.x}x${dimensions.y}).`
      );
      return [];
    }

    if (selectedIndices.length > this.originalBoard.length) {
      Log.warn(
        `[ClassicCheatEngine]: ${this.socketId}: Selected indices greater than board size.`
      );
      return [];
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
      return [];
    }

    return selectedIndices.filter((index) => currentBoard[index] !== 0);
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
