import { ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { UpdateAutomaticPaymentsV1Command } from './update-payment.command'
import { Logger } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { AutomaticPaymentCQRSDto } from '../../dto/response-automatic-payment-v1-cqrs.dto'
import axios from 'axios'
import { PostTokenDto } from '@features/payments/dto/post-token.dto'
import { dataFormat } from '@util/library'

@CommandHandler(UpdateAutomaticPaymentsV1Command)
export class UpdateAutomaticPaymentHandler
  implements ICommandHandler<UpdateAutomaticPaymentsV1Command, AutomaticPaymentCQRSDto> {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) { }

  async execute(command: UpdateAutomaticPaymentsV1Command): Promise<any> {
    this.logger.log(`Update automatic-payment: ${JSON.stringify(command)}`)

    try {
      const payment = await this.prismaService.automatic_Payments.update({
        where: { recurring_payment_id: command.payment_id },
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
        
        this.logger.log(`Acionando Webhook Finansystech ${process.env.FINANSYSTECH_URL}/api/management/webhook/v1/automatic-payments/v1/pix/recurring-payments/${command.payment_id}`)

        await axios.post(`${process.env.FINANSYSTECH_URL}/api/management/webhook/v1/automatic-payments/v1/pix/recurring-payments/${command.payment_id}`,
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
