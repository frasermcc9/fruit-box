export class WeightedRandom {
  private readonly weights: number[];
  private readonly sum: number;

  private readonly values: number[];

  constructor(weights: number[]) {
    this.weights = weights;
    this.sum = weights.reduce((acc, w) => acc + w, 0);
    this.values = [];

    if (weights.some((w) => ~~w !== w)) {
      throw new Error('Weights must be integers');
    }

    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.weights[i]; j++) {
        this.values.push(i);
      }
    }
  }

  next(): number {
    const randomValue = Math.random() * this.sum;

    return this.values[~~randomValue];
  }
}
