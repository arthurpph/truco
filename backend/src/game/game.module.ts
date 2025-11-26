import { forwardRef, Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { RoomModule } from 'src/room/room.module';

@Module({
    providers: [GameGateway, GameService],
    imports: [forwardRef(() => RoomModule)],
    exports: [GameService],
})
export class GameModule {}
