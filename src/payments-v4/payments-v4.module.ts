import { Module } from '@nestjs/common';
import { PaymentsV4Service } from './payments-v4.service';
import { PaymentsV4Controller } from './payments-v4.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PixModule } from 'src/pix/pix.module';
import { RulesPaymentV4Module } from 'src/rules-payment-v4/rules-payment-v4.module';
import { WebhookPaymentsModule } from 'src/webhook-payments/webhook-payments.module';

@Module({
  imports: [
    PrismaModule,
    PixModule,
    RulesPaymentV4Module,
    WebhookPaymentsModule,
  ],
  controllers: [PaymentsV4Controller],
  providers: [PaymentsV4Service],
})
export class PaymentsV4Module {}
