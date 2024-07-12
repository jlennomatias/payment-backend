import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatusUpdadeEvent } from 'src/webhook-payments/events/update-payment/update-status.event';
import { Logger } from '@nestjs/common';
import { UpdatePaymentsV3Dto } from 'src/payments-v3/dto/update-payment-v3.dto';
import { UpdatePaymentsV3Command } from './update-payment.command';

@CommandHandler(UpdatePaymentsV3Command)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentsV3Command, UpdatePaymentsV3Dto>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
  ) {}

  async execute(
    command: UpdatePaymentsV3Command,
  ): Promise<UpdatePaymentsV3Dto | any> {
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
