export class MoveFinder {
  private board: number[][];

  constructor(inputBoard: number[], { rowSize }: BoardSettings) {
    const copy = inputBoard.slice();
    this.board = this.dimensionalize(copy, rowSize);
  }

  doesHaveMoves() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const hasMoves = this.checkIndex(i, j);
        if (hasMoves) return true;
      }
    }
    return false;
  }

  private checkIndex(row: number, col: number) {
    if (this.board[row][col] === 0) return false;

    if (row >= this.board.length || col >= this.board[row].length) return false;
    return true;
  }

  private expand(
    rowDir: RowDirection,
    colDir: ColDirection,
    row: number,
    col: number
  ): number {
    let count = this.board[row][col];

    let currentRow = row;
    let currentCol = col;

    return 0;
  }

  private dimensionalize(input: number[], rowSize: number): number[][] {
    const copy = input.slice();
    const output: number[][] = [];
    while (copy.length) output.push(copy.splice(0, rowSize));

    return output;
  }
}

interface BoardSettings {
  rowSize: number;
}

enum RowDirection {
  Up = -1,
  Down = 1,
}

enum ColDirection {
  Left = -1,
  Right = 1,
}
