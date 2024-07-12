import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PaymentsV4Module } from './payments-v4/payments-v4.module';
import { AutomaticPaymentsV1Module } from './automatic-payments-v1/automatic-payments-v1.module';
import { PixModule } from './pix/pix.module';
import { WebhookPaymentsModule } from './webhook-payments/webhook-payments.module';
import { APP_FILTER } from '@nestjs/core';
import { LoggingModule } from './logging.module';
import { HttpModule } from './http/http.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParamsExceptionFilter } from './exceptions/params.exception.filter';
import { PaymentsV3Module } from './payments-v3/payments-v3.module';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ParamsExceptionFilter,
    },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    PaymentsV4Module,
    AuthModule,
    AutomaticPaymentsV1Module,
    PaymentsV3Module,
    PixModule,
    WebhookPaymentsModule, // corrigir para a paymentv4 e automatic
    LoggingModule,
    HttpModule,
    ExternalApiModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.get('REDIS_URL'),
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 1000,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
        },
      }),
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorrelationIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
