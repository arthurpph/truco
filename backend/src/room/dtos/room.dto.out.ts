import { PlayerDto } from 'src/player/dtos/player.dto.out';

export class RoomDtoOut {
    id: string;
    name: string;
    teams: [
        [PlayerDto | null, PlayerDto | null],
        [PlayerDto | null, PlayerDto | null],
    ];
    playersReady: string[];
}
