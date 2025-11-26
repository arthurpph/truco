import { Injectable } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { Server } from 'socket.io';

@Injectable()
export class AppService {
    constructor(private readonly appGateway: AppGateway) {}

    getServer(): Server {
        return this.appGateway.server;
    }

    getHello(): string {
        return 'Hello World!';
    }
}
