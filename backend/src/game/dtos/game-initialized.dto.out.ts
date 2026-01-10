import { PlayerDto } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';

export class GameInitializedDtoOut {
    gameId: string;
    myPlayerId: string;
    myHand: Card[];
    currentPlayer: PlayerDto;
}
