import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';
import { PlayerDto } from 'src/player/dtos/player.dto.out';

export class RemovePlayerDto {
    @IsUUID()
    roomId: string;

    @ValidateNested()
    @Type(() => PlayerDto)
    player: PlayerDto;
}
