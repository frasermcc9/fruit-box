import { Injectable } from '@nestjs/common';
import { GeneratorService } from '../../services/generator/generator.service';

@Injectable()
export class ClassicService {
  constructor(private readonly generatorService: GeneratorService) {}

  create(size: number) {
    const values = this.generatorService.generateApples(size);

    return values;
  }
}
