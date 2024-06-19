import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StatusUpdadeEvent } from './update-status.event';
import { PrismaService } from 'src/prisma/prisma.service';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@EventsHandler(StatusUpdadeEvent)
@Processor('payment')
export class StatusUpdateHandler implements IEventHandler<StatusUpdadeEvent> {
  constructor(
    private readonly prismaService: PrismaService,

    @InjectQueue('payment')
    private readonly queue: Queue,
  ) {}

  async handle(event: StatusUpdadeEvent) {
    await this.queue.add('update-status-payment', event);
  }

  @Process('update-status-payment')
  async process(job: Job<StatusUpdadeEvent>) {
    const event = job.data;

    console.log('Acionando o webhook da finansystech', event);
  }
}
