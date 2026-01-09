import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { type Card } from '../entities/card.entity';
import { IsBoolean, IsUUID, ValidateNested } from 'class-validator';

export class CardPlayedDtoOut {
    @IsUUID()
    playerId: string;

    @ValidateNested()
    currentPlayer: PlayerDtoOut;

    @IsBoolean()
    isDark: boolean;

    @ValidateNested()
    card: Card | null;
}
