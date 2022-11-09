import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassicModule } from './controllers/classic/classic.module';
import { GeneratorModule } from './services/generator/generator.module';

@Module({
  imports: [ClassicModule, GeneratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
