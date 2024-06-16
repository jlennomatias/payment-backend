import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { UpdatePaymentsV4Command } from './update-payment.command';
import { StatusUpdadeEvent } from 'src/webhook-payments/events/update-payment/update-status.event';
import { UpdatePaymentsV4Dto } from 'src/payments-v4/dto/update-payment-v4.dto';

@CommandHandler(UpdatePaymentsV4Command)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentsV4Command, UpdatePaymentsV4Dto>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventBus: EventBus,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async execute(
    command: UpdatePaymentsV4Command,
  ): Promise<UpdatePaymentsV4Dto | any> {
    this.logger.info(`Update payment: ${JSON.stringify(command)}`);

    try {
      const payment = await this.prismaService.payment.update({
        where: { paymentId: command.paymentId },
        data: {
          status: command.status,
          pixId: command.pixId,
          transactionIdentification: command.transactionIdentification,
        },
      });

      // Pulicar evento após salvar no banco de dados
      await this.eventBus.publish(
        new StatusUpdadeEvent(command.paymentId, command.status),
      );

      return payment;
    } catch (error) {
      throw error;
    }
  }
}
