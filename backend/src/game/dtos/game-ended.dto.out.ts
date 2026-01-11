import { PlayerDto } from 'src/player/dtos/player.dto.out';

export class GameEndedDtoOut {
    gameId: string;
    winnerTeam: {
        id: string;
        players: PlayerDto[];
    };
    team1Score: number;
    team2Score: number;
}
