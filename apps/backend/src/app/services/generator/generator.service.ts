import { Injectable } from '@nestjs/common';
import { AppleGenerator } from '@apple-game/generation';
import { WeightedRandom } from '@apple-game/random';

@Injectable()
export class GeneratorService {
  generateApples(size: number) {
    return AppleGenerator.generateClassic({
      generator: new WeightedRandom([0, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
      size,
    });
  }
}
