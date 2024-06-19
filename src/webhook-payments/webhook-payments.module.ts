import { Module } from '@nestjs/common';
import { WebhookPaymentsService } from './webhook-payments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventHandlers } from './events';
import { ExternalApiModule } from 'src/external-api/external-api.module';
import { BullModule } from '@nestjs/bull';
import { QueueConsumers } from './queues';
// import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PrismaModule,
    ExternalApiModule,
    // ScheduleModule.forRoot(),
    BullModule.registerQueue({ name: 'payment' }),
    BullModule.registerQueue({ name: 'webhooks' }),
  ],
  providers: [WebhookPaymentsService, ...EventHandlers, ...QueueConsumers],
  exports: [WebhookPaymentsService],
})
export class WebhookPaymentsModule {}
