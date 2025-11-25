import { PlayerDtoOut } from './dtos/player.dto.out';

export class Player {
    id: string;
    name: string;
    socketId: string;

    constructor(name: string, socketId: string) {
        this.id = crypto.randomUUID();
        this.name = name;
        this.socketId = socketId;
    }

    toDto(): PlayerDtoOut {
        return {
            id: this.id,
            name: this.name,
        };
    }
}
