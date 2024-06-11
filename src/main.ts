import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundErrorFilter } from './not-found-error/not-found-error.filter';
import { NotEqualErrorFilter } from './unprocessable-entity-error/unprocessable-entity-error.filter';
import { DefaultErrorFilter } from './default-error/default-error.filter';
import { winstonConfig } from './winston-logger';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(
    new NotFoundErrorFilter(),
    new NotEqualErrorFilter(),
    new DefaultErrorFilter(),
  );

  await app.listen(3000);
}
bootstrap();
