import { type TrucoPoints } from '../types/game.type';

export class TrucoAskedDtoOut {
    playerFrom: string;
    playerFromName: string;
    playerTo: string;
    playerToName: string;
    pointsInCaseOfAccept: TrucoPoints;
}
