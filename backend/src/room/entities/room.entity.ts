import { Player } from 'src/player/entities/player.entity';
import { RoomDtoOut } from '../dtos/room.dto.out';
import { Teams } from 'src/shared/entities/team.entity';

export class Room {
    id: string;
    name: string;
    players: Set<Player>;
    teams: Teams<Player | null>;
    playersReady: Set<string> = new Set();

    constructor(name: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.teams = [
            [null, null],
            [null, null],
        ];
        this.players = new Set();
    }

    addPlayer(player: Player): boolean {
        if (this.players.has(player)) return false;

        return this.goThroughAllPlayersTeam((i, j) => {
            if (this.teams[i][j]) return false;
            this.teams[i][j] = player;
            this.players.add(player);
            return true;
        });
    }

    removePlayer(player: Player): boolean {
        if (!this.players.has(player)) return false;

        return this.goThroughAllPlayersTeam((i, j) => {
            if (!this.teams[i][j]) return false;
            this.teams[i][j] = null;
            this.players.delete(player);
            return true;
        });
    }

    toggleIsReady(player: Player): boolean {
        const { id } = player;
        if (!this.players.has(player)) return false;
        if (this.playersReady.has(id)) {
            this.playersReady.delete(id);
        } else {
            this.playersReady.add(id);
        }
        return true;
    }

    containsPlayer(player: Player): boolean {
        return this.players.has(player);
    }

    delete(): void {
        this.goThroughAllPlayersTeam((i, j) => {
            const player = this.teams[i][j];
            if (!player) return true;
            this.teams[i][j] = null;
            if (!this.players.has(player)) return true;
            this.players.delete(player);
            return true;
        });
        this.playersReady = new Set();
    }

    private goThroughAllPlayersTeam(
        callback: (i: number, j: number) => boolean,
    ): boolean {
        for (let i = 0; i < this.teams.length; i++) {
            for (let j = 0; j < this.teams[0].length; j++) {
                if (!callback(i, j)) return false;
            }
        }

        return true;
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
