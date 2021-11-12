import { Board, BoardGenerator, BoardModifier } from ".";
import { MultiplierApple } from "../modifier/MultiplierApple";

export class MultiplierGenerator implements BoardModifier {
  private readonly multiplier: number;
  private readonly appleCount: number;

  constructor({
    multiplier,
    appleCount,
  }: {
    multiplier: number;
    appleCount: number;
  }) {
    this.multiplier = multiplier;
    this.appleCount = appleCount;
  }

  modify(board: BoardGenerator): void {
    const indices = board.getSimpleIndices(this.appleCount);
    for (const index of indices) {
      const primitive = board.getBoard();

      const apple = primitive[index];
      primitive[index] = new MultiplierApple({
        apple,
        multiplier: this.multiplier,
      });
    }
  }
}
