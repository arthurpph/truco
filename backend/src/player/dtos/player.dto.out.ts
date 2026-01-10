import { IsString, IsUUID } from 'class-validator';

export class PlayerDto {
    @IsUUID()
    id: string;

    @IsString()
    name: string;
}
