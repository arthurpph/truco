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
