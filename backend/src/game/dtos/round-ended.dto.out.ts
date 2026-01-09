import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';
import { RoundCardPlayed } from '../types/game.type';
import { IsBoolean, ValidateNested } from 'class-validator';

export class RoundEndedDtoOut {
    @IsBoolean()
    draw: boolean;

    @ValidateNested()
    teamWinner: {
        id: string;
        players: PlayerDtoOut[];
    } | null;

    @ValidateNested({ each: true })
    cardsPlayed: RoundCardPlayed[];
}
