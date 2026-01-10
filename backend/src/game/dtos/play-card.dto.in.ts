import { IsBoolean, IsUUID, ValidateNested } from 'class-validator';
import { Card } from '../entities/card.entity';
import { Type } from 'class-transformer';

export class PlayCardDto {
    @IsUUID()
    gameId: string;

    @ValidateNested()
    @Type(() => Card)
    card: Card;

    @IsBoolean()
    isDark: boolean;
}
