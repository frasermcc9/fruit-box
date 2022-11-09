import { ClassicTypes, Messages } from '@apple-game/messages';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ClassicService } from './classic.service';

@WebSocketGateway(80)
export class ClassicGateway {
  constructor(private readonly classicService: ClassicService) {}

  @SubscribeMessage(Messages.Classic.CREATE)
  create(): ClassicTypes[typeof Messages.Classic.CREATE] {
    const apples = this.classicService.create(170);

    return { apples };
  }
}
