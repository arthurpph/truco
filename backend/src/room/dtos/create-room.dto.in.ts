import { IsString } from 'class-validator';

export class CreateRoomDto {
    @IsString()
    roomName: string;

    @IsString()
    playerName: string;
}
