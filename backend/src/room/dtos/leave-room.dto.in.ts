import { IsString, IsUUID } from 'class-validator';

export class LeaveRoomDto {
    @IsUUID()
    roomId: string;

    @IsString()
    playerName: string;
}
