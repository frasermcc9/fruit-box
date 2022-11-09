import { PartialType } from '@nestjs/mapped-types';
import { CreateClassicDto } from './create-classic.dto';

export class UpdateClassicDto extends PartialType(CreateClassicDto) {
  id: number;
}
