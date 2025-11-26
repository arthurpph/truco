import { Player } from 'src/player/entities/player.entity';
import { RoomDtoOut } from '../dtos/room.dto.out';
import { Team } from 'src/shared/entities/team.entity';

export class Room {
    id: string;
    name: string;
    teams: Team<Player | null>;
    playersReady: Set<string> = new Set();

    constructor(name: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.teams = [
            [null, null],
            [null, null],
        ];
    }

    toDto(): RoomDtoOut {
        const [team1, team2] = this.teams;

        return {
            id: this.id,
            name: this.name,
            teams: [
                [
                    team1[0] ? team1[0].toDto() : null,
                    team1[1] ? team1[1].toDto() : null,
                ],
                [
                    team2[0] ? team2[0].toDto() : null,
                    team2[1] ? team2[1].toDto() : null,
                ],
            ],
            playersReady: Array.from(this.playersReady),
        };
    }
}
