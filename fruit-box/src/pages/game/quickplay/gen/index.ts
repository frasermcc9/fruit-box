import { SimpleApple, Entity } from "../modifier";

export type Board = Entity[];

export interface BoardModifier {
  modify(board: BoardGenerator): void;
}

interface BoardGeneratorArgs {
  appleCount?: number;
  target?: number;
  replay?: number[];
}

export interface BoardGenerator {
  applyModifier(modifier: BoardModifier): BoardGenerator;
  getSimpleIndices(count: number, threshold?: number): number[];
  getBoard(): Board;
}

export class BoardCreator implements BoardGenerator {
  private appleCount?: number;
  private target?: number;

  private board: Entity[];

  constructor({ appleCount, target, replay }: BoardGeneratorArgs) {
    if (appleCount && target) {
      this.appleCount = appleCount;
      this.target = target;
      this.board = this.generate();
      return;
    } else if (replay) {
      this.board = this.generateReplay(replay);
      return;
    }
    throw new Error("Incorrect BoardCreator arguments");
  }

  public getBoard(): Board {
    return this.board;
  }

  public applyModifier(modifier: BoardModifier): BoardGenerator {
    modifier.modify(this);
    return this;
  }

  public getSimpleIndices(count: number, threshold: number = 200): number[] {
    const indices = new Set<number>();

    let breaker = 0;
    while (indices.size < count && breaker < threshold) {
      breaker++;
      const index = ~~(Math.random() * this.board.length);
      if (this.board[index].isSimpleApple()) {
        indices.add(index);
      }
    }
    return Array.from(indices);
  }

  private generate(): Board {
    if (!this.appleCount || !this.target) {
      throw new Error("Incorrect BoardCreator arguments");
    }
    return Array.from({ length: this.appleCount }, (_, i) => {
      return new SimpleApple({
        index: i,
        value: 1 + ~~(Math.random() * (this.target! - 1)),
      });
    });
  }

  private generateReplay(values: number[]): Board {
    return values.map((value, index) => new SimpleApple({ index, value }));
  }
}
