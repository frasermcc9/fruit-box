export interface Entity {
  onSelection(
    board: Entity[],
    finalScoreProcessQueue: ((score: number) => number)[]
  ): number;
  getColor(): string;
  isSimpleApple(): boolean;
  hideApple(): void;

  preTargetHook(selectedValue: number): boolean;
  getTextOverride(): string | undefined;

  getBaseValue(): number;
  getIndex(): number;
  isVisible(): boolean;
}

interface Args {
  index: number;
  value: number;
}

export class SimpleApple implements Entity {
  protected readonly index;
  protected value;
  protected visible;

  constructor({ index, value }: Args) {
    this.index = index;
    this.value = value;
    this.visible = true;
  }

  isVisible(): boolean {
    return this.visible;
  }

  preTargetHook(selectedValue: number): boolean {
    return false;
  }

  hideApple(): void {
    this.visible = false;
  }

  getIndex(): number {
    return this.index;
  }

  getColor(): string {
    return "text-red-500 dark:text-red-700";
  }

  onSelection(
    board: Entity[],
    finalScoreProcessQueue: ((score: number) => number)[]
  ) {
    this.hideApple();
    return 1;
  }

  getBaseValue() {
    return this.value;
  }

  isSimpleApple() {
    return true;
  }

  getTextOverride(): string | undefined {
    return undefined;
  }
}

export class ExtendedApple extends SimpleApple {
  constructor({ index, value }: Args) {
    super({ index, value });
  }

  isSimpleApple() {
    return false;
  }
}
