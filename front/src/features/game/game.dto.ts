import { CardDTO, PlayerDTO } from '../../types/dtos';

export type TeamGameDTO = {
    id: string;
    players: PlayerDTO[];
};

export type PlayCardDTO = {
    gameId: string;
    playerId: string;
    card: CardDTO;
    isDark: boolean;
};

export type TrucoAskDTO = {
    gameId: string;
    playerId: string;
};

export type CardPlayedDTO = {
    isDark: boolean;
    card?: CardDTO;
    playerId: string;
    currentPlayer: PlayerDTO;
};

export type RoundCardPlayedDTO = {
    card: CardDTO;
    team: TeamGameDTO;
};

export type RoundEndedDTO = {
    draw: boolean;
    teamWinner?: TeamGameDTO;
    cardsPlayed: RoundCardPlayedDTO[];
};

export type RoundStartedDTO = {
    currentPlayer: PlayerDTO;
    myHand: CardDTO[];
};

export type TrucoAskedDTO = {
    playerFrom: string;
    playerFromName: string;
    playerTo: string;
    playerToName: string;
    pointsInCaseOfAccept: 3 | 6 | 9 | 12;
};

export type GameStartDTO = {
    gameId: string;
    players: PlayerDTO[];
    currentPlayer: PlayerDTO;
};
