import { io, Socket } from 'socket.io-client';
import {
    CreateRoomDTO,
    JoinRoomDTO,
    LeaveRoomDTO,
    RoomPlayerResponseDTO,
} from '../types/dtos';
import { Room } from '../types/models';
import constants from '../data/constants.json';

let _instance: SocketConnection;

export default function getSocketConnection() {
    if (!_instance) {
        _instance = new SocketConnection(constants.WEBSOCKET_URL);
    }
    return _instance;
}

class SocketConnection {
    private socket: Socket;

    constructor(url: string) {
        this.socket = io(url);

        this.socket.on('connectionTest', () => {
            this.socket.emit('connectionReceived');
        });

        this.socket.on('error', (_) => {
            window.location.reload();
        });
    }

    public getSocketObject(): Socket {
        return this.socket;
    }

    public requestRoomInfo(
        data: { roomId: string },
        callback: (data: Room) => void,
    ): void {
        this.socket.emit('room:get', data, callback);
    }

    public requestRoomList(callback: (data: Room[]) => void): void {
        this.socket.emit('room:getAll', callback);
    }

    public createRoom(
        data: CreateRoomDTO,
        callback?: (data: Room) => void,
    ): void {
        this.socket.emit('room:create', data, callback);
    }

    public joinRoom(data: JoinRoomDTO, callback?: (data: Room) => void): void {
        this.socket.emit('room:join', data, callback);
    }

    public leaveRoom(data: LeaveRoomDTO, callback?: () => void): void {
        this.socket.emit('room:leave', data, callback);
    }

    public toggleIsReady(data: RoomPlayerResponseDTO): void {
        this.socket.emit('room:isready', data);
    }

    public playCard(data: any): void {
        this.socket.emit('game:playcard', data);
    }

    public askTruco(data: any): void {
        this.socket.emit('game:truco:ask', data);
    }

    public acceptTruco(data: any): void {
        this.socket.emit('game:truco:accept', data);
    }

    public rejectTruco(data: any): void {
        this.socket.emit('game:truco:reject', data);
    }
}
