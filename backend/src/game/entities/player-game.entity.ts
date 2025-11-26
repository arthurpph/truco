import { Player } from 'src/player/entities/player.entity';
import { Card } from './card.entity';

export class PlayerGame extends Player {
    hand: Card[] = [];
}
