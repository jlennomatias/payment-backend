import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: 'debug', // Define o nível de log para 'debug' somente para dev
      // level: process.env.LOG_LEVEL || process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Payments-backend', {
          prettyPrint: true,
          colors: true,
        }),
        // winston.format.printf(
        //   ({ timestamp, level, message, correlationId }) => {
        //     return `${timestamp} [${correlationId}] ${level}: ${message}`;
        //   },
        // ),
      ),
    }),
    new winston.transports.File({
      level: 'debug', // Define o nível de log para 'debug' somente para dev
      // level: process.env.LOG_LEVEL || process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      filename: 'logs/application.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf((info) => {
          return `${info.timestamp} [${info.correlationId}] ${info.level}: ${info.message}`;
        }),
      ),
    }),
  ],
};
