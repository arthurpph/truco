import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './entities/jwt-payload.entity';

interface UserCredentials {
    username: string;
    passwordHash: string;
}

@Injectable()
export class AuthService {
    private readonly serverSessionId = randomUUID();
    private users = new Map<string, UserCredentials>();

    private readonly JWT_SECRET: string;
    private readonly JWT_EXPIRES_IN: string;

    constructor() {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET_KEY not defined in .env');
        }
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRES_IN = '24h';
    }

    async authenticate(username: string, password: string): Promise<string> {
        const existingUser = this.users.get(username);

        if (existingUser) {
            this.login(existingUser.passwordHash, password);
        } else {
            this.register(username, password);
        }

        return this.generateToken(username);
    }

    verifyToken(token: string): string {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;

            if (this.serverSessionId !== decoded.serverSessionId) {
                throw new UnauthorizedException('Invalid or expired token');
            }

            if (!this.users.has(decoded.username)) {
                throw new UnauthorizedException('User no longer exists');
            }

            return decoded.username;
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private async register(username: string, password: string): Promise<void> {
        const passwordHash = await bcrypt.hash(password, 10);
        this.users.set(username, { username, passwordHash });
    }

    private async login(
        userPassword: string,
        inputPassword: string,
    ): Promise<void> {
        const isPasswordValid = await bcrypt.compare(
            inputPassword,
            userPassword,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    private generateToken(username: string): string {
        return jwt.sign(
            { username, sessionId: this.serverSessionId },
            this.JWT_SECRET,
            {
                expiresIn: this.JWT_EXPIRES_IN,
            } as jwt.SignOptions,
        );
    }

    removeUser(username: string): void {
        this.users.delete(username);
    }

    getUserCount(): number {
        return this.users.size;
    }
}
