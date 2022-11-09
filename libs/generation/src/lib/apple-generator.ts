import { RandomGenerator } from '@apple-game/random';

export class AppleGenerator {
  static generateClassic({
    generator,
    size = 170,
  }: {
    generator: RandomGenerator;
    size?: number;
  }) {
    const base = Array.from({ length: size }, () => generator.next());

    return this.ensureMod10IsZero(base);
  }

  static ensureMod10IsZero(array: number[]) {
    const sum = array.reduce((acc, curr) => acc + curr, 0);

    if (sum % 10 === 0) {
      return array;
    }

    const last = array[array.length - 1];
    const diff = 10 - (sum % 10);

    array[array.length - 1] = last + diff;

    if (array[array.length - 1] > 10) {
      array[array.length - 1] -= 10;
      return array;
    }

    if (array[array.length - 1] !== 10) {
      return array;
    }

    if (array[array.length - 2] === 9) {
      array[array.length - 2] = 8;
      array[array.length - 1] = 1;
      return array;
    }

    array[array.length - 2] += 1;
    array[array.length - 1] = 9;
    return array;
  }
}
