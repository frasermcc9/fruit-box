export * from './weighted-random';

export interface RandomGenerator {
  next(): number;
}
