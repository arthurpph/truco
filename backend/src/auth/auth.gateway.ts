import {
    SubscribeMessage,
    WebSocketGateway,
    MessageBody,
    WsException,
} from '@nestjs/websockets';
import { AuthService } from './auth.service';
import { AuthDtoIn } from './dtos/auth.dto.in';
import { AuthDtoOut } from './dtos/auth.dto.out';
import { type TokenVerifyDtoOut } from './dtos/token-verify.dto.out';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class AuthGateway {
    constructor(private readonly authService: AuthService) {}

    @SubscribeMessage('auth:login')
    async handleAuthentication(
        @MessageBody() data: AuthDtoIn,
    ): Promise<AuthDtoOut> {
        try {
            const token = await this.authService.authenticate(
                data.username,
                data.password,
            );

            return {
                token,
                username: data.username,
            };
        } catch (error) {
            throw new WsException(error.message);
        }
    }

    @SubscribeMessage('auth:verify')
    handleVerifyToken(
        @MessageBody() data: { token: string },
    ): TokenVerifyDtoOut {
        try {
            const username = this.authService.verifyToken(data.token);
            return {
                valid: true,
                username,
            };
        } catch (error) {
            throw new WsException(error.message);
        }
    }
}
