import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PlayCardDto } from './dtos/play-card.dto.in';
import { GameService } from './game.service';
import { TrucoAskDto } from './dtos/truco-ask.dto.in';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class GameGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService: GameService) {}

    @SubscribeMessage('game:playcard')
    playCard(@MessageBody() dto: PlayCardDto): void {
        const { gameId, socketId, card, isDark } = dto;
        this.gameService.playCard(gameId, socketId, card, isDark);
    }

    @SubscribeMessage('game:truco:ask')
    askTruco(@MessageBody() dto: TrucoAskDto): void {
        const { gameId, socketId } = dto;
        this.gameService.askTruco(gameId, socketId);
    }

    @SubscribeMessage('game:truco:accept')
    acceptTruco(@MessageBody() dto: TrucoAskDto): void {
        const { gameId, socketId } = dto;
        this.gameService.acceptTruco(gameId, socketId);
    }

    @SubscribeMessage('game:truco:reject')
    rejectTruco(@MessageBody() dto: TrucoAskDto): void {
        const { gameId, socketId } = dto;
        this.gameService.rejectTruco(gameId, socketId);
    }
}
