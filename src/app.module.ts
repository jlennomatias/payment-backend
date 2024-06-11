import { Module } from '@nestjs/common';
import { PaymentsV4Module } from './payments-v4/payments-v4.module';
import { AutomaticPaymentsV1Module } from './automatic-payments-v1/automatic-payments-v1.module';
// import { KeycloakModule } from './keycloak/keycloak.module';
import { PixModule } from './pix/pix.module';
import { RulesPaymentV4Module } from './rules-payment-v4/rules-payment-v4.module';
import { WebhookPaymentsModule } from './webhook-payments/webhook-payments.module';
import { LoggingModule } from './logging.module';

@Module({
  imports: [
    PaymentsV4Module,
    AutomaticPaymentsV1Module,
    // KeycloakModule,
    PixModule,
    RulesPaymentV4Module,
    WebhookPaymentsModule,
    LoggingModule,
  ],
})
export class AppModule {}
