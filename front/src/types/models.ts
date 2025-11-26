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
