// src/logging.module.ts
import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './winston-logger';

@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  exports: [WinstonModule], // Exporte o WinstonModule para usá-lo em outros módulos
})
export class LoggingModule {}
