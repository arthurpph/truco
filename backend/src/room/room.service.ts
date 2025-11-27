import { Injectable } from '@nestjs/common';
import { Room } from './entities/room.entity';
import { Player } from 'src/player/entities/player.entity';
import { AppGateway } from 'src/app.gateway';

type EventOut = 'room:deleted';

@Injectable()
export class RoomService {
    private rooms = new Map<string, Room>(); // id -> room object

    constructor(private readonly appGateway: AppGateway) {}

    getAll(): Room[] {
        return Array.from(this.rooms.values());
    }

    getById(roomId: string): Room | null {
        return this.rooms.get(roomId) || null;
    }

    create(name: string, player: Player): Room {
        const newRoom = new Room(name);
        newRoom.addPlayer(player);
        this.rooms.set(newRoom.id, newRoom);
        return newRoom;
    }

    delete(roomId: string): void {
        const room = this.rooms.get(roomId);
        if (!room) return;
        room.delete();
        this.rooms.delete(roomId);
    }

    addPlayer(roomId: string, player: Player): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        if (!room.addPlayer(player)) return null;
        return room;
    }

    removePlayerFromAnyRoom(player: Player): Room | null {
        for (const room of this.rooms.values()) {
            if (room.containsPlayer(player)) {
                room.removePlayer(player);
                return room;
            }
        }
        return null;
    }

    removePlayer(roomId: string, player: Player): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        if (!room.containsPlayer(player)) return null;
        room.removePlayer(player);
        return room;
    }

    toggleIsReady(roomId: string, player: Player): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;
        if (!room.toggleIsReady(player)) return null;
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

    private broadcastStateUpdate(room: Room, event: EventOut, data: any) {
        for (const player of room.players) {
            const socket = this.appGateway.get(player.id);
            if (!socket) continue;
            socket.emit(event, data);
        }
    }
}
