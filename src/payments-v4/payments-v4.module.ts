import { Logger, Module } from '@nestjs/common';
import { PaymentsV4Service } from './payments-v4.service';
import { PaymentsV4Controller } from './payments-v4.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PixModule } from 'src/pix/pix.module';
import { WebhookPaymentsModule } from 'src/webhook-payments/webhook-payments.module';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { PaymentV4RulesService } from './business-rules/payment-rules.service';
import { PaymentScheduler } from './payments.scheduler';
import { ScheduleModule } from '@nestjs/schedule';
import { ExternalApiModule } from 'src/external-api/external-api.module';

@Module({
  imports: [
    PrismaModule,
    PixModule,
    WebhookPaymentsModule,
    ExternalApiModule,
    CqrsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [PaymentsV4Controller],
  providers: [
    PaymentsV4Service,
    PaymentV4RulesService,
    PaymentScheduler,
    Logger,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class PaymentsV4Module {}
