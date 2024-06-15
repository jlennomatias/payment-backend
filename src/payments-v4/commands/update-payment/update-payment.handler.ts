import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { CancelPaymentsV4Dto } from 'src/payments-v4/dto/cancel-payments-v4.dto';
import { UpdatePaymentsV4Command } from './update-payment.command';

@CommandHandler(UpdatePaymentsV4Command)
export class CancelPaymentHandler
  implements ICommandHandler<UpdatePaymentsV4Command, CancelPaymentsV4Dto>
{
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async execute(
    command: UpdatePaymentsV4Command,
  ): Promise<CancelPaymentsV4Dto | any> {
    this.logger.info(`Cancelando payment: ${command}`);

    try {
      const payment = await this.prismaService.payment.update({
        where: { paymentId: command.paymentId },
        data: command,
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
        },
      });

      return payment;
    } catch (error) {
      throw error;
    }
  }
}
