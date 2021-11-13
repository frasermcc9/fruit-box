import { Entity, ExtendedApple } from ".";
import { QuickplayContext, SetFunction } from "../../../../hooks/useQuickplay";

interface Args {
  apple: Entity;
  gameContext: SetFunction<QuickplayContext>;
}

export class FrozenApple extends ExtendedApple {
  private gameContext: SetFunction<QuickplayContext>;

  constructor({ apple, gameContext }: Args) {
    super({ index: apple.getIndex(), value: apple.getBaseValue() });

    this.gameContext = gameContext;
  }

  onSelection(
    board: Entity[],
    finalScoreProcessQueue: ((score: number) => number)[]
  ) {
    this.gameContext((p) => ({
      ...p,
      timerPaused: true,
      endTime: p.endTime + 5000,
    }));
    setTimeout(() => {
      this.gameContext((p) => ({ ...p, timerPaused: false }));
    }, 4000);

    this.hideApple();
    return 1;
  }

  getColor() {
    return "text-blue-500 dark:text-blue-600";
  }
}
