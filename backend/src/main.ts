import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET not defined in .env');
        process.exit(1);
    }

    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:5173',
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
