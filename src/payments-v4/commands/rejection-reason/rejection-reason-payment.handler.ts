import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CancelPaymentsV4Dto } from 'src/payments-v4/dto/cancel-payments-v4.dto';
import { Logger } from '@nestjs/common';
import { RejectionReasonPaymentsV4Command } from './rejection-reason-payment.command';
import { RejectionReasonPaymentV4Dto } from 'src/payments-v4/dto/rejection-reason-payment-v4.dto';

@CommandHandler(RejectionReasonPaymentsV4Command)
export class RejectionReasonPaymentHandler
  implements
    ICommandHandler<
      RejectionReasonPaymentsV4Command,
      RejectionReasonPaymentV4Dto
    >
{
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async execute(
    command: RejectionReasonPaymentsV4Command,
  ): Promise<CancelPaymentsV4Dto | any> {
    this.logger.log(`Cancelando payment: ${JSON.stringify(command)}`);

    try {
      const payment = await this.prismaService.payment.update({
        where: { paymentId: command.paymentId },
        data: {
          status: command.status,
          rejectionReason: {
            create: {
              code: command.rejectionReason.code,
              detail: command.rejectionReason.detail,
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
          rejectionReason: {
            select: {
              code: true,
              detail: true,
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
