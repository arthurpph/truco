import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { AppGateway } from './app.gateway';

@Module({
    controllers: [AppController],
    providers: [AppService, AppGateway],
    imports: [forwardRef(() => GameModule)],
    exports: [AppGateway],
})
export class AppModule {}
