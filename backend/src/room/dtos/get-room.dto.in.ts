import { IsUUID } from 'class-validator';

export class GetRoomDto {
    @IsUUID()
    roomId: string;
}
