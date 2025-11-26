import { Player } from 'src/player/entities/player.entity';

export class RemovePlayerDto {
    roomId: string;
    player: Player;
}
