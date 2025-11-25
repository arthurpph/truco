import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomService } from './room.service';
import { GetRoomDto } from './dtos/get-room.dto.in';
import { Room } from './room.entity';
import { CreateRoomDto } from './dtos/create-room.dto.in';
import { JoinRoomDto } from './dtos/join-room.dto.in';
import { PlayerService } from 'src/player/player.service';
import { LeaveRoomDto } from './dtos/leave-room.dto.in';
import { ToggleIsReadyDto } from './dtos/toogle-is-ready.dto.in';
import { RoomDtoOut } from './dtos/room.dto.out';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class RoomGateway {
    private clients = new Map<string, Socket>();

    constructor(
        private readonly roomService: RoomService,
        private readonly playerService: PlayerService,
    ) {}

    handleConnection(client: Socket) {
        this.clients.set(client.id, client);
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
        const player = this.playerService.deleteBySocketId(client.id);
        if (!player) return;
        this.roomService.removeDisconnectedPlayer(player);
    }

    @SubscribeMessage('room:getAll')
    getAllRooms(): Room[] {
        return this.roomService.getAll();
    }

    @SubscribeMessage('room:get')
    getRoom(@MessageBody() dto: GetRoomDto): RoomDtoOut | null {
        const { roomId } = dto;
        const room = this.roomService.getById(roomId);
        return room;
    }

    @SubscribeMessage('room:create')
    createRoom(
        @MessageBody() dto: CreateRoomDto,
        @ConnectedSocket() client: Socket,
    ): RoomDtoOut | null {
        const { roomName, playerName } = dto;
        const player = this.playerService.create(playerName, client.id);
        if (!player) return null;
        return this.roomService.create(roomName, player).toDto();
    }

    @SubscribeMessage('room:join')
    joinRoom(
        @MessageBody() dto: JoinRoomDto,
        @ConnectedSocket() client: Socket,
    ): RoomDtoOut | null | undefined {
        const { roomId, playerName } = dto;
        const player =
            this.playerService.getByName(playerName) ||
            this.playerService.create(playerName, client.id);
        if (!player) return null;
        return this.roomService.addPlayer(roomId, player)?.toDto();
    }

    @SubscribeMessage('room:leave')
    leaveRoom(@MessageBody() dto: LeaveRoomDto): RoomDtoOut | null | undefined {
        const { roomId, playerName } = dto;
        const player = this.playerService.getByName(playerName);
        if (!player) return null;
        return this.roomService.removePlayer(roomId, player)?.toDto();
    }

    @SubscribeMessage('room:isready')
    toggleIsReady(
        @MessageBody() dto: ToggleIsReadyDto,
    ): RoomDtoOut | null | undefined {
        const { roomId, playerName } = dto;
        const player = this.playerService.getByName(playerName);
        if (player == null) return null;
        return this.roomService.toggleIsReady(roomId, player.id)?.toDto();
    }
}
