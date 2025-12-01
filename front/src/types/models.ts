export interface Player {
    id: string;
    name: string;
}

export type Team = [Player, Player];

export interface Room {
    id: string;
    name: string;
    teams: [Team, Team];
    playersReady: string[];
}

export interface ShowRoomInfo {
    show: boolean;
    roomId?: string;
}

export interface Card {
    card: string;
    suit: 'copas' | 'espadas' | 'ouros' | 'paus' | 'manilha';
    value: number;
}

export interface GamePlayer {
    id: string;
    name: string;
    hand: Card[];
}

export interface GameState {
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
