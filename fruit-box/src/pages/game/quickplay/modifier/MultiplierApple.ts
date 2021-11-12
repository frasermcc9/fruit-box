import { Entity, ExtendedApple } from ".";

interface Args {
  apple: Entity;
  multiplier: number;
}

export class MultiplierApple extends ExtendedApple {
  private readonly multiplier: number;

  constructor({ apple, multiplier }: Args) {
    super({ index: apple.getIndex(), value: apple.getBaseValue() });

    this.multiplier = multiplier;
  }

  onSelection(
    board: Entity[],
    finalScoreProcessQueue: ((score: number) => number)[]
  ) {
    finalScoreProcessQueue.push((score) => score * this.multiplier - score);

    this.hideApple();
    return 1;
  }

  getColor() {
    return "text-yellow-500 dark:text-yellow-600";
  }
}
