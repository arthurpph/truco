export interface Player {
  id: string;
  name: string;
  isReady: boolean;
}

export type Team = [Player, Player];

export interface Room {
  id: string;
  name: string;
  teams: [Team, Team];
}

export interface ShowRoomInfo {
  show: boolean;
  roomId?: string;
}
