import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PlayCardDto } from './dtos/play-card.dto.in';
import { GameService } from './game.service';
import { TrucoAskDto } from './dtos/truco-ask.dto.in';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService: GameService) {}

    @SubscribeMessage('game:playcard')
    playCard(
        @MessageBody() dto: PlayCardDto,
        @ConnectedSocket() client: Socket,
    ): void {
        const { gameId, card, isDark } = dto;
        this.gameService.playCard(gameId, client.id, card, isDark);
    }

    @SubscribeMessage('game:truco:ask')
    askTruco(
        @MessageBody() dto: TrucoAskDto,
        @ConnectedSocket() client: Socket,
    ): void {
        const { gameId } = dto;
        this.gameService.askTruco(gameId, client.id);
    }

    @SubscribeMessage('game:truco:accept')
    acceptTruco(
        @MessageBody() dto: TrucoAskDto,
        @ConnectedSocket() client: Socket,
    ): void {
        const { gameId } = dto;
        this.gameService.acceptTruco(gameId, client.id);
    }

    @SubscribeMessage('game:truco:reject')
    rejectTruco(
        @MessageBody() dto: TrucoAskDto,
        @ConnectedSocket() client: Socket,
    ): void {
        const { gameId } = dto;
        this.gameService.rejectTruco(gameId, client.id);
    }
}
