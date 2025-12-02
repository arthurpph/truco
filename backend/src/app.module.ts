import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { AppGateway } from './app.gateway';
import { RoomModule } from './room/room.module';
import { PlayerModule } from './player/player.module';

@Module({
    controllers: [AppController],
    providers: [AppService, AppGateway],
    imports: [
        forwardRef(() => GameModule),
        forwardRef(() => RoomModule),
        PlayerModule,
    ],
    exports: [AppGateway],
})
export class AppModule {}
