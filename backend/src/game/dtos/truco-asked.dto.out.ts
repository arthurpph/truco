import { TrucoPoints } from '../types/game.type';

export class TrucoAskedDtoOut {
    playerFrom: string;
    playerTo: string;
    pointsInCaseOfAccept: TrucoPoints;
}
