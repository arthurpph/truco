import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';
import { PlayerModule } from 'src/player/player.module';

@Module({
    providers: [RoomGateway, RoomService],
    imports: [PlayerModule],
})
export class RoomModule {}
