import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthDtoIn } from './dtos/auth.dto.in';
import { AuthService } from './auth.service';
import { AuthDtoOut } from './dtos/auth.dto.out';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    async authenticate(@Body() authDtoIn: AuthDtoIn): Promise<AuthDtoOut> {
        const { username, password } = authDtoIn;
        const token = await this.authService.authenticate(username, password);

        return {
            token,
            username,
        };
    }
}
