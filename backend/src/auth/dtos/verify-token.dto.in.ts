import { IsString } from 'class-validator';

export class VerifyTokenDtoIn {
    @IsString()
    token: string;
}
