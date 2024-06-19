import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePaymentsV4Command } from './update-payment.command';
import { StatusUpdadeEvent } from 'src/webhook-payments/events/update-payment/update-status.event';
import { UpdatePaymentsV4Dto } from 'src/payments-v4/dto/update-payment-v4.dto';
import { Logger } from '@nestjs/common';

@CommandHandler(UpdatePaymentsV4Command)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentsV4Command, UpdatePaymentsV4Dto>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
  ) {}

  async execute(
    command: UpdatePaymentsV4Command,
  ): Promise<UpdatePaymentsV4Dto | any> {
    function dataFormat(params: any) {
      return params.split('.')[0] + 'Z';
    }
    this.logger.log(`Update payment: ${JSON.stringify(command)}`);

    try {
      const paymentQuery = await this.prismaService.payment.findUniqueOrThrow({
        where: { paymentId: command.paymentId },
      });
      if (paymentQuery) {
        const payment = await this.prismaService.payment.update({
          where: { paymentId: command.paymentId },
          data: {
            status: command.status,
            pixId: command.pixId,
            transactionIdentification: command.transactionIdentification,
          },
        });

        if (command.status) {
          // Pulicar evento após salvar no banco de dados
          await this.eventBus.publish(
            new StatusUpdadeEvent(
              command.paymentId,
              dataFormat(new Date(payment.statusUpdateDateTime).toISOString()),
            ),
          );
        }

        return payment;
      }
    } catch (error) {
      throw error;
    }
  }
}
