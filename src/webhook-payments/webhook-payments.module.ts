import { Module } from '@nestjs/common';
import { WebhookPaymentsService } from './webhook-payments.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventHandlers } from './events';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [WebhookPaymentsService, ...EventHandlers],
  exports: [WebhookPaymentsService],
})
export class WebhookPaymentsModule {}
