import { Injectable } from '@nestjs/common';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
    private players = new Map<string, Player>(); // id -> player object

    create(name: string, socketId: string): Player | null {
        for (const player of this.players.values()) {
            if (player.name === name) {
                return null;
            }
        }
        const newPlayer = new Player(name, socketId);
        this.players.set(newPlayer.id, newPlayer);
        return newPlayer;
    }

    getByName(name: string): Player | null {
        for (const player of this.players.values()) {
            if (player.name === name) {
                return player;
            }
        }
        return null;
    }

    deleteBySocketId(socketId: string): Player | null {
        for (const [id, player] of this.players.entries()) {
            if (player.socketId === socketId) {
                this.players.delete(id);
                return player;
            }
        }
        return null;
    }
}
