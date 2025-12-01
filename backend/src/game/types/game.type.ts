import { Team } from 'src/shared/entities/team.entity';
import { Card } from '../entities/card.entity';
import { PlayerGame } from '../entities/player-game.entity';

export type RoundValues = 1 | 3 | 6 | 9 | 12;

export type TrucoPoints = Exclude<RoundValues, 1>;

export type TrucoStatus =
    | {
          onGoing: false;
      }
    | {
          onGoing: true;
          playerFrom: string;
          playerTo: string;
          pointsInCaseOfAccept: TrucoPoints;
      };

export type RoundCardPlayed = {
    card: Card;
    team: Team<PlayerGame>;
};

export type RoundStatus = {
    onGoing: boolean;
    roundNumber: number;
    cardsPlayed: RoundCardPlayed[];
};

export type RoundHistory<T> =
    | ({
          draw: false;
          teamWinner: Team<T>;
      } & Omit<RoundStatus, 'onGoing'>)
    | ({ draw: true } & Omit<RoundStatus, 'onGoing'>);
