import { Inject, Injectable } from '@nestjs/common';
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto';
import { CancelPaymentsV4Dto } from './dto/cancel-payments-v4.dto';
import { ResponsePaymentsV4Dto } from './dto/response-payment-v4.dto';
import {
  DefaultError,
  NotFoundError,
  UnprocessableEntityError,
} from 'src/erros';
import { PixService } from 'src/pix/pix.service';
import { WebhookPaymentsService } from 'src/webhook-payments/webhook-payments.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetPaymentQuery } from './queries/get-payment/get-payment.query';
import { plainToClass } from 'class-transformer';
import { CreatePaymentsV4Command } from './commands/create-payment/create-payment.command';
import { CancelPaymentsV4Command } from './commands/cancel-payment/cancel-payment.command';
import { PaymentV4RulesService } from './business-rules/payment-rules.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdatePaymentsV4Dto } from './dto/update-payment-v4.dto';
import { UpdatePaymentsV4Command } from './commands/update-payment/update-payment.command';

@Injectable()
export class PaymentsV4Service {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private pixService: PixService,
    private webhookPaymentsService: WebhookPaymentsService,
    private readonly paymentRulesService: PaymentV4RulesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async create(createPaymentsV4Dto: CreatePaymentsV4Dto) {
    const correlationId = this.request.correlationId;
    this.logger.debug('Hello world log', { correlationId });
    try {
      this.logger.info(
        `Payload de pagamento: ${JSON.stringify(createPaymentsV4Dto)}`,
      );

      this.logger.info(`Iniciando as regras de negócios`);
      await this.paymentRulesService.validatePaymentDataAreEquals(
        createPaymentsV4Dto,
      );

      // Consultando o dict
      const dictData = await this.pixService.getDict({
        key: createPaymentsV4Dto.data[0].proxy,
      });

      console.log('response do dict: ', dictData);

      // const dictData = await this.paymentRulesService.validateDictData(
      //   createPaymentsV4Dto.data[0].creditorAccount,
      //   createPaymentsV4Dto.data[0].proxy,
      // );

      console.log('olha o dict', JSON.stringify(dictData));

      // Criando pagamentos

      const payments = await Promise.all(
        createPaymentsV4Dto.data.map(async (dto) => {
          this.logger.info(`Validando datas`);
          const datePayment = dto.endToEndId
            .substring(9, 17)
            .replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

          const currentDate = new Date().toISOString(); // Obtém a data atual
          const dataAtual = currentDate.substring(0, 10);

          this.logger.debug(
            `agora: ${dataAtual}, data do pagamento: ${datePayment}`,
          );
          dto.status = dataAtual >= datePayment ? 'RCVD' : 'SCHD';
          this.logger.debug(`status: ${dto.status}`);

          dto.date = datePayment;

          const command = plainToClass(CreatePaymentsV4Command, {
            consentId: dto.consentId,
            proxy: dto.proxy,
            endToEndId: dto.endToEndId,
            ibgeTownCode: dto.ibgeTownCode,
            status: dto.status,
            date: dto.date,
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
              ispb: dictData.account.participant,
              issuer: '0001',
              number: dictData.account.accountNumber,
              accountType: dictData.account.accountType,
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
          const pixData = await this.pixService.createPix(dto, dictData);

          // Acionando o webhook
          this.webhookPaymentsService.fetchDataAndUpdate(
            pixData.transactionId,
            payment.paymentId,
            payment.status,
          );

          return payment;
        }),
      );

      return this.mapToPaymentV4ResponseDto(payments);
    } catch (error) {
      // Tratar erros gerais
      this.logger.error(`Erro ao cadastrar pagamento:  ${error.message}`);
      return this.mapToPaymentV4ResponseError(error);
    }
  }

  async findAll(id: string) {
    try {
      const query = plainToClass(GetPaymentQuery, { consentId: id });

      const payments = await this.queryBus.execute(query);

      if (!payments) {
        throw new NotFoundError(
          `No payments found for consent with ID ${id}`,
          `No payments found for consent with ID ${id}`,
          `No payments found for consent with ID ${id}`,
        );
      }

      return this.mapToPaymentV4ResponseDto(payments);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(
          error.code,
          `Payment with ID ${id} not found`,
          error.meta?.message || `Payment with ID ${id} not found`,
        );
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const query = plainToClass(GetPaymentQuery, { paymentId: id });

      const payment = await this.queryBus.execute(query);

      return this.mapToPaymentV4ResponseDto(payment);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(
          error.code,
          `Payment with ID ${id} not found`,
          error.meta?.message || `Payment with ID ${id} not found`,
        );
      }

      if (error.code === 'P2023') {
        throw new NotFoundError(
          error.code,
          `Payment with ID ${id} not found`,
          error.meta.message,
        );
      }
      throw error;
    }
  }

  async cancel(id: string, cancelPaymentsV4Dto: CancelPaymentsV4Dto) {
    try {
      this.logger.info(
        `Iniciando o cancelamento do pagamento: ${JSON.stringify(cancelPaymentsV4Dto)}`,
      );
      const query = plainToClass(GetPaymentQuery, { paymentId: id });

      const payment = await this.queryBus.execute(query);

      let reasonCancel = '';
      if (payment.status === 'PDNG') {
        reasonCancel = 'CANCELADO_PENDENCIA';
      } else if (payment.status === 'SCHD') {
        reasonCancel = 'CANCELADO_AGENDAMENTO';
      } else if (payment.status === 'PATC') {
        reasonCancel = 'CANCELADO_MULTIPLAS_ALCADAS';
      } else {
        throw new UnprocessableEntityError(
          `PAGAMENTO_NAO_PERMITE_CANCELAMENTO`,
          `Pagamento não permite cancelamento`,
          `Pagamento possui o status diferente de SCHD/PDNG/PATC`,
        );
      }

      const command = plainToClass(CancelPaymentsV4Command, {
        paymentId: id,
        status: cancelPaymentsV4Dto.data.status,
        cancellation: {
          reason: reasonCancel,
          cancelledFrom: cancelPaymentsV4Dto.data.cancelledFrom || 'INICIADORA',
          cancelledByIdentification:
            cancelPaymentsV4Dto.data.cancellation.cancelledBy.document
              .identification,
          cancelledByRel:
            cancelPaymentsV4Dto.data.cancellation.cancelledBy.document.rel,
        },
      });
      const affectedRows = await this.commandBus.execute(command);

      if (!affectedRows) {
        console.log('não achou pagamentos a serem alterados');
      }

      this.logger.info(
        `Pagamento cancelado com sucesso: ${JSON.stringify(affectedRows)}`,
      );

      return this.mapToPaymentV4ResponseDto(affectedRows);
    } catch (error) {
      this.logger.error(`Erro ao cancelar pagamento dado ${error}`);
      if (error.code === 'P2014') {
        throw new UnprocessableEntityError(
          `PAGAMENTO_NAO_PERMITE_CANCELAMENTO`,
          `Pagamento não permite cancelamento`,
          `Pagamento ja consta com status cancelado`,
        );
      }

      return this.mapToPaymentV4ResponseError(error);
    }
  }

  async cancelAll(id: string, cancelPaymentsV4Dto: CancelPaymentsV4Dto) {
    try {
      const query = plainToClass(GetPaymentQuery, { consentId: id });

      const payments = await this.queryBus.execute(query);

      const canceledPayments = [];

      for (const payment of payments) {
        this.logger.info(`Cancelando o pagamento ${payment.paymentId}`);

        if (
          payment.status === 'SCHD' ||
          payment.status === 'PDNG' ||
          payment.status === 'PATC'
        ) {
          let reasonCancel = '';

          if (payment.status === 'PDNG') {
            reasonCancel = 'CANCELADO_PENDENCIA';
          } else if (payment.status === 'SCHD') {
            reasonCancel = 'CANCELADO_AGENDAMENTO';
          } else if (payment.status === 'PATC') {
            reasonCancel = 'CANCELADO_MULTIPLAS_ALCADAS';
          }

          try {
            const command = plainToClass(CancelPaymentsV4Command, {
              paymentId: payment.paymentId,
              status: cancelPaymentsV4Dto.data.status,
              cancellation: {
                reason: reasonCancel,
                cancelledFrom:
                  cancelPaymentsV4Dto.data.cancelledFrom || 'INICIADORA',
                cancelledByIdentification:
                  cancelPaymentsV4Dto.data.cancellation.cancelledBy.document
                    .identification,
                cancelledByRel:
                  cancelPaymentsV4Dto.data.cancellation.cancelledBy.document
                    .rel,
              },
            });

            const affectedRows = await this.commandBus.execute(command);

            canceledPayments.push(affectedRows);
          } catch (error) {
            this.logger.error(`Erro ao cancelar o pagamento ${error.code}`);
            if (error.code === 'P2025') {
              throw new NotFoundError(
                error.code,
                `Payment with ID ${id} not found`,
                error.meta?.message || `Payment with ID ${id} not found`,
              );
            }

            if (error.code === 'P2023') {
              throw new NotFoundError(
                error.code,
                `Payment with ID ${id} not found`,
                error.meta.message,
              );
            }
            throw error;
          }
        }
      }

      return this.mapToCancellationPaymentV4ResponseDto(canceledPayments);
    } catch (error) {
      this.logger.error(`Erro ao cancelar todos os pagamentos ${error}`);
      if (error.code === 'P2014') {
        throw new UnprocessableEntityError(
          `PAGAMENTO_NAO_PERMITE_CANCELAMENTO`,
          `Pagamento não permite cancelamento`,
          `Pagamento ja consta com status cancelado`,
        );
      }
      throw error;
    }
  }

  async update(id: string, updateCreatePaymentsV4Dto: UpdatePaymentsV4Dto) {
    try {
      this.logger.info(
        `Iniciando a atualização do pagamento: ${JSON.stringify(updateCreatePaymentsV4Dto)}`,
      );

      const command = plainToClass(UpdatePaymentsV4Command, {
        paymentId: id,
        ...updateCreatePaymentsV4Dto,
      });
      const affectedRows = await this.commandBus.execute(command);

      if (!affectedRows) {
        throw new NotFoundError(
          `Payment with ID ${id} not found`,
          `Payment with ID ${id} not found`,
          `Payment with ID ${id} not found`,
        );
      }

      this.logger.info(
        `Pagamento cancelado com sucesso: ${JSON.stringify(affectedRows)}`,
      );

      return affectedRows;
    } catch (error) {
      this.logger.error(`Erro ao cancelar pagamento dado ${error}`);
      if (error.code === 'P2014') {
        throw new UnprocessableEntityError(
          `PAGAMENTO_NAO_PERMITE_CANCELAMENTO`,
          `Pagamento não permite cancelamento`,
          `Pagamento ja consta com status cancelado`,
        );
      }

      return this.mapToPaymentV4ResponseError(error);
    }
  }

  private mapToPaymentV4ResponseDto(payment): ResponsePaymentsV4Dto {
    let data;
    function dataFormat(params: any) {
      return params.split('.')[0] + 'Z';
    }

    this.logger.info(`Mapeando a response`);

    // Verificar se payment é uma lista/array de objetos
    if (Array.isArray(payment)) {
      this.logger.info(
        `Transformar cada objeto da lista para o formato desejado`,
      );

      data = payment.map((item) => ({
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
        ...(item.code && {
          rejectionReason: {
            code: item.code,
            detail: item.detail,
          },
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
    } else {
      this.logger.info(`Transformar o objeto único para o formato desejado`);

      data = {
        paymentId: payment.paymentId,
        consentId: payment.consentId,
        ...(payment.qrcode && { qrcode: payment.qrcode }), // Torna o qrcode opcional
        debtorAccount: payment.debtorAccount,
        creditorAccount: payment.creditorAccount,
        endToEndId: payment.endToEndId,
        creationDateTime: dataFormat(
          new Date(payment.creationDateTime).toISOString(),
        ),
        statusUpdateDateTime: dataFormat(
          new Date(payment.statusUpdateDateTime).toISOString(),
        ),
        proxy: payment.proxy,
        ibgeTownCode: payment.ibgeTownCode,
        status: payment.status,
        ...(payment.code && {
          rejectionReason: {
            code: payment.code,
            detail: payment.detail,
          },
        }),
        localInstrument: payment.localInstrument,
        cnpjInitiator: payment.cnpjInitiator,
        payment: {
          amount: payment.payment.amount,
          currency: payment.payment.currency,
        },
        ...(payment.transactionIdentification && {
          transactionIdentification: payment.transactionIdentification,
        }), // Torna opcional
        remittanceInformation: payment.remittanceInformation,
        ...(payment.authorisationFlow && {
          authorisationFlow: payment.authorisationFlow,
        }), // Torna opcional
        ...(payment.cancellation && {
          cancellation: {
            reason: payment.cancellation.reason,
            cancelledFrom: payment.cancellation.cancelledFrom,
            cancelledAt: dataFormat(
              new Date(payment.cancellation.cancelledAt).toISOString(),
            ),
            cancelledBy: {
              document: {
                identification: payment.cancellation.cancelledByIdentification,
                rel: payment.cancellation.cancelledByRel,
              },
            },
          },
        }), // Torna opcional
      };
    }

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

  private mapToCancellationPaymentV4ResponseDto(payment): any {
    let data;

    function dataFormat(params: any) {
      return params.split('.')[0] + 'Z';
    }

    this.logger.info(`Mapeando a response`);

    // Verificar se payment é uma lista/array de objetos
    if (Array.isArray(payment)) {
      this.logger.info(
        `Transformar cada objeto da lista para o formato desejado`,
      );
      data = payment.map((item) => ({
        paymentId: item.paymentId,
        statusUpdateDateTime: dataFormat(
          new Date(item.statusUpdateDateTime).toISOString(),
        ),
      }));
    } else {
      this.logger.info(`Transformar o objeto único para o formato desejado`);

      data = {
        paymentId: payment.paymentId,
        statusUpdateDateTime: dataFormat(
          new Date(payment.statusUpdateDateTime).toISOString(),
        ),
      };
    }

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

  private mapToPaymentV4ResponseError(error): any {
    this.logger.info(`Mapeando a saida de erro`);

    function dataFormat(params) {
      return params.split('.')[0] + 'Z';
    }

    // Retornar a estrutura com o tipo esperado
    const currentDate = new Date(); // Obtém a data atual
    const requestDateTime = dataFormat(currentDate.toISOString());
    const errors = {
      code: error.code,
      title: error.title,
      detail: error.detail,
    };
    const meta = {
      requestDateTime: requestDateTime,
    };
    throw new DefaultError([errors], meta);
    // return responseError;
  }
}
