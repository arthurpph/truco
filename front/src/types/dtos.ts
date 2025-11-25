export interface CreateRoomDTO {
  roomName: string;
  playerName: string;
}

export interface TeamDTO {
  players: [RoomPlayerRequestDTO, RoomPlayerRequestDTO];
}

export interface RoomDTO {
  id: string;
  name: string;
  teams: [TeamDTO, TeamDTO];
}

export interface RoomPlayerResponseDTO {
  name: string;
}

export interface RoomPlayerRequestDTO {
  id: string;
  name: string;
  isReady: boolean;
}

export interface JoinRoomDTO {
  roomId: string;
  playerName: string;
}

export interface LeaveRoomDTO {
  roomId: string;
  playerName: string;
}
