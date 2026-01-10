import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { RoundCardPlayed } from '../types/game.type';

export class RoundEndedDtoOut {
    draw: boolean;
    teamWinner: {
        id: string;
        players: PlayerDtoOut[];
    } | null;
    cardsPlayed: RoundCardPlayed[];
}
