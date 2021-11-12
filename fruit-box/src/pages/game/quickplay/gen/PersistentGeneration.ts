import { BoardGenerator, BoardModifier } from ".";
import { PersistentApple } from "../modifier/PersistentApple";

export class PersistentGenerator implements BoardModifier {
  private readonly appleCount: number;

  constructor({ appleCount }: { appleCount: number }) {
    this.appleCount = appleCount;
  }

  modify(board: BoardGenerator): void {
    const indices = board.getSimpleIndices(this.appleCount);
    for (const index of indices) {
      const primitive = board.getBoard();

      const apple = primitive[index];
      primitive[index] = new PersistentApple({
        apple,
      });
    }
  }
}
