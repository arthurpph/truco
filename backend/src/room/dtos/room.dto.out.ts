import { PlayerDtoOut } from 'src/player/dtos/player.dto.out';

export class RoomDtoOut {
    id: string;
    name: string;
    teams: [
        [PlayerDtoOut | null, PlayerDtoOut | null],
        [PlayerDtoOut | null, PlayerDtoOut | null],
    ];
}
