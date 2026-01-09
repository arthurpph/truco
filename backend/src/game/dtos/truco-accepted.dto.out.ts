import { IsNumber } from 'class-validator';

export class TrucoAcceptedDtoOut {
    @IsNumber()
    roundValue: number;
}
