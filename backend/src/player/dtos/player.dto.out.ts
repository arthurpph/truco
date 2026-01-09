import { IsString, IsUUID } from 'class-validator';

export class PlayerDtoOut {
    @IsUUID()
    id: string;

    @IsString()
    name: string;
}
