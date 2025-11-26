import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RoomService } from './room.service';
import { GetRoomDto } from './dtos/get-room.dto.in';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dtos/create-room.dto.in';
import { JoinRoomDto } from './dtos/join-room.dto.in';
import { PlayerService } from 'src/player/player.service';
import { LeaveRoomDto } from './dtos/leave-room.dto.in';
import { ToggleIsReadyDto } from './dtos/toogle-is-ready.dto.in';
import { RoomDtoOut } from './dtos/room.dto.out';
import { OnGatewayConnection } from '@nestjs/websockets';
import { OnGatewayDisconnect } from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
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
        const room = this.roomService.removePlayerFromAnyRoom(player);
        if(!room) return;
        this.emitToRoom(room, 'room:update', room.toDto());
    }

    @SubscribeMessage('room:getAll')
    getAllRooms(): Room[] {
        return this.roomService.getAll();
    }

    @SubscribeMessage('room:get')
    getRoom(@MessageBody() dto: GetRoomDto): RoomDtoOut | null {
        const { roomId } = dto;
        return this.roomService.getById(roomId)?.toDto() || null;
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
    ): RoomDtoOut | null {
        const { roomId, playerName } = dto;
        const player =
            this.playerService.getByName(playerName) ||
            this.playerService.create(playerName, client.id);
        if (!player) return null;
        const room = this.roomService.addPlayer(roomId, player);
        if(!room) return null;
        this.emitToRoom(room, 'room:update', room.toDto())
        return room.toDto();
    }

    @SubscribeMessage('room:leave')
    leaveRoom(@MessageBody() dto: LeaveRoomDto): RoomDtoOut | null {
        const { roomId, playerName } = dto;
        const player = this.playerService.getByName(playerName);
        if (!player) return null;
        const room = this.roomService.removePlayer(roomId, player);
        if(!room) return null; 
        this.emitToRoom(room, 'room:update', room.toDto());
        return room.toDto();
    }

    @SubscribeMessage('room:isready')
    toggleIsReady(@MessageBody() dto: ToggleIsReadyDto): void {
        const { roomId, playerName } = dto;
        const player = this.playerService.getByName(playerName);
        if (!player) return;
        const room = this.roomService.toggleIsReady(roomId, player.id);
        if (!room) return;
        this.emitToRoom(room, 'room:update', room.toDto());
    }

    private emitToRoom(room: Room, event: string, data: any) {
        for (const team of room.teams) {
            for (const player of team) {
                if (!player) continue;
                const client = this.clients.get(player.socketId);
                if (!client) continue;
                client.emit(event, data);
            }
        }
    }
}
