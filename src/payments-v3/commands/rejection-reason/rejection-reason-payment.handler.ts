import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { RejectionReasonPaymentsV3Command } from './rejection-reason-payment.command';
import { RejectionReasonPaymentV3Dto } from 'src/payments-v3/dto/rejection-reason-payment-v3.dto';
import { CancelPaymentsV3Dto } from 'src/payments-v3/dto/cancel-payments-v3.dto';

@CommandHandler(RejectionReasonPaymentsV3Command)
export class RejectionReasonPaymentHandler
  implements
    ICommandHandler<
      RejectionReasonPaymentsV3Command,
      RejectionReasonPaymentV3Dto
    >
{
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async execute(
    command: RejectionReasonPaymentsV3Command,
  ): Promise<CancelPaymentsV3Dto | any> {
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
