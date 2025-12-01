import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';

export class RoundStartedDtoOut {
    currentPlayer: PlayerDtoOut;
    myHand: Card[];
}
