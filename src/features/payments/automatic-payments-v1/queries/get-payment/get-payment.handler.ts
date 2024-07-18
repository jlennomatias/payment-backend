import { GetAutomaticPaymentQuery } from './get-payment.query'
import { Logger } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { AutomaticPaymentCQRSDto } from '../../dto/response-automatic-payment-v1-cqrs.dto'

@QueryHandler(GetAutomaticPaymentQuery)
export class GetAutomaticPaymentHandler
  implements IQueryHandler<GetAutomaticPaymentQuery, AutomaticPaymentCQRSDto> {
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) { }

  async execute(query: GetAutomaticPaymentQuery): Promise<AutomaticPaymentCQRSDto> {
    this.logger.debug(`Listando query: ${JSON.stringify(query)}`)
    let payments

    try {
      if (query.consent_id) {
        payments = await this.prismaService.automatic_Payments.findMany({
          where: { recurring_consent_id: query.consent_id },
        })

        if (!payments.length) return null
      } else if (query.payment_id) {
        payments = await this.prismaService.automatic_Payments.findUniqueOrThrow({
          where: { recurring_payment_id: query.payment_id },
        })

        if (!payments) return null
      }

      return payments
    } catch (error) {
      throw error
    }
  }
}
