import { Player } from 'src/player/player.entity';

export class RemovePlayerDto {
    roomId: string;
    player: Player;
}
