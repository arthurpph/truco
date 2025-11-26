export interface CreateRoomDTO {
    roomName: string;
    playerName: string;
}

export type TeamDTO = [RoomPlayerRequestDTO, RoomPlayerRequestDTO];

export interface RoomDTO {
    id: string;
    name: string;
    teams: [TeamDTO, TeamDTO];
    playersReady: string[];
}

export interface RoomPlayerResponseDTO {
    roomId: string;
    playerName: string;
}

export type RoomPlayerRequestDTO = {
    id: string;
    name: string;
};

export interface JoinRoomDTO {
    roomId: string;
    playerName: string;
}

export interface LeaveRoomDTO {
    roomId: string;
    playerName: string;
}
