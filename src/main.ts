import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { winstonConfig } from './winston-logger';
// import { WinstonModule } from 'nest-winston';
// import { NotFoundErrorFilter } from './errors/not-found-error/not-found-error.filter';
// import { NotEqualErrorFilter } from './errors/unprocessable-entity-error/unprocessable-entity-error.filter';
// import { DefaultErrorFilter } from './errors/default-error/default-error.filter';
import { ConfigService } from '@nestjs/config';
import { ErrorExceptionFilter } from './exceptions/error.exception.impl';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: WinstonModule.createLogger(winstonConfig),
  });

  // Obtenha o ConfigService
  const configService = app.get(ConfigService);

  // Acesse a variável de ambiente NODE_ENV
  const environment = configService.get<string>('NODE_ENV');

  app.useLogger(
    environment === 'production'
      ? ['log', 'error', 'warn']
      : ['log', 'error', 'warn', 'debug', 'verbose'],
  );
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new ErrorExceptionFilter());

  // app.useGlobalFilters(
  //   new NotFoundErrorFilter(),
  //   new NotEqualErrorFilter(),
  //   new DefaultErrorFilter(),
  // );

  await app.listen(3000);
}
bootstrap();
