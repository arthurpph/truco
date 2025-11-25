import { Player } from 'src/player/player.entity';

export class AddPlayerDto {
    roomId: string;
    player: Player;
}
