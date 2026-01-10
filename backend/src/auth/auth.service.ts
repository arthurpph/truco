import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

interface UserCredentials {
    username: string;
    passwordHash: string;
}

@Injectable()
export class AuthService {
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
            const isPasswordValid = await bcrypt.compare(
                password,
                existingUser.passwordHash,
            );

            if (!isPasswordValid) {
                throw new Error('Senha incorreta');
            }
        } else {
            const passwordHash = await bcrypt.hash(password, 10);
            this.users.set(username, { username, passwordHash });
        }

        return this.generateToken(username);
    }

    verifyToken(token: string): string {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as {
                username: string;
            };
            return decoded.username;
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }

    private generateToken(username: string): string {
        return jwt.sign({ username }, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        } as jwt.SignOptions);
    }

    removeUser(username: string): void {
        this.users.delete(username);
    }

    getUserCount(): number {
        return this.users.size;
    }
}
