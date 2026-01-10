import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomService } from './room/room.service';
import { PlayerService } from './player/player.service';
import { AuthService } from './auth/auth.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients = new Map<string, Socket>();

    constructor(
        private readonly authService: AuthService,
        private readonly roomService: RoomService,
        private readonly playerService: PlayerService,
    ) {}

    handleConnection(client: Socket) {
        const token = client.handshake.auth?.token;
        try {
            const username = this.authService.verifyToken(token);
            client.data.username = username;
        } catch {
            client.disconnect(true);
            return;
        }

        this.clients.set(client.id, client);
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
        const player = this.playerService.deleteBySocketId(client.id);
        if (!player) return;
        this.roomService.removePlayerFromAnyRoom(player);
    }

    get(socketId: string): Socket | undefined {
        return this.clients.get(socketId);
    }
}
