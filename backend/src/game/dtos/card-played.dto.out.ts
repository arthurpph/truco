import { PlayerDto } from 'src/player/dtos/player.dto.out';
import { Card } from '../entities/card.entity';

export class CardPlayedDtoOut {
    playerId: string;
    currentPlayer: PlayerDto;
    isDark: boolean;
    card: Card | null;
}
