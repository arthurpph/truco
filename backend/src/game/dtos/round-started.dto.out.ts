import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';
import { ValidateNested } from 'class-validator';

export class RoundStartedDtoOut {
    @ValidateNested()
    currentPlayer: PlayerDtoOut;

    @ValidateNested()
    myHand: Card[];
}
