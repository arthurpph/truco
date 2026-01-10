import { PlayerDto } from 'src/player/dtos/player.dto.out';
import { RoundCardPlayed } from '../types/game.type';

export class RoundEndedDtoOut {
    draw: boolean;
    teamWinner: {
        id: string;
        players: PlayerDto[];
    } | null;
    cardsPlayed: RoundCardPlayed[];
}
