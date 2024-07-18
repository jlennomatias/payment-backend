import { GetPaymentQuery } from './get-payment.query'
import { Logger } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { PaymentCQRSDto } from '../../dto/response-payment-v4-cqrs.dto'

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler
  implements IQueryHandler<GetPaymentQuery, PaymentCQRSDto>
{
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) { }

  async execute(query: GetPaymentQuery): Promise<PaymentCQRSDto> {
    this.logger.debug(`Listando payment: ${JSON.stringify(query)}`)
    let payments

    try {
      if (query.consent_id) {
        payments = await this.prismaService.payments.findMany({
          where: { consent_id: query.consent_id },
        })

        if (!payments.length) return null
      } else if (query.payment_id) {
        payments = await this.prismaService.payments.findUniqueOrThrow({
          where: { payment_id: query.payment_id },
        })
        
        if (!payments) return null
      }

      return payments
    } catch (error) {
      throw error
    }
}
}
