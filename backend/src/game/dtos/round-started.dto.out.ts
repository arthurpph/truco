import { PlayerDto } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';

export class RoundStartedDtoOut {
    currentPlayer: PlayerDto;
    myHand: Card[];
    team1Score: number;
    team2Score: number;
}
