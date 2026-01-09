import { IsUUID } from 'class-validator';

export class TrucoAskDto {
    @IsUUID()
    gameId: string;
}
