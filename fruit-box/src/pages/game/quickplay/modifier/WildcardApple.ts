import { Entity, ExtendedApple } from ".";

interface Args {
  apple: Entity;
}

export class WildcardApple extends ExtendedApple {
  constructor({ apple }: Args) {
    super({ index: apple.getIndex(), value: 0 });
  }

  onSelection(
    board: Entity[],
    finalScoreProcessQueue: ((score: number) => number)[]
  ) {
    this.hideApple();
    return 1;
  }

  preTargetHook(value: number) {
    return value - this.value <= 10;
  }

  getColor() {
    return "text-pink-500 dark:text-pink-700";
  }

  getTextOverride() {
    return "??";
  }
}
