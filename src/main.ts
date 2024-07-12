import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { ErrorExceptionFilter } from './exceptions/error.exception.impl';
import { JwtExceptionInterceptor } from './exceptions/jwt-exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const configService = app.get(ConfigService);

  const environment = configService.get<string>('NODE_ENV');
  const port = configService.get<string>('PORT') || 3000;

  app.useLogger(
    environment === 'production'
      ? ['log', 'error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  );
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(
    new ErrorExceptionFilter(),
    new JwtExceptionInterceptor(),
  );

  console.log('SERVICE ', port);

  await app.listen(port);
}
bootstrap();
