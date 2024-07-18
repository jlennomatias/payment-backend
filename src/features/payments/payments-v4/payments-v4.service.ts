import { Injectable, Logger } from '@nestjs/common'
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { plainToClass } from 'class-transformer'
import { PaymentCQRSDto } from './dto/response-payment-v4-cqrs.dto'
import { ResponsePaymentsDto } from '../dto/response-payment.swagger'
import { LocalInstrumentType } from '../enums/local-instrument.enum'
import { PaymentRejectionReasonType } from '../enums/paymentsRejectionReason.enum'
import { CancelPaymentsDto } from '../dto/cancel-payments.dto'
import { PaymentStatusType } from '../enums/payment-status.enum'
import { UpdatePaymentDto } from '../dto/update-payment.dto'
import {
  cancelPaymentCommand,
  createPaymentCommand,
  createPixCommand,
  debtorAccountCommand,
  dictCommand,
  qrCodeCommand,
  updatePaymentCommand,
} from '../utils/payment-mapper'
import {
  validateCancelPaymentStatus,
  validateDict,
  validateQrCode,
} from '../utils/payment-utils'
import { PixService } from 'src/pix/pix.service'
import { converterStatusPix, convertToEnum } from 'util/library'
import { NotFoundError, UnprocessableEntityError } from 'src/core/exceptions/erros/erros'
import { UpdatePaymentsV4Command } from 'src/payments-v4/commands/update-payment/update-payment.command'
import { mapToCancellationPaymentResponseDto, mapToPaymentResponseDto, mapToPaymentResponseError } from 'util/responseMapper'

