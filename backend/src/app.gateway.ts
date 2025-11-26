import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AppService } from './app.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients = new Map<string, Socket>();

    constructor(private readonly appService: AppService) {}

    handleConnection(client: Socket) {
        this.clients.set(client.id, client);
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
    }

    get(socketId: string): Socket | undefined {
        return this.clients.get(socketId);
    }
}
