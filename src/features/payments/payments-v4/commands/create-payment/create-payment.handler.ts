import { ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { CreatePaymentsV4Command } from './create-payment.command'
import { Logger } from '@nestjs/common'
import { PaymentCQRSDto } from '../../dto/response-payment-v4-cqrs.dto'
import { PrismaService } from '@core/prisma/prisma.service'

@CommandHandler(CreatePaymentsV4Command)
export class CreatePaymentHandler
  implements ICommandHandler<CreatePaymentsV4Command, PaymentCQRSDto>
{
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}

  async execute(command: CreatePaymentsV4Command): Promise<PaymentCQRSDto> {
    this.logger.log(`Criando payment em command`)

    try {
      const payment = await this.prismaService.payments.create({
        data: {
          consent_id: command.consent_id,
          proxy: command.proxy,
          end_to_end_id: command.end_to_end_id,
          ibge_town_code: command.ibge_town_code,
          status: command.status,
          date: command.date,
          local_instrument: command.local_instrument,
          cnpj_initiator: command.cnpj_initiator,
          payment_amount: command.payment_amount,
          payment_currency: command.payment_currency,
          transaction_identification: command?.transaction_identification,
          remittance_information: command.remittance_information,
          authorisation_flow: command?.authorisation_flow,
          qr_code: command.qr_code,
          debtor_document: command.debtor_document,
          debtor_ispb: command.debtor_ispb,
          debtor_issuer: command.debtor_issuer,
          debtor_number: command.debtor_number,
          debtor_account_type: command.debtor_account_type,
          creditor_document: command.creditor_document,
          creditor_type: command.creditor_type,
          creditor_name: command.creditor_name,
          creditor_ispb: command.creditor_ispb,
          creditor_issuer: command.creditor_issuer,
          creditor_number: command.creditor_number,
          creditor_account_type: command.creditor_account_type,
        },
      })


      return payment
    } catch (error) {
      throw error
    }
  }
}
