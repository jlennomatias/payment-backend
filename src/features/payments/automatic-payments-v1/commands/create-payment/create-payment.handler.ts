import { ICommandHandler, CommandHandler } from '@nestjs/cqrs'
import { CreateAutomaticPaymentsV1Command } from './create-payment.command'
import { Logger } from '@nestjs/common'
import { PrismaService } from '@core/prisma/prisma.service'
import { AutomaticPaymentCQRSDto } from '../../dto/response-automatic-payment-v1-cqrs.dto'

@CommandHandler(CreateAutomaticPaymentsV1Command)
export class CreateAutomaticPaymentHandler
  implements ICommandHandler<CreateAutomaticPaymentsV1Command, any> {
  constructor(
    private prismaService: PrismaService,
    private readonly logger: Logger,
  ) { }

  async execute(command: CreateAutomaticPaymentsV1Command): Promise<any> {
    this.logger.debug(`Create automatic-payment command`)

    try {
      const payment = await this.prismaService.automatic_Payments.create({
        data: {
          recurring_consent_id: command.consent_id,
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
          risk_manual_device_id: command.risk_manual_device_id,
          risk_manual_is_rooted_device: command.risk_manual_is_rooted_device,
          risk_manual_screen_brightness: command.risk_manual_screen_brightness,
          risk_manual_elapsed_time_since_boot: command.risk_manual_elapsed_time_since_boot,
          risk_manual_os_version: command.risk_manual_os_version,
          risk_manual_user_time_zone_offset: command.risk_manual_user_time_zone_offset,
          risk_manual_language: command.risk_manual_language,
          risk_manual_screen_dimensions_height: command.risk_manual_screen_dimensions_height,
          risk_manual_screen_dimensions_width: command.risk_manual_screen_dimensions_width,
          risk_manual_account_tenure: command.risk_manual_account_tenure,
          risk_manual_geolocation_latitude: command.risk_manual_geolocation_latitude,
          risk_manual_geolocation_longitude: command.risk_manual_geolocation_longitude,
          risk_manual_geolocation_type: command.risk_manual_geolocation_type,
          risk_manual_is_call_in_progress: command.risk_manual_is_call_in_progress,
          risk_manual_is_dev_mode_enabled: command.risk_manual_is_dev_mode_enabled,
          risk_manual_is_mock_gps: command.risk_manual_is_mock_gps,
          risk_manual_is_emulated: command.risk_manual_is_emulated,
          risk_manual_is_monkey_runner: command.risk_manual_is_monkey_runner,
          risk_manual_is_charging: command.risk_manual_is_charging,
          risk_manual_is_usb_connected: command.risk_manual_is_usb_connected,
          risk_manual_antennal_information: command.risk_manual_antennal_information,
          risk_manual_integrity_app_recognition_verdict: command.risk_manual_integrity_app_recognition_verdict,
          risk_manual_integrity_device_recognition_verdict: command.risk_manual_integrity_device_recognition_verdict,
          risk_automatic_last_login_date_time: command.risk_automatic_last_login_date_time,
          risk_automatic_pix_key_registration_date_time: command.risk_automatic_pix_key_registration_date_time,
        },
      })
      
      return payment
    } catch (error) {
      throw error
    }
  }
}
