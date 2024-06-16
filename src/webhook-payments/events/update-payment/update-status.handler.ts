import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { StatusUpdadeEvent } from './update-status.event';
import { PrismaService } from 'src/prisma/prisma.service';

@EventsHandler(StatusUpdadeEvent)
export class StatusUpdateHandler implements IEventHandler<StatusUpdadeEvent> {
  constructor(private readonly prismaService: PrismaService) {}

  async handle(event: StatusUpdadeEvent) {
    const payment = await this.prismaService.payment.findUnique({
      where: { paymentId: event.paymentId },
    });

    console.log(
      `Alterou o status do payment ${event.paymentId} para ${event.status}, dados do payment: ${payment}`,
    );
  }
}
