export type AuthResponseDTO = {
    token: string;
    username: string;
};

export type CreateRoomDTO = {
    roomName: string;
    playerName: string;
};

export type TeamDTO = [RoomPlayerRequestDTO, RoomPlayerRequestDTO];

export type RoomDTO = {
    id: string;
    name: string;
    teams: [TeamDTO, TeamDTO];
    playersReady: string[];
};

export type RoomPlayerResponseDTO = {
    roomId: string;
    playerName: string;
};

export type RoomPlayerRequestDTO = {
    id: string;
    name: string;
};

export type JoinRoomDTO = {
    roomId: string;
    playerName: string;
};

export type LeaveRoomDTO = {
    roomId: string;
    playerName: string;
};

export type PlayerDTO = {
    id: string;
    name: string;
};

export type CardDTO = {
    card: string;
    suit: 'copas' | 'espadas' | 'ouros' | 'paus' | 'manilha';
    value: number;
};
