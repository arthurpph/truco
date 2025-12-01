import { forwardRef, Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { PlayerModule } from 'src/player/player.module';
import { GameModule } from 'src/game/game.module';
import { AppModule } from 'src/app.module';

@Module({
    providers: [RoomGateway, RoomService],
    exports: [RoomService],
    imports: [
        forwardRef(() => GameModule),
        forwardRef(() => AppModule),
        PlayerModule,
    ],
})
export class RoomModule {}