@Injectable()
export class PaymentsV4Service {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly pixService: PixService,
    private readonly logger: Logger,
  ) {}

  async create(
    createPaymentsV4Dto: CreatePaymentsV4Dto,
  ): Promise<ResponsePaymentsDto> {
    try {
      this.logger.log(`Iniciando a criação de pagamento`)

      const paymentData = createPaymentsV4Dto.data[0]
      if (
        [
          LocalInstrumentType.DICT,
          LocalInstrumentType.QRDN,
          LocalInstrumentType.QRES,
        ].includes(
          convertToEnum(paymentData.localInstrument, LocalInstrumentType),
        )
      ) {
        if (
          [LocalInstrumentType.QRDN, LocalInstrumentType.QRES].includes(
            convertToEnum(paymentData.localInstrument, LocalInstrumentType),
          )
        ) {
          const qrCodeConsult = qrCodeCommand(paymentData)

          this.logger.debug(`request qrcode: ${JSON.stringify(qrCodeConsult)}`)
          const qrCodeResponse =
            await this.pixService.validateQRCode(qrCodeConsult)
          // const qrCodeResponse = mockQrCodeResponse
          qrCodeResponse.amount = parseFloat(paymentData.payment.amount)
          this.logger.debug(`response qrcode: ${JSON.stringify(qrCodeConsult)}`)

          await validateQrCode(paymentData, qrCodeResponse)
        }

        const dictConsult = dictCommand(paymentData)

        try {
          this.logger.debug(`request dict: ${JSON.stringify(dictConsult)}`)
          const dictResponse = await this.pixService.validateDICT(dictConsult)

          // const dictResponse = mockDictResponse
          this.logger.debug(`response dict: ${JSON.stringify(dictResponse)}`)

          await validateDict(paymentData, dictResponse.bankAccount)
        } catch (error) {
          if (error.status === 404 && error.name === 'NotFoundException') {
            throw new UnprocessableEntityError(
              `DETALHE_PAGAMENTO_INVALIDO`,
              `Detalhe do pagamento inválido`,
              `Proxy with ID ${paymentData.proxy} not found`,
            )
          }
          throw error
        }
      }

      // Consultando a conta de debtor
      const debtorConsult = debtorAccountCommand(paymentData)

      this.logger.debug(`request getAccounts: ${JSON.stringify(debtorConsult)}`)
      const debtorResponse = await this.accountsService.getAccounts(
        debtorConsult,
        true,
      )
      // const debtorResponse = mockGetAccountResponse
      this.logger.debug(
        `response getAccounts: ${JSON.stringify(debtorResponse)}`,
      )

      // Criando pagamentos
      const payments: PaymentCQRSDto[] = await Promise.all(
        createPaymentsV4Dto.data.map(async dto => {
          const command = createPaymentCommand(dto)
          let payment: PaymentCQRSDto = await this.commandBus.execute(command)
          this.logger.debug(`response payment: ${JSON.stringify(payment)}`)

          const pixData = createPixCommand(
            payment,
            debtorResponse[0].holderName,
          )
          try {
            this.logger.debug(`request pix: ${JSON.stringify(pixData)}`)
            const pixResponse =
              payment.status === 'SCHD'
                ? await this.pixService.requestNewScheduledTransfer(pixData)
                : await this.pixService.requestNewPixTransfer(pixData)
            // const pixResponse = mockPixResponse

            this.logger.debug(`response pix: ${JSON.stringify(pixResponse)}`)
            if (['ACSC'].includes(converterStatusPix(pixResponse.status))) {
              const command = updatePaymentCommand(payment.payment_id, {
                status: 'ACSC',
              })
              payment = await this.commandBus.execute(command)
            }
          } catch (error) {
            this.logger.error(`response pix error: ${error}, status: ${error.status}, message: ${error.message}`)
            if (
              error.status === 400 &&
              error.message ===
                'The amount passed is greater than the current balance'
            ) {
              const command = updatePaymentCommand(payment.payment_id, {
                status: 'RJCT',
                rejection_code: PaymentRejectionReasonType.SALDO_INSUFICIENTE,
                rejection_detail: error.message,
              })
              await this.commandBus.execute(command)

              throw new UnprocessableEntityError(
                PaymentRejectionReasonType.SALDO_INSUFICIENTE,
                `O saldo da conta é insuficiente`,
                error.message,
              )
            }
            if (error.status === 400) {
              const command = updatePaymentCommand(payment.payment_id, {
                status: 'RJCT',
                rejection_code:
                  PaymentRejectionReasonType.PAGAMENTO_RECUSADO_DETENTORA,
                rejection_detail: error.message,
              })
              await this.commandBus.execute(command)

              throw new UnprocessableEntityError(
                PaymentRejectionReasonType.PAGAMENTO_RECUSADO_DETENTORA,
                `Pagamento recusado na detentora`,
                error.message,
              )
            }
          }

          return payment
        }),
      )

      return mapToPaymentResponseDto(payments)
    } catch (error) {
      // Tratar erros gerais
      this.logger.error(
        `Erro ao cadastrar pagamento:  ${error} ${error.status}`,
      )
      return mapToPaymentResponseError(error)
    }
  }

  async findOne(id: string): Promise<PaymentCQRSDto> {
    try {
      const query = plainToClass(GetPaymentQuery, { payment_id: id })
      let payment = await this.queryBus.execute(query)
      this.logger.debug(`response getPayment: ${payment.status}`)

      if (['RCVD', 'SCHD'].includes(payment.status)) {
        this.logger.debug(`request getPix`)
        const getPixResponse = await this.pixService.getPixTransferByEndToEndId(
          payment.end_to_end_id,
        )
        // const getPixResponse = mockPixResponse
        this.logger.debug(
          `response getPix:  ${JSON.stringify(getPixResponse)}, status payment: ${payment.status}`,
        )

        this.logger.debug(`response getPix:  ${JSON.stringify(getPixResponse)}`)

        if (
          ['FAIL', 'RJCT'].includes(converterStatusPix(getPixResponse.status))
        ) {
          const command = updatePaymentCommand(payment.payment_id, {
            status: 'RJCT',
            rejection_code:
              PaymentRejectionReasonType.PAGAMENTO_RECUSADO_DETENTORA,
            rejection_detail:
              'O pagamento foi recusado na instituição detentora.',
          })
          payment = await this.commandBus.execute(command)
        }
        if (['ACSC'].includes(converterStatusPix(getPixResponse.status))) {
          const command = updatePaymentCommand(payment.payment_id, {
            status: 'ACSC',
          })
          payment = await this.commandBus.execute(command)
        }
      }

      return mapToPaymentResponseDto(payment)
    } catch (error) {
      this.logger.error(`error: ${error}`)
      if (error.code === 'P2025') {
        throw new NotFoundError(
          PaymentRejectionReasonType.NAO_INFORMADO,
          error.meta?.message || `Payment with ID ${id} not found`,
          'Não reportado/identificado pela instituição detentora de conta.',
        )
      }
      if (error.status === 404) {
        throw new NotFoundError(
          PaymentRejectionReasonType.NAO_INFORMADO,
          error.message || `Payment with ID ${id} not found`,
          'Não reportado/identificado pela instituição detentora de conta.',
        )
      }
      throw error
    }
  }

  async cancel(id: string, cancelPaymentsV4Dto: CancelPaymentsDto) {
    try {
      this.logger.debug(`Iniciando o cancelamento do pagamento`)

      const query = plainToClass(GetPaymentQuery, { payment_id: id })
      const payment: PaymentCQRSDto = await this.queryBus.execute(query)

      cancelPaymentsV4Dto.data.reasonCancel = validateCancelPaymentStatus(
        payment.status,
      )

      this.logger.debug(
        `request cancel pix: ${payment.end_to_end_id}, ${payment.debtor_document}`,
      )
      const cancelPixResponse = await this.pixService.cancelScheduledTransfer(
        payment.end_to_end_id,
        payment.debtor_document,
      )
      // const cancelPixResponse = mockPixResponse
      this.logger.debug(
        `response pix: ${JSON.stringify(cancelPixResponse)}, ${JSON.stringify(cancelPixResponse)}`,
      )

      const command = cancelPaymentCommand(
        payment.payment_id,
        cancelPaymentsV4Dto,
      )
      const affectedRows = await this.commandBus.execute(command)

      this.logger.debug(
        `Pagamento cancelado com sucesso: ${JSON.stringify(affectedRows)}`,
      )

      return mapToPaymentResponseDto(affectedRows)
    } catch (error) {
      this.logger.error(`Erro ao cancelar pagamento ${error}`)
      if (error.code === 'P2014') {
        throw new UnprocessableEntityError(
          PaymentRejectionReasonType.PAGAMENTO_NAO_PERMITE_CANCELAMENTO,
          `Pagamento não permite cancelamento`,
          `Pagamento ja consta com status cancelado`,
        )
      }

      return mapToPaymentResponseError(error)
    }
  }

  async cancelAll(id: string, cancelPaymentsV4Dto: CancelPaymentsDto) {
    try {
      const query = plainToClass(GetPaymentQuery, { consent_id: id })
      const payments = await this.queryBus.execute(query)

      if (!payments) {
        throw new NotFoundError(
          'error.code',
          `Consent with ID ${id} not found`,
          'error.meta.message',
        )
      }

      const canceledPayments = []

      for (const payment of payments) {
        this.logger.log(`Cancelando o pagamento ${payment.payment_id}`)

        if (
          [
            PaymentStatusType.SCHD,
            PaymentStatusType.PDNG,
            PaymentStatusType.PATC,
          ].includes(convertToEnum(payment.status, PaymentStatusType))
        ) {
          cancelPaymentsV4Dto.data.reasonCancel = validateCancelPaymentStatus(
            payment.status,
          )

          this.logger.debug(
            `request cancel pix: ${payment.end_to_end_id}, ${payment.debtor_document}`,
          )
          const cancelPixResponse =
            await this.pixService.cancelScheduledTransfer(
              payment.end_to_end_id,
              payment.debtor_document,
            )
          // const cancelPixResponse = mockPixResponse
          this.logger.debug(
            `response pix: ${JSON.stringify(cancelPixResponse)}`,
          )

          const command = cancelPaymentCommand(
            payment.payment_id,
            cancelPaymentsV4Dto,
          )
          const affectedRows = await this.commandBus.execute(command)

          this.logger.log(`Cancelando pagamento no pix`)
          canceledPayments.push(affectedRows)
        }
      }
      return mapToCancellationPaymentResponseDto(canceledPayments)
    } catch (error) {
      this.logger.error(`Erro ao cancelar todos os pagamentos ${error}`)
      if (error.code === 'P2014') {
        throw new UnprocessableEntityError(
          PaymentRejectionReasonType.PAGAMENTO_NAO_PERMITE_CANCELAMENTO,
          `Pagamento não permite cancelamento`,
          `Pagamento ja consta com status cancelado`,
        )
      }
      throw error
    }
  }

  async update(id: string, updatePaymentsV4Dto: UpdatePaymentDto) {
    try {
      this.logger.log(
        `Iniciando a atualização do pagamento: ${JSON.stringify(
          updatePaymentsV4Dto,
        )}`,
      )

      const command = plainToClass(UpdatePaymentsV4Command, {
        payment_id: id,
        ...updatePaymentsV4Dto,
      })
      const affectedRows = await this.commandBus.execute(command)

      return affectedRows
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar o pagamento dado code ${error.code}, ${error}`,
      )
      throw new NotFoundError(
        PaymentRejectionReasonType.NAO_INFORMADO,
        `Payment with ID ${id} error`,
        `Payment with ID ${id} error`,
      )
    }
  }
}
