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

// Game DTOs
export interface PlayerDTO {
    id: string;
    name: string;
}

export interface TeamGameDTO {
    id: string;
    players: PlayerDTO[];
}

export interface CardDTO {
    card: string;
    suit: 'copas' | 'espadas' | 'ouros' | 'paus' | 'manilha';
    value: number;
}

export interface PlayCardDTO {
    gameId: string;
    playerId: string;
    card: CardDTO;
    isDark: boolean;
}

export interface TrucoAskDTO {
    gameId: string;
    playerId: string;
}

export interface CardPlayedDTO {
    isDark: boolean;
    card?: CardDTO;
    playerId: string;
    currentPlayer: PlayerDTO;
}

export interface RoundCardPlayedDTO {
    card: CardDTO;
    team: TeamGameDTO;
}

export interface RoundEndedDTO {
    draw: boolean;
    teamWinner?: TeamGameDTO;
    cardsPlayed: RoundCardPlayedDTO[];
}

export interface RoundStartedDTO {
    currentPlayer: PlayerDTO;
    myHand: CardDTO[];
}

export interface TrucoAskedDTO {
    playerFrom: string;
    playerFromName: string;
    playerTo: string;
    playerToName: string;
    pointsInCaseOfAccept: 3 | 6 | 9 | 12;
}

export interface GameStartDTO {
    gameId: string;
    players: PlayerDTO[];
    currentPlayer: PlayerDTO;
}
