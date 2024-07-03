import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StatusUpdadeEvent } from './update-status.event';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { Logger } from '@nestjs/common';

@EventsHandler(StatusUpdadeEvent)
@Processor('payment')
export class StatusUpdateHandler implements IEventHandler<StatusUpdadeEvent> {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly logger: Logger,
    @InjectQueue('payment')
    private readonly queue: Queue,
  ) {}

  async handle(event: StatusUpdadeEvent) {
    await this.queue.add('update-status-payment', JSON.stringify(event));
  }

  @Process('update-status-payment')
  async process(job: Job<StatusUpdadeEvent>) {
    const event = job.data;
    this.logger.log(
      `Enviando o evento: ${event} para o webhook da finansystech`,
    );
    const response = await this.externalApiService.postWebhookPayment(
      event.paymentId,
      {
        data: {
          timestamp: event.timestamp,
        },
      },
    );
    this.logger.log(
      `Current status for payment ${event.paymentId}: ${response.status}`,
    );
  }
}
