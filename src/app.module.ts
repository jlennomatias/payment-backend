import { Module } from '@nestjs/common';
import { ConsentsModule } from './consents/consents.module';
import { PaymentsV4Module } from './payments-v4/payments-v4.module';
import { AutomaticPaymentsV1Module } from './automatic-payments-v1/automatic-payments-v1.module';
import { RecurringConsentsModule } from './recurring-consents/recurring-consents.module';
import { KeycloakModule } from './keycloak/keycloak.module';
import { PixModule } from './pix/pix.module';

@Module({
  imports: [
    ConsentsModule,
    PaymentsV4Module,
    AutomaticPaymentsV1Module,
    RecurringConsentsModule,
    KeycloakModule,
    PixModule,
  ],
})
export class AppModule {}
