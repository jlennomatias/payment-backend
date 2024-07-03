import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CancelPaymentsV4Dto } from 'src/payments-v4/dto/cancel-payments-v4.dto';
import { CancelPaymentsV4Command } from './cancel-payment.command';
import { Logger } from '@nestjs/common';

@CommandHandler(CancelPaymentsV4Command)
export class CancelPaymentHandler
  implements ICommandHandler<CancelPaymentsV4Command, CancelPaymentsV4Dto>
{
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async execute(
    command: CancelPaymentsV4Command,
  ): Promise<CancelPaymentsV4Dto | any> {
    this.logger.log(`Cancelando payment: ${JSON.stringify(command)}`);

    try {
      const payment = await this.prismaService.payment.update({
        where: { paymentId: command.paymentId },
        data: {
          status: command.status,
          cancellation: {
            create: {
              reason: command.cancellation.reason,
              cancelledFrom: command.cancellation.cancelledFrom,
              cancelledByIdentification:
                command.cancellation.cancelledByIdentification,
              cancelledByRel: command.cancellation.cancelledByRel,
            },
          },
        },
        include: {
          payment: {
            select: {
              amount: true,
              currency: true,
            },
          },
          debtorAccount: {
            select: {
              ispb: true,
              issuer: true,
              number: true,
              accountType: true,
            },
          },
          creditorAccount: {
            select: {
              ispb: true,
              issuer: true,
              number: true,
              accountType: true,
            },
          },
          cancellation: {
            select: {
              reason: true,
              cancelledFrom: true,
              cancelledAt: true,
              cancelledByIdentification: true,
              cancelledByRel: true,
            },
          },
        },
      });

      return payment;
    } catch (error) {
      throw error;
    }
  }
}
