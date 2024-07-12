import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto';
import { PixService } from 'src/pix/pix.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPaymentQuery } from './queries/get-payment/get-payment.query';
import { plainToClass } from 'class-transformer';
import { CreatePaymentsV4Command } from './commands/create-payment/create-payment.command';
import { PaymentV4RulesService } from './business-rules/payment-rules.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaymentScheduler } from './payments.scheduler';
import { ErrorResponseException } from 'src/exceptions/error.exception';
import { ErrorsCode } from 'utils/enum/enum_errors';
import { dataFormat } from 'utils/utils';
import { RejectionReasonPaymentsV4Command } from './commands/rejection-reason/rejection-reason-payment.command';
import { RejectionReasonPaymentV4Dto } from './dto/rejection-reason-payment-v4.dto';

@Injectable()
export class PaymentsV4Service {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly pixService: PixService,
    private readonly logger: Logger,
    private readonly paymentScheduler: PaymentScheduler,
    private readonly paymentRulesService: PaymentV4RulesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createPaymentsV4Dto: CreatePaymentsV4Dto) {
    const correlationId = this.request.correlationId;
    this.logger.debug('Hello world log', { correlationId });
    try {
      this.logger.log(
        `Payload de pagamento: ${JSON.stringify(createPaymentsV4Dto)}`,
      );

      this.logger.debug(`Iniciando as regras de negócios`);
      await this.paymentRulesService.validatePaymentDataAreEquals(
        createPaymentsV4Dto,
      );

      // Consultando o dict
      if (
        createPaymentsV4Dto.data[0].localInstrument !== 'MANU' &&
        createPaymentsV4Dto.data[0].localInstrument != 'INIC'
      ) {
        const dictData = await this.pixService.getDict(
          createPaymentsV4Dto.data[0].proxy,
          createPaymentsV4Dto.data[0].creditorAccount.cpfCnpj,
        );

        await this.paymentRulesService.validateDictData(
          createPaymentsV4Dto.data[0].creditorAccount,
          dictData,
        );
      }

      // Criando pagamentos

      const payments = await Promise.all(
        createPaymentsV4Dto.data.map(async (dto) => {
          this.logger.debug(`Validando datas`);
          const datePayment = dto.endToEndId
            .substring(9, 17)
            .replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

          const currentDate = new Date().toISOString().substring(0, 10);

          this.logger.debug(
            `agora: ${currentDate}, data do pagamento: ${datePayment}`,
          );
          const status = currentDate >= datePayment ? 'RCVD' : 'SCHD';
          this.logger.debug(`status: ${status}`);

          const date = datePayment;

          const command = plainToClass(CreatePaymentsV4Command, {
            consentId: dto.consentId,
            proxy: dto.proxy,
            endToEndId: dto.endToEndId,
            ibgeTownCode: dto.ibgeTownCode,
            status: status,
            date: date,
            localInstrument: dto.localInstrument,
            cnpjInitiator: dto.cnpjInitiator,
            payment: {
              amount: dto.payment.amount,
              currency: dto.payment.currency,
            },
            transactionIdentification: dto?.transactionIdentification,
            remittanceInformation: dto.remittanceInformation,
            authorisationFlow: dto?.authorisationFlow,
            qrCode: dto.qrCode,
            debtorAccount: {
              ispb: dto.debtorAccount.ispb,
              issuer: dto.debtorAccount.issuer,
              number: dto.debtorAccount.number,
              accountType: dto.debtorAccount.accountType,
            },
            creditorAccount: {
              ispb: dto.creditorAccount.ispb,
              issuer: dto.creditorAccount.issuer,
              number: dto.creditorAccount.number,
              accountType: dto.creditorAccount.accountType,
            },
          });

          const payment = await this.commandBus.execute(command);

          this.logger.debug(`response payment: ${JSON.stringify(payment)}`);

          // Criando o Pix
          const pixData = await this.pixService.createPix({
            ...dto,
            creditorAccount: {
              ...dto.creditorAccount,
            },
            paymentId: payment.paymentId,
            status: payment.status,
          });

          this.paymentScheduler.startCheckingPayment(
            pixData.transactionId,
            payment.paymentId,
          );

          return payment;
        }),
      );

      return this.mapToPaymentV4ResponseDto(payments);
    } catch (error) {
      this.rejectionReasonUpdate(
        error.data.paymentId,
        error.code,
        error.description || 'Não identificado',
      );

      if (error.code === 'P2021') {
        throw new ErrorResponseException(
          ErrorsCode.FALHA_INFRAESTRUTURA,
          'Erro de infraestrutura',
        );
      }

      throw new ErrorResponseException(error.code || 422, error.description);
    }
  }

  async findAll(id: string) {
    try {
      const query = plainToClass(GetPaymentQuery, { consentId: id });

      const payments = await this.queryBus.execute(query);

      if (!payments) {
        throw new ErrorResponseException(
          ErrorsCode.NAO_INFORMADO,
          `No payments found for consent with ID ${id}`,
        );
      }

      return this.mapToPaymentV4ResponseDto(payments);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ErrorResponseException(
          ErrorsCode.NAO_INFORMADO,
          `No payments found for consent with ID ${id}`,
        );
      }
      throw new ErrorResponseException(error.code, error.description);
    }
  }

  async findOne(id: string) {
    try {
      const query = plainToClass(GetPaymentQuery, { paymentId: id });

      const payment = await this.queryBus.execute(query);

      return this.mapToPaymentV4ResponseDto(payment);
    } catch (error) {
      throw new ErrorResponseException(
        ErrorsCode.NAO_INFORMADO,
        error.meta?.message || `Payment with ID ${id} not found`,
      );
    }
  }

  async rejectionReasonUpdate(paymentId: string, code: string, detail: string) {
    try {
      this.logger.log(`Iniciando a atualização do pagamento: ${paymentId}}`);

      const updatePayment: RejectionReasonPaymentV4Dto = {
        paymentId: paymentId,
        status: 'RJCT',
        rejectionReason: {
          code,
          detail,
        },
      };

      const command = plainToClass(RejectionReasonPaymentsV4Command, {
        paymentId: paymentId,
        ...updatePayment,
      });
      const affectedRows = await this.commandBus.execute(command);

      if (!affectedRows) {
        throw new ErrorResponseException(
          ErrorsCode.NAO_INFORMADO,
          `Payment with ID ${paymentId} not found`,
        );
      }

      return affectedRows;
    } catch (error) {
      this.logger.error(`Erro ao atualizar o pagamento dado ${error}`);
      if (error.code === 'P2014' || error.code === 'P2025') {
        throw new ErrorResponseException(
          ErrorsCode.NAO_INFORMADO,
          `Payment with ID ${paymentId} not found`,
        );
      }

      throw new ErrorResponseException(
        ErrorsCode.FALHA_INFRAESTRUTURA,
        error.message || 'Houve algum erro ao manipular o pagamento',
      );
    }
  }

  private mapToPaymentV4ResponseDto(payment): any {
    this.logger.log(`Mapeando a response`);

    const mapper = Array.isArray(payment) ? payment : [payment];

    const data = mapper.map((item) => ({
      paymentId: item.paymentId,
      consentId: item.consentId,
      ...(item.qrcode && { qrcode: item.qrcode }), // Torna  opcional
      debtorAccount: item.debtorAccount,
      creditorAccount: item.creditorAccount,
      endToEndId: item.endToEndId,
      creationDateTime: dataFormat(
        new Date(item.creationDateTime).toISOString(),
      ),
      statusUpdateDateTime: dataFormat(
        new Date(item.statusUpdateDateTime).toISOString(),
      ),
      proxy: item.proxy,
      ibgeTownCode: item.ibgeTownCode,
      status: item.status,
      ...(item.rejectionReason && {
        rejectionReason: { ...item.rejectionReason },
      }), // Torna opcional
      localInstrument: item.localInstrument,
      cnpjInitiator: item.cnpjInitiator,
      payment: {
        amount: item.payment.amount,
        currency: item.payment.currency,
      },
      ...(item.transactionIdentification && {
        transactionIdentification: item.transactionIdentification,
      }), // Torna opcional
      remittanceInformation: item.remittanceInformation,
      ...(item.authorisationFlow && {
        authorisationFlow: item.authorisationFlow,
      }), // Torna opcional
      ...(item.cancellation && {
        cancellation: {
          reason: item.cancellation.reason,
          cancelledFrom: item.cancellation.cancelledFrom,
          cancelledAt: dataFormat(
            new Date(item.cancellation.cancelledAt).toISOString(),
          ),
          cancelledBy: {
            document: {
              identification: item.cancellation.cancelledByIdentification,
              rel: item.cancellation.cancelledByRel,
            },
          },
        },
      }), // Torna opcional
    }));

    // Retornar a estrutura com o tipo esperado
    const currentDate = new Date(); // Obtém a data atual
    const requestDateTime = dataFormat(currentDate.toISOString());

    return {
      data,
      links: {
        self: '',
      },
      meta: {
        requestDateTime: requestDateTime,
      },
    };
  }
}
