import { Player } from 'src/player/entities/player.entity';

export class AddPlayerDto {
    roomId: string;
    player: Player;
}
