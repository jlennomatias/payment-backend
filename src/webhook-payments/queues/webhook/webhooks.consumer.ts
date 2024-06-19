import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ProcessPaymentDto } from './dto/process-payment.dto';

Processor('webhooks');
export class WebhookConsumer {
  constructor() {}

  @Process('process-payment')
  processPayment(job: Job<ProcessPaymentDto>) {
    console.log('teste', job.data);
  }
}
