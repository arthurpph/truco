import { Player } from 'src/player/entities/player.entity';
import { RoomDtoOut } from '../dtos/room.dto.out';
import { Team, Teams } from 'src/shared/entities/team.entity';
import { PlayerDto } from 'src/player/dtos/player.dto.out';

export class Room {
    id: string;
    name: string;
    players: Set<Player>;
    teams: Teams<Player>;
    playersReady: Set<string> = new Set();

    constructor(name: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.teams = [new Team(), new Team()];
        this.players = new Set();
    }

    addPlayer(player: Player): boolean {
        if (this.players.has(player)) return false;

        for (const team of this.teams) {
            if (team?.isFull()) continue;
            team?.addPlayer(player);
            this.players.add(player);
            return true;
        }

        return false;
    }

    removePlayer(player: Player): boolean {
        if (!this.players.has(player)) return false;

        for (const team of this.teams) {
            if (!team.players.includes(player)) continue;
            team?.removePlayer(player);
            this.players.delete(player);
            return true;
        }
        return false;
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

    isEmpty(): boolean {
        return this.players.size === 0;
    }

    delete(): void {
        for (const team of this.teams) {
            if (!team) continue;
            for (const player of team.players) {
                if (!player) continue;
                team.removePlayer(player);
                if (!this.players.has(player)) continue;
                this.players.delete(player);
            }
        }
        this.playersReady = new Set();
    }

    toDto(): RoomDtoOut {
        const [team1, team2] = this.teams;

        const formatTeam = (team: Team<Player>) => {
            const p = team.players;
            return [p[0] ? p[0].toDto() : null, p[1] ? p[1].toDto() : null] as [
                PlayerDto | null,
                PlayerDto | null,
            ];
        };

        return {
            id: this.id,
            name: this.name,
            teams: [formatTeam(team1), formatTeam(team2)],
            playersReady: Array.from(this.playersReady),
        };
    }
}
