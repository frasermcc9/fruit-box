import { AppleGenerator } from './apple-generator';

describe('Apple Generator Tests', () => {
  const sum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);

  it('should correctly adjust last value to make the sum divisible by ten', () => {
    let base = [1, 5, 1];
    let result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(0);

    base = [1, 5, 2];
    result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(0);

    base = [1, 5, 3];
    result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(0);

    base = [1, 5, 4];
    result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(10);

    base = [1, 5, 5];
    result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(10);

    base = [1, 5, 6];
    result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(10);

    base = [1, 5, 7];
    result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(10);

    base = [1, 5, 8];
    result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(10);

    base = [1, 5, 9];
    result = AppleGenerator.ensureMod10IsZero(base);
    expect(sum(result)).toEqual(10);
  });

  it('should generate a value where mod10 = 0', () => {
    const numbers = AppleGenerator.generateClassic({
      generator: {
        next: () => 1,
      },
      size: 170,
    });

    expect(sum(numbers) % 10).toBe(0);
  });
});
