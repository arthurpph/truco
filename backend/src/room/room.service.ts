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
}
