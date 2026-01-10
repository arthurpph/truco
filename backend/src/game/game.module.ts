import { forwardRef, Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { RoomModule } from 'src/room/room.module';
import { AppModule } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    providers: [GameGateway, GameService],
    imports: [
        AuthModule,
        forwardRef(() => RoomModule),
        forwardRef(() => AppModule),
    ],
    exports: [GameService],
})
export class GameModule {}
