import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs'
import { UpdatePaymentsV4Command } from './update-payment.command'
import { Logger } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { PaymentCQRSDto } from '../../dto/response-payment-v4-cqrs.dto'
import { PostTokenDto } from '@features/payments/dto/post-token.dto'
import axios from 'axios'
import { dataFormat } from '@util/library'

@CommandHandler(UpdatePaymentsV4Command)
export class UpdatePaymentHandler
  implements ICommandHandler<UpdatePaymentsV4Command, PaymentCQRSDto> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
  ) { }

  async execute(command: UpdatePaymentsV4Command): Promise<PaymentCQRSDto> {
    this.logger.log(`Update payment: ${JSON.stringify(command)}`)

    try {
      const payment = await this.prismaService.payments.update({
        where: { payment_id: command.payment_id },
        data: {
          status: command.status,
          transaction_identification: command.transaction_identification,
          rejection_code: command.rejection_code,
          rejection_detail: command.rejection_detail,
          cancelled_reason: command.cancelled_reason,
          cancelled_from: command.cancelled_from,
          cancelled_at: command.cancelled_at,
          cancelled_by_identification: command.cancelled_by_identification,
          cancelled_by_rel: command.cancelled_by_rel,
        },
      })
      if (command.status) {
        const params = new URLSearchParams()

        params.append('grant_type', 'client_credentials');
        params.append('client_id', process.env.CLIENT_ID_FINANSYSTECH);
        params.append('client_secret', process.env.CLIENT_SECRET_FINANSYSTECH);

        const { data }: PostTokenDto = await axios.post(process.env.KEYCLOAK_FINANSYSTECH, params)

        this.logger.log(`Acionando Webhook Finansystech: ${process.env.FINANSYSTECH_URL}/api/management/webhook/v1/payments/v4/pix/payments/${command.payment_id}`)

        await axios.post(`${process.env.FINANSYSTECH_URL}/api/management/webhook/v1/payments/v4/pix/payments/${command.payment_id}`,
          {
            "data": {
              "timestamp": dataFormat(new Date().toISOString())
            }
          },
          {
            headers: {
              Authorization: `Bearer ${data.access_token}`
            }
          }
        )
      }
      return payment

    } catch (error) {
      throw error
    }
  }
}
