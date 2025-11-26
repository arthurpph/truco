import { Card } from '../entities/card.entity';

export class PlayCardDto {
    gameId: string;
    playerId: string;
    card: Card;
    isDark: boolean;
}
