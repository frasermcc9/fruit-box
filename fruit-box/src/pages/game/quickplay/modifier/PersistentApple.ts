import { Entity, ExtendedApple } from ".";

interface Args {
  apple: Entity;
}

export class PersistentApple extends ExtendedApple {
  private timesToHit: number;

  constructor({ apple }: Args) {
    super({ index: apple.getIndex(), value: apple.getBaseValue() });
    this.timesToHit = 2;
  }

  onSelection(
    board: Entity[],
    finalScoreProcessQueue: ((score: number) => number)[]
  ) {
    this.timesToHit--;
    if (this.timesToHit === 0) {
      this.hideApple();
    }
    return 1;
  }

  getColor() {
    return this.timesToHit > 1
      ? "text-red-700 dark:text-red-900"
      : "text-red-500 dark:text-red-700";
  }
}
