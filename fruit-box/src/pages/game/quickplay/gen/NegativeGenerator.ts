import { BoardGenerator, BoardModifier } from ".";
import { NegativeApple } from "../modifier/NegativeApple";

export class NegativeGenerator implements BoardModifier {
  private readonly appleCount: number;
  private readonly target: number;

  constructor({ appleCount, target }: { appleCount: number; target: number }) {
    this.appleCount = appleCount;
    this.target = target;
  }

  modify(board: BoardGenerator): void {
    const indices = board.getSimpleIndices(this.appleCount);
    for (const index of indices) {
      const primitive = board.getBoard();

      const apple = primitive[index];
      primitive[index] = new NegativeApple({
        apple,
        target: this.target,
      });
    }
  }
}
