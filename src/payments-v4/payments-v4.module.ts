import { Module } from '@nestjs/common';
import { PaymentsV4Service } from './payments-v4.service';
import { PaymentsV4Controller } from './payments-v4.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PixModule } from 'src/pix/pix.module';
import { RulesPaymentV4Module } from 'src/rules-payment-v4/rules-payment-v4.module';
import { WebhookPaymentsModule } from 'src/webhook-payments/webhook-payments.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { PaymentV4RulesService } from './business-rules/payment-rules.service';

@Module({
  imports: [
    PrismaModule,
    PixModule,
    RulesPaymentV4Module,
    WebhookPaymentsModule,
    CqrsModule,
  ],
  controllers: [PaymentsV4Controller],
  providers: [
    PaymentsV4Service,
    PaymentV4RulesService,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class PaymentsV4Module {}
