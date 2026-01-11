export type Player = {
    id: string;
    name: string;
}

export type Team = [Player, Player];

export type Room = {
    id: string;
    name: string;
    teams: [Team, Team];
    playersReady: string[];
}

export type ShowRoomInfo = {
    show: boolean;
    roomId?: string;
}

export type Card = {
    card: string;
    suit: 'copas' | 'espadas' | 'ouros' | 'paus' | 'manilha';
    value: number;
}

export type GamePlayer = {
    id: string;
    name: string;
    hand: Card[];
}

export type GameState = {
    gameId: string;
    players: GamePlayer[];
    currentPlayer: Player;
    playedCards: Array<{ playerId: string; card?: Card; isDark: boolean }>;
    roundValue: number;
    trucoRequest?: {
        from: string;
        to: string;
        points: number;
    };
}
