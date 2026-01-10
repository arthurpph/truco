import { IsString, IsUUID } from 'class-validator';

export class ToggleIsReadyDto {
    @IsUUID()
    roomId: string;

    @IsString()
    playerName: string;
}
