import { IsBoolean, IsUUID, ValidateNested } from 'class-validator';
import { type Card } from '../entities/card.entity';

export class PlayCardDto {
    @IsUUID()
    gameId: string;

    @ValidateNested()
    card: Card;

    @IsBoolean()
    isDark: boolean;
}
