import { Injectable } from '@nestjs/common';
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto';
import { CancelPaymentsV4Dto } from './dto/cancel-payments-v4.dto';
import { ResponsePaymentsV4Dto } from './dto/response-payment-v4.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DefaultError, NotFoundError } from 'src/erros';
import { PixService } from 'src/pix/pix.service';
import { RulesPaymentV4Service } from 'src/rules-payment-v4/rules-payment-v4.service';
import { WebhookPaymentsService } from 'src/webhook-payments/webhook-payments.service';

@Injectable()
export class PaymentsV4Service {
  constructor(
    private prismaService: PrismaService,
    private pixService: PixService,
    private webhookPaymentsService: WebhookPaymentsService,
    private rulesPaymentV4Service: RulesPaymentV4Service,
  ) {}

  async create(createPaymentsV4Dto: CreatePaymentsV4Dto) {
    try {
      console.log(JSON.stringify(createPaymentsV4Dto));

      // Regras de negocios
      const existingDict =
        await this.rulesPaymentV4Service.rulesCreatePayments(
          createPaymentsV4Dto,
        );

      // Criando pagamentos
      const payments = await Promise.all(
        createPaymentsV4Dto.data.map(async (dto) => {
          // Cria o pix

          console.log('- Criando pagamento');

          console.log('-Validando datas');
          const datePayment = dto.endToEndId
            .substring(9, 17)
            .replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

          const currentDate = new Date().toISOString(); // Obtém a data atual
          const dataAtual = currentDate.substring(0, 10);

          console.log('agora: ', dataAtual, datePayment);
          dto.status = dataAtual > datePayment ? 'RCVD' : 'SCHD';
          dto.date = datePayment;

          const payment = await this.prismaService.payment.create({
            data: {
              consentId: dto.consentId,
              pixId: '',
              proxy: dto.proxy,
              endToEndId: dto.endToEndId,
              ibgeTownCode: dto.ibgeTownCode,
              status: dto.status,
              date: dto.date,
              localInstrument: dto.localInstrument,
              cnpjInitiator: dto.cnpjInitiator,
              payment: {
                create: {
                  amount: dto.payment.amount,
                  currency: dto.payment.currency,
                },
              },
              transactionIdentification: dto?.transactionIdentification,
              remittanceInformation: dto.remittanceInformation,
              authorisationFlow: dto?.authorisationFlow,
              qrCode: dto.qrCode,
              debtorAccount: {
                create: {
                  ispb: existingDict.account.participant || null,
                  issuer: '0001',
                  number: existingDict.account.accountNumber,
                  accountType: existingDict.account.accountType,
                },
              },
              creditorAccount: {
                create: {
                  ispb: dto.creditorAccount.ispb,
                  issuer: dto.creditorAccount.issuer,
                  number: dto.creditorAccount.number,
                  accountType: dto.creditorAccount.accountType,
                },
              },
            },
            include: {
              payment: {
                select: {
                  amount: true,
                  currency: true,
                },
              },
              debtorAccount: {
                select: {
                  ispb: true,
                  issuer: true,
                  number: true,
                  accountType: true,
                },
              },
              creditorAccount: {
                select: {
                  ispb: true,
                  issuer: true,
                  number: true,
                  accountType: true,
                },
              },
            },
          });

          // Criando o Pix
          const pixData = await this.pixService.createPix(dto);

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
      console.error('Erro ao cadastrar pagamento: ', error.message);
      const errando = this.mapToPaymentV4ResponseError(error);
      console.log('imprimindo antes', typeof errando);
      return errando;
    }
  }

  async findAll(id: string) {
    try {
      const payments = await this.prismaService.payment.findMany({
        where: { consentId: id },
      });

      if (payments.length === 0) {
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
          `Payment with ID ${id} not found`,
          `Payment with ID ${id} not found`,
          `Payment with ID ${id} not found`,
        );
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const payment = await this.prismaService.payment.findUniqueOrThrow({
        where: { paymentId: id },
        include: {
          payment: {
            select: {
              amount: true,
              currency: true,
            },
          },
          debtorAccount: {
            select: {
              ispb: true,
              issuer: true,
              number: true,
              accountType: true,
            },
          },
          creditorAccount: {
            select: {
              ispb: true,
              issuer: true,
              number: true,
              accountType: true,
            },
          },
          cancellation: {
            select: {
              reason: true,
              cancelledFrom: true,
              cancelledAt: true,
              cancelledByIdentification: true,
              cancelledByRel: true,
            },
          },
        },
      });

      return this.mapToPaymentV4ResponseDto(payment);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError(
          `Payment with ID ${id} not found`,
          `Payment with ID ${id} not found`,
          `Payment with ID ${id} not found`,
        );
      }
      throw error;
    }
  }

  async update(id: string, cancelPaymentsV4Dto: CancelPaymentsV4Dto) {
    const paymentUpdate = await this.prismaService.payment.update({
      where: { paymentId: id },
      data: {
        status: cancelPaymentsV4Dto.data.status,
        cancellation: {
          create: {
            reason: 'CANCELADO_AGENDAMENTO',
            cancelledFrom: 'INICIADORA',
            cancelledByIdentification:
              cancelPaymentsV4Dto.data.cancellation.cancelledBy.document
                .identification,
            cancelledByRel:
              cancelPaymentsV4Dto.data.cancellation.cancelledBy.document.rel,
          },
        },
      },
    });
    console.log(paymentUpdate);
    const payment = this.findOne(id);
    return this.mapToPaymentV4ResponseDto(payment);
  }

  async updateAll(id: string, cancelPaymentsV4Dto: CancelPaymentsV4Dto) {
    const paymentsUpdate = await this.prismaService.payment.findMany({
      where: { consentId: id },
    });

    const updatedPayments = [];
    for (const payment of paymentsUpdate) {
      const updatedPayment = await this.prismaService.payment.update({
        where: { paymentId: payment.paymentId },
        data: {
          status: cancelPaymentsV4Dto.data.status,
          cancellation: {
            create: {
              reason: 'CANCELADO_AGENDAMENTO',
              cancelledFrom: 'INICIADORA',
              cancelledByIdentification:
                cancelPaymentsV4Dto.data.cancellation.cancelledBy.document
                  .identification,
              cancelledByRel:
                cancelPaymentsV4Dto.data.cancellation.cancelledBy.document.rel,
            },
          },
        },
      });

      updatedPayments.push(updatedPayment);
    }

    const payments = await this.prismaService.payment.findMany({
      where: { consentId: id },
    });
    return this.mapToPaymentV4ResponseDto(payments);
  }

  private mapToPaymentV4ResponseDto(payment): ResponsePaymentsV4Dto {
    let data;
    function dataFormat(params) {
      return params.split('.')[0] + 'Z';
    }

    console.log('- Mapeando a response');

    // Verificar se payment é uma lista/array de objetos
    if (Array.isArray(payment)) {
      // Mapear cada objeto da lista para o formato desejado
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
      }));
    } else {
      // Transformar o objeto único para o formato desejado
      data = [
        {
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
        },
      ];
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
    console.log('Mapeando a saida de erro');

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
