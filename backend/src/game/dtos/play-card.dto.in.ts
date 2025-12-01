import { Card } from '../entities/card.entity';

export class PlayCardDto {
    gameId: string;
    socketId: string;
    card: Card;
    isDark: boolean;
}
