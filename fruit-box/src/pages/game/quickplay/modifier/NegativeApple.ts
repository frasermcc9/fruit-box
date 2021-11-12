import { Entity, ExtendedApple } from ".";
import { generateValue } from "../../../../common/GenerateValue";

interface Args {
  apple: Entity;
  target: number;
}

export class NegativeApple extends ExtendedApple {
  constructor({ apple, target }: Args) {
    super({
      index: apple.getIndex(),
      value: generateValue(-1 * (target - 1), -1),
    });
  }

  onSelection(
    board: Entity[],
    finalScoreProcessQueue: ((score: number) => number)[]
  ) {
    this.hideApple();
    return 1;
  }

  getColor() {
    return "text-green-500 dark:text-green-700";
  }
}
