import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { CancelPaymentsV3Command } from './cancel-payment.command';
import { CancelPaymentsV3Dto } from 'src/payments-v3/dto/cancel-payments-v3.dto';

@CommandHandler(CancelPaymentsV3Command)
export class CancelPaymentHandler
  implements ICommandHandler<CancelPaymentsV3Command, CancelPaymentsV3Dto>
{
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async execute(
    command: CancelPaymentsV3Command,
  ): Promise<CancelPaymentsV3Dto | any> {
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
