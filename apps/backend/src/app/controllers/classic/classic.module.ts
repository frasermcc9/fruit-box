import { Module } from '@nestjs/common';
import { ClassicService } from './classic.service';
import { ClassicGateway } from './classic.gateway';
import { GeneratorModule } from '../../services/generator/generator.module';

@Module({
  providers: [ClassicGateway, ClassicService],
  imports: [GeneratorModule],
})
export class ClassicModule {}
