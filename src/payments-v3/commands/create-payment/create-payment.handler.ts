import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { CreatePaymentsV3Dto } from 'src/payments-v3/dto/create-payments-v3.dto';
import { CreatePaymentsV3Command } from './create-payment.command';

@CommandHandler(CreatePaymentsV3Command)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentsV3Command, CreatePaymentsV3Dto>
{
  constructor(
    private prismaService: PrismaService,
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
  ) {}

  async execute(
    command: CreatePaymentsV3Command,
  ): Promise<CreatePaymentsV3Dto | any> {
    this.logger.log(`Criando payment: ${command}`);

    try {
      const payment = await this.prismaService.payment.create({
        data: {
          consentId: command.consentId,
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
