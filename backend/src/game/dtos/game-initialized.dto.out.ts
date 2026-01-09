import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';
import { IsUUID, ValidateNested } from 'class-validator';

export class GameInitializedDtoOut {
    @IsUUID()
    gameId: string;

    @IsUUID()
    myPlayerId: string;

    @ValidateNested()
    myHand: Card[];

    @ValidateNested()
    currentPlayer: PlayerDtoOut;
}
