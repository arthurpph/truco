import { Team } from 'src/shared/entities/team.entity';
import { Card } from '../entities/card.entity';

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

type RoundBase = {
    roundNumber: number;
    cardsPlayed: Card[];
};

export type Round<T> =
    | ({
          draw: false;
          teamWinner: Team<T>;
      } & RoundBase)
    | ({ draw: true } & RoundBase);
