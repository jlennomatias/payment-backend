import { Injectable } from '@nestjs/common'
import { UpdatePaymentDto } from '../dto/update-payment.dto'
import { CreateAutomaticPaymentsV1Dto } from './dto/create-automatic-payments-v1.dto'
import {
  NotFoundError,
  UnprocessableEntityError,
} from '@core/exceptions/erros/erros'
import { plainToClass } from 'class-transformer'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { PixService } from '@features/pix/pix.service'
import { ResponsePaymentsDto } from '../dto/response-payment.swagger'
import { LocalInstrumentType } from '../enums/local-instrument.enum'
import {
  cancelPaymentCommand,
  createAutomaticPaymentCommand,
  createPixCommand,
  debtorAccountCommand,
  dictCommand,
  qrCodeCommand,
  updateAutomaticPaymentCommand,
} from '../utils/payment-mapper'
import { converterStatusPix, convertToEnum } from '@util/library'
import {
  validateCancelPaymentStatus,
  validateQrCode,
} from '../utils/payment-utils'
import {
  mockDictResponse,
  mockGetAccountResponse,
  mockPixResponse,
  mockQrCodeResponse,
} from '../mock/payment.mock'
import { AutomaticPaymentCQRSDto } from './dto/response-automatic-payment-v1-cqrs.dto'
import { PaymentRejectionReasonType } from '../enums/paymentsRejectionReason.enum'
import {
  mapToAutomaticPaymentResponseDto,
  mapToPaymentResponseError,
} from '@util/responseMapper'
import { GetAutomaticPaymentQuery } from './queries/get-payment/get-payment.query'
import { CancelPaymentsDto } from '../dto/cancel-payments.dto'
import { UpdateAutomaticPaymentsV1Command } from './commands/update-payment/update-payment.command'
import { AccountsService } from '@features/accounts/accounts.service'
import { AppLogger } from '@core/logging/app-logger'

