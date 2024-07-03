import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PaymentsV4Module } from './payments-v4/payments-v4.module';
import { AutomaticPaymentsV1Module } from './automatic-payments-v1/automatic-payments-v1.module';
// import { KeycloakModule } from './keycloak/keycloak.module';
import { PixModule } from './pix/pix.module';
import { WebhookPaymentsModule } from './webhook-payments/webhook-payments.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from 'http-exception.filter';
import { LoggingModule } from './logging.module';
import { HttpModule } from './http/http.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PaymentsV4Module,
    AutomaticPaymentsV1Module,
    // KeycloakModule,
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
