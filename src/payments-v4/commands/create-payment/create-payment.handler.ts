import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentsV4Command } from './create-payment.command';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { CreatePaymentsV4Dto } from 'src/payments-v4/dto/create-payments-v4.dto';

@CommandHandler(CreatePaymentsV4Command)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentsV4Command, CreatePaymentsV4Dto>
{
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async execute(
    command: CreatePaymentsV4Command,
  ): Promise<CreatePaymentsV4Dto | any> {
    this.logger.info(`Criando payment: ${command}`);

    try {
      const payment = await this.prismaService.payment.create({
        data: {
          consentId: command.consentId,
          pixId: '',
          proxy: command.proxy,
          endToEndId: command.endToEndId,
          ibgeTownCode: command.ibgeTownCode,
          status: command.status,
          date: command.date,
          localInstrument: command.localInstrument,
          cnpjInitiator: command.cnpjInitiator,
          payment: {
            create: {
              amount: command.payment.amount,
              currency: command.payment.currency,
            },
          },
          transactionIdentification: command?.transactionIdentification,
          remittanceInformation: command.remittanceInformation,
          authorisationFlow: command?.authorisationFlow,
          qrCode: command.qrCode,
          debtorAccount: {
            create: {
              ispb: command.debtorAccount.ispb,
              issuer: command.debtorAccount.issuer,
              number: command.debtorAccount.number,
              accountType: command.debtorAccount.accountType,
            },
          },
          creditorAccount: {
            create: {
              ispb: command.creditorAccount.ispb,
              issuer: command.creditorAccount.issuer,
              number: command.creditorAccount.number,
              accountType: command.creditorAccount.accountType,
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
        },
      });

      return payment;
    } catch (error) {
      throw error;
    }
  }
}
