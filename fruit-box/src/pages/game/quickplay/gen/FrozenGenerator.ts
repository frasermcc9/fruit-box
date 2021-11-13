import { Board, BoardGenerator, BoardModifier } from ".";
import { QuickplayContext, SetFunction } from "../../../../hooks/useQuickplay";
import { FrozenApple } from "../modifier/FrozenApple";
import { MultiplierApple } from "../modifier/MultiplierApple";

export class FrozenGenerator implements BoardModifier {
  private readonly appleCount: number;
  private readonly context: SetFunction<QuickplayContext>;

  constructor({
    appleCount,
    context,
  }: {
    appleCount: number;
    context: SetFunction<QuickplayContext>;
  }) {
    this.appleCount = appleCount;
    this.context = context;
  }

  modify(board: BoardGenerator): void {
    const indices = board.getSimpleIndices(this.appleCount);
    for (const index of indices) {
      const primitive = board.getBoard();

      const apple = primitive[index];
      primitive[index] = new FrozenApple({
        apple,
        gameContext: this.context,
      });
    }
  }
}
