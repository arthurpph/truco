import { Body, Controller, Post } from '@nestjs/common';
import { AuthDtoIn } from './dtos/auth.dto.in';
import { AuthService } from './auth.service';
import { AuthDtoOut } from './dtos/auth.dto.out';
import { VerifyTokenDtoIn } from './dtos/verify-token.dto.in';
import { VerifyTokenDtoOut } from './dtos/verify-token.dto.out';

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

    @Post('verify')
    verifyToken(@Body() verifyTokenDtoIn: VerifyTokenDtoIn): VerifyTokenDtoOut {
        const { token } = verifyTokenDtoIn;
        try {
            this.authService.verifyToken(token);
        } catch {
            return { result: false };
        }
        return { result: true };
    }
}
