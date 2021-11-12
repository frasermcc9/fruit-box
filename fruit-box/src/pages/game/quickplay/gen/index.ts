import { SimpleApple, Entity } from "../modifier";

export type Board = Entity[];

export interface BoardModifier {
  modify(board: BoardGenerator): void;
}

interface BoardGeneratorArgs {
  appleCount: number;
  target: number;
}

export interface BoardGenerator {
  applyModifier(modifier: BoardModifier): BoardGenerator;
  getSimpleIndices(count: number, threshold?: number): number[];
  getBoard(): Board;
}

export class BoardCreator implements BoardGenerator {
  private appleCount: number;
  private target: number;

  private board: Entity[];

  constructor({ appleCount, target }: BoardGeneratorArgs) {
    this.appleCount = appleCount;
    this.target = target;

    this.board = this.generate();
  }

  public getBoard(): Board {
    return this.board;
  }

  public applyModifier(modifier: BoardModifier): BoardGenerator {
    modifier.modify(this);
    return this;
  }

  public getSimpleIndices(count: number, threshold: number = 100): number[] {
    const indices = new Set<number>();

    let breaker = 0;
    while (indices.size < count && breaker < threshold) {
      breaker++;
      indices.add(~~(Math.random() * this.board.length));
    }
    return Array.from(indices);
  }

  private generate(): Board {
    return Array.from({ length: this.appleCount }, (_, i) => {
      return new SimpleApple({
        index: i,
        value: 1 + ~~(Math.random() * (this.target - 1)),
      });
    });
  }
}
