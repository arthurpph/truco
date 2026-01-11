import { PlayerDto } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';

export class GameInitializedDtoOut {
    gameId: string;
    myPlayerId: string;
    myHand: Card[];
    currentPlayer: PlayerDto;
    team1: { id: string; players: PlayerDto[] };
    team2: { id: string; players: PlayerDto[] };
    team1Score: number;
    team2Score: number;
    maxScore: number;
}
