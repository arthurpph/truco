import { IsString, MinLength } from 'class-validator';

export class AuthDtoIn {
    @IsString()
    @MinLength(3, {
        message: 'Nome de usuário deve ter no mínimo 3 caracteres',
    })
    username: string;

    @IsString()
    @MinLength(4, { message: 'Senha deve ter no mínimo 4 caracteres' })
    password: string;
}