@Injectable()
export class AutomaticPaymentsV1Service {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly logger: AppLogger,
    private readonly pixService: PixService,
    private readonly accountsService: AccountsService,
  ) { }

  async create(
    createAutomaticPaymentsV1Dto: CreateAutomaticPaymentsV1Dto,
  ): Promise<ResponsePaymentsDto> {
    try {
      this.logger.log(`Iniciando a criação de pagamento`)

      if (
        [
          LocalInstrumentType.DICT,
          LocalInstrumentType.QRDN,
          LocalInstrumentType.QRES,
        ].includes(
          convertToEnum(
            createAutomaticPaymentsV1Dto.data.localInstrument,
            LocalInstrumentType,
          ),
        )
      ) {
        if (
          [LocalInstrumentType.QRDN, LocalInstrumentType.QRES].includes(
            convertToEnum(
              createAutomaticPaymentsV1Dto.data.localInstrument,
              LocalInstrumentType,
            ),
          )
        ) {
          const qrCodeConsult = qrCodeCommand(createAutomaticPaymentsV1Dto.data)

          this.logger.debug(`request qrcode: ${JSON.stringify(qrCodeConsult)}`)
          // const qrCodeResponse = await this.pixService.validateQRCode(qrCodeConsult)
          const qrCodeResponse = mockQrCodeResponse
          this.logger.debug(`response qrcode: ${JSON.stringify(qrCodeConsult)}`)

          if (!createAutomaticPaymentsV1Dto.data.creditorAccount) {
            console.log('não veio creditor')
            createAutomaticPaymentsV1Dto.data.creditorAccount = {
              ispb: `${qrCodeResponse.payeeAccount.bankCode}`,
              issuer: `${qrCodeResponse.payeeAccount.branchCode}`,
              number: `${qrCodeResponse.payeeAccount.accountNumber}${qrCodeResponse.payeeAccount.checkDigit}`,
              accountType: `${qrCodeResponse.payeeAccount.accountType}`,
            }
          }
          await validateQrCode(createAutomaticPaymentsV1Dto, qrCodeResponse)
        }

        const dictConsult = dictCommand(createAutomaticPaymentsV1Dto.data)

        try {
          this.logger.debug(`request dict: ${JSON.stringify(dictConsult)}`)
          // const dictResponse = await this.pixService.validateDICT(dictConsult)
          const dictResponse = mockDictResponse
          this.logger.debug(`response dict: ${JSON.stringify(dictResponse)}`)
          if (!createAutomaticPaymentsV1Dto.data.creditorAccount) {
            createAutomaticPaymentsV1Dto.data.creditorAccount = {
              ispb: `${dictResponse.bankAccount.bankCode}`,
              issuer: `${dictResponse.bankAccount.branchCode}`,
              number: `${dictResponse.bankAccount.accountNumber}${dictResponse.bankAccount.checkDigit}`,
              accountType: `${dictResponse.bankAccount.accountType}`,
            }
          }
        } catch (error) {
          this.logger.error(`response dict: ${error}`)
          if (error.status === 404 && error.name === 'NotFoundException') {
            throw new UnprocessableEntityError(
              `DETALHE_PAGAMENTO_INVALIDO`,
              `Detalhe do pagamento inválido`,
              `Proxy with ID ${createAutomaticPaymentsV1Dto.data.proxy} not found`,
            )
          }
        }
      }

      // Consultando a conta de debtor
      const debtorConsult = debtorAccountCommand(
        createAutomaticPaymentsV1Dto.data,
      )

      this.logger.debug(`request getAccounts: ${JSON.stringify(debtorConsult)}`)
      // const debtorResponse = await this.accountsService.getAccounts(debtorConsult, true);
      const debtorResponse = mockGetAccountResponse
      this.logger.debug(
        `response getAccounts: ${JSON.stringify(debtorResponse)}`,
      )

      // Criando pagamentos
      const command = createAutomaticPaymentCommand(
        createAutomaticPaymentsV1Dto.data,
      )
      let payment: AutomaticPaymentCQRSDto =
        await this.commandBus.execute(command)
      this.logger.debug(`response payment: ${JSON.stringify(payment)}`)

      const pixData = createPixCommand(payment, debtorResponse[0].holderName)
      try {
        this.logger.debug(`request pix: ${JSON.stringify(pixData)}`)
        // const pixResponse = payment.status === 'SCHD' ? await this.pixService.requestNewScheduledTransfer(pixData) : await this.pixService.requestNewPixTransfer(pixData)
        const pixResponse = mockPixResponse
        this.logger.debug(`response pix: ${JSON.stringify(pixResponse)}`)
        if (['ACSC'].includes(converterStatusPix(pixResponse.status))) {
          const command = updateAutomaticPaymentCommand(
            payment.recurring_payment_id,
            { status: 'ACSC' },
          )
          payment = await this.commandBus.execute(command)
        }
      } catch (error) {
        this.logger.error(
          `response pix error:, ${error}, ${error.status}, ${error.message}`,
        )
        if (
          error.status === 400 &&
          error.message ===
          'The amount passed is greater than the current balance'
        ) {
          const command = updateAutomaticPaymentCommand(
            payment.recurring_payment_id,
            {
              status: 'RJCT',
              rejection_code: PaymentRejectionReasonType.SALDO_INSUFICIENTE,
              rejection_detail: error.message,
            },
          )
          await this.commandBus.execute(command)

          throw new UnprocessableEntityError(
            PaymentRejectionReasonType.SALDO_INSUFICIENTE,
            `O saldo da conta é insuficiente`,
            error.message,
          )
        }
        if (error.status === 400) {
          const command = updateAutomaticPaymentCommand(
            payment.recurring_payment_id,
            {
              status: 'RJCT',
              rejection_code:
                PaymentRejectionReasonType.PAGAMENTO_RECUSADO_DETENTORA,
              rejection_detail: error.message,
            },
          )
          await this.commandBus.execute(command)

          throw new UnprocessableEntityError(
            PaymentRejectionReasonType.PAGAMENTO_RECUSADO_DETENTORA,
            `Pagamento recusado na detentora`,
            error.message,
          )
        }
      }

      return mapToAutomaticPaymentResponseDto(payment)
    } catch (error) {
      // Tratar erros gerais
      this.logger.error(`Erro ao cadastrar pagamento:  ${error}`)
      return mapToPaymentResponseError(error)
    }
  }

  async findOne(id: string): Promise<AutomaticPaymentCQRSDto> {
    try {
      const query = plainToClass(GetAutomaticPaymentQuery, { payment_id: id })
      let payment = await this.queryBus.execute(query)

      if (['RCVD', 'SCHD'].includes(payment.status)) {
        this.logger.debug(`request getPix`)
        // const pixResponse = await this.pixService.getPixTransferByEndToEndId(payment.end_to_end_id)
        const pixResponse = mockPixResponse
        this.logger.debug(`response getPix:  ${JSON.stringify(pixResponse)}`)

        if (['FAIL', 'RJCT'].includes(converterStatusPix(pixResponse.status))) {
          const command = updateAutomaticPaymentCommand(
            payment.recurring_payment_id,
            {
              status: 'RJCT',
              rejection_code:
                PaymentRejectionReasonType.PAGAMENTO_RECUSADO_DETENTORA,
              rejection_detail:
                'O pagamento foi recusado na instituição detentora.',
            },
          )
          payment = await this.commandBus.execute(command)
        }
        if (['ACSC'].includes(converterStatusPix(pixResponse.status))) {
          const command = updateAutomaticPaymentCommand(
            payment.recurring_payment_id,
            { status: 'ACSC' },
          )
          payment = await this.commandBus.execute(command)
        }
      }

      delete payment.proxy
      delete payment.local_instrument

      return mapToAutomaticPaymentResponseDto(payment)
    } catch (error) {
      this.logger.error(`error: ${error}`)
      if (error.code === 'P2025') {
        throw new NotFoundError(
          PaymentRejectionReasonType.NAO_INFORMADO,
          error.meta?.message || `PaymentId ${id} não encontrado`,
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

  async findAll(id: string): Promise<any> {
    try {
      const query = plainToClass(GetAutomaticPaymentQuery, { consent_id: id })
      const payments = await this.queryBus.execute(query)

      if (!payments) {
        throw new NotFoundError(
          PaymentRejectionReasonType.NAO_INFORMADO,
          `ConsentId ${id} não encontrado`,
          'Não reportado/identificado pela instituição detentora de conta.',
        )
      }

      const listPayments = payments.map(item => {
        const { proxy, local_instrument, ...rest } = item
        return rest
      })

      return mapToAutomaticPaymentResponseDto(listPayments)
    } catch (error) {
      this.logger.error(`Erro ao listar todos os pagamentos ${error}`)
      if (error.code === 'P2025') {
        throw new NotFoundError(
          PaymentRejectionReasonType.NAO_INFORMADO,
          error.meta?.message || `ConsentId ${id} não encontrado`,
          'Não reportado/identificado pela instituição detentora de conta.',
        )
      }
      throw error
    }
  }

  async cancel(id: string, cancelAutomaticPaymentsV1Dto: CancelPaymentsDto) {
    try {
      this.logger.debug(`Iniciando o cancelamento do pagamento`)

      const query = plainToClass(GetAutomaticPaymentQuery, { payment_id: id })
      const payment = await this.queryBus.execute(query)

      cancelAutomaticPaymentsV1Dto.data.reasonCancel =
        validateCancelPaymentStatus(payment.status)

      this.logger.debug(
        `request cancel pix: ${payment.end_to_end_id}, ${payment.debtor_document}`,
      )
      // const cancelPixResponse = await this.pixService.cancelScheduledTransfer(payment.end_to_end_id, payment.debtor_document)
      const cancelPixResponse = mockPixResponse
      this.logger.debug(
        `response pix: ${JSON.stringify(cancelPixResponse)}, ${JSON.stringify(cancelPixResponse)}`,
      )

      const command = cancelPaymentCommand(
        payment.payment_id,
        cancelAutomaticPaymentsV1Dto,
      )
      const affectedRows = await this.commandBus.execute(command)

      this.logger.debug(
        `Pagamento cancelado com sucesso: ${JSON.stringify(affectedRows)}`,
      )

      return mapToAutomaticPaymentResponseDto(affectedRows)
    } catch (error) {
      this.logger.error(`Erro ao cancelar pagamento dado ${error}`)
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

  async update(id: string, updateAutomaticPaymentsV1Dto: UpdatePaymentDto) {
    try {
      this.logger.log(
        `Iniciando a atualização do pagamento: ${JSON.stringify(
          updateAutomaticPaymentsV1Dto,
        )}`,
      )

      const command = plainToClass(UpdateAutomaticPaymentsV1Command, {
        payment_id: id,
        ...updateAutomaticPaymentsV1Dto,
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
