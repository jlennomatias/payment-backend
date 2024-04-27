import { Module } from '@nestjs/common';
import { WebhookPaymentsService } from './webhook-payments.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  providers: [WebhookPaymentsService],
  exports: [WebhookPaymentsService],
})
export class WebhookPaymentsModule {}
