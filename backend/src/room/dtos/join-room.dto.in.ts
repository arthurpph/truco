import { IsString, IsUUID } from 'class-validator';

export class JoinRoomDto {
    @IsUUID()
    roomId: string;

    @IsString()
    playerName: string;
}
