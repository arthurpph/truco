import { Injectable } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { Player } from 'src/player/entities/player.entity';

@Injectable()
export class RoomService {
    private rooms = new Map<string, Room>(); // id -> room object

    getAll(): Room[] {
        return Array.from(this.rooms.values());
    }

    getById(roomId: string): Room | null {
        return this.rooms.get(roomId) || null;
    }

    create(name: string, player: Player): Room {
        const newRoom = new Room(name);
        newRoom.teams[0][0] = player;
        this.rooms.set(newRoom.id, newRoom);
        return newRoom;
    }

    addPlayer(roomId: string, player: Player): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        if (!this.addPlayerToRoom(room, player)) return null;
        return room;
    }

    removeDisconnectedPlayer(player: Player): void {
        for (const room of this.rooms.values()) {
            if (this.removePlayerFromRoom(room, player)) {
                return;
            }
        }
    }

    removePlayer(roomId: string, player: Player): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        if (!this.removePlayerFromRoom(room, player)) return null;
        return room;
    }

    toggleIsReady(roomId: string, playerId: string): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        if (room.playersReady.has(playerId)) {
            room.playersReady.delete(playerId);
        } else {
            room.playersReady.add(playerId);
        }

        return room;
    }

    private addPlayerToRoom(room: Room, player: Player): boolean {
        for (let i = 0; i < room.teams.length; i++) {
            for (let j = 0; j < room.teams[i].length; j++) {
                if (room.teams[i][j]) continue;

                room.teams[i][j] = player;
                return true;
            }
        }
        return false;
    }

    private removePlayerFromRoom(room: Room, player: Player): boolean {
        for (let i = 0; i < room.teams.length; i++) {
            for (let j = 0; j < room.teams[i].length; j++) {
                if (room.teams[i][j]?.id !== player.id) continue;

                room.teams[i][j] = null;
                room.playersReady.delete(player.id);
                return true;
            }
        }
        return false;
    }
}
