import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { type TrucoPoints } from '../types/game.type';

export class TrucoAskedDtoOut {
    @IsUUID()
    playerFrom: string;

    @IsString()
    playerFromName: string;

    @IsUUID()
    playerTo: string;

    @IsString()
    playerToName: string;

    @ValidateNested()
    pointsInCaseOfAccept: TrucoPoints;
}
