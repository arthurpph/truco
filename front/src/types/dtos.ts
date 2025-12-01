export type CreateRoomDTO = {
    roomName: string;
    playerName: string;
}

export type TeamDTO = [RoomPlayerRequestDTO, RoomPlayerRequestDTO];

export type RoomDTO = {
    id: string;
    name: string;
    teams: [TeamDTO, TeamDTO];
    playersReady: string[];
}

export type RoomPlayerResponseDTO = {
    roomId: string;
    playerName: string;
}

export type RoomPlayerRequestDTO = {
    id: string;
    name: string;
};

export type JoinRoomDTO = {
    roomId: string;
    playerName: string;
}

export type LeaveRoomDTO = {
    roomId: string;
    playerName: string;
}

export type PlayerDTO = {
    id: string;
    name: string;
}

export type TeamGameDTO = {
    id: string;
    players: PlayerDTO[];
}

export type CardDTO = {
    card: string;
    suit: 'copas' | 'espadas' | 'ouros' | 'paus' | 'manilha';
    value: number;
}

export type PlayCardDTO = {
    gameId: string;
    playerId: string;
    card: CardDTO;
    isDark: boolean;
}

export type TrucoAskDTO = {
    gameId: string;
    playerId: string;
}

export type CardPlayedDTO = {
    isDark: boolean;
    card?: CardDTO;
    playerId: string;
    currentPlayer: PlayerDTO;
}

export type RoundCardPlayedDTO = {
    card: CardDTO;
    team: TeamGameDTO;
}

export type RoundEndedDTO = {
    draw: boolean;
    teamWinner?: TeamGameDTO;
    cardsPlayed: RoundCardPlayedDTO[];
}

export type RoundStartedDTO = {
    currentPlayer: PlayerDTO;
    myHand: CardDTO[];
}

export type TrucoAskedDTO = {
    playerFrom: string;
    playerFromName: string;
    playerTo: string;
    playerToName: string;
    pointsInCaseOfAccept: 3 | 6 | 9 | 12;
}

export type GameStartDTO = {
    gameId: string;
    players: PlayerDTO[];
    currentPlayer: PlayerDTO;
}
