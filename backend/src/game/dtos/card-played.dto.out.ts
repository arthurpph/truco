import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';

export class CardPlayedDtoOut {
    playerId: string;
    currentPlayer: PlayerDtoOut;
    isDark: boolean;
    card: Card | null;
}
