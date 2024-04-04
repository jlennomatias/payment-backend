import { Injectable } from '@nestjs/common';
import { CreatePaymentsV4Dto } from './dto/create-payments-v4.dto';
import { CancelPaymentsV4Dto } from './dto/cancel-payments-v4.dto';
import { ResponsePaymentsV4Dto } from './dto/response-payment-v4.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NoutFoundError } from 'src/erros';

@Injectable()
export class PaymentsV4Service {
  constructor(private prismaService: PrismaService) {}

  async create(createPaymentsV4Dto: CreatePaymentsV4Dto) {
    // Validar se o consentimento são iguais
    const consentId = createPaymentsV4Dto.data[0].consentId;
    const allConsentIdsAreEqual = createPaymentsV4Dto.data.every(
      (item) => item.consentId === consentId,
    );

    if (allConsentIdsAreEqual) {
      const existingConsent = await this.prismaService.consents.findUnique({
        where: { consentId },
      });
      if (existingConsent) {
        console.log('consentimento localizado: ');
        const payments = await Promise.all(
          createPaymentsV4Dto.data.map(async (dto) => {
            const payment = await this.prismaService.payments.create({
              data: {
                consent: { connect: { consentId } },
                proxy: dto.proxy,
                endToEndId: dto.endToEndId,
                ibgeTownCode: dto.ibgeTownCode,
                status: 'RCVD',
                localInstrument: dto.localInstrument,
                cnpjInitiator: dto.cnpjInitiator,
                amount: dto.payment.amount,
                currency: dto.payment.currency,
                transactionIdentification: dto.transactionIdentification,
                remittanceInformation: dto.remittanceInformation,
                authorisationFlow: dto.authorisationFlow,
                qrCode: dto.qrCode,
              },
            });
            return payment;
          }),
        );

        return this.mapToPaymentV4ResponseDto(payments);
      } else {
        console.log('consentimento não localizado: ');
      }
    } else {
      return { error: 'consentId são diferentes' };
    }
  }

  async findAll(id: string) {
    const payments = await this.prismaService.payments.findMany({
      where: { consentId: id },
    });

    return this.mapToPaymentV4ResponseDto(payments);
  }

  async findOne(id: string) {
    try {
      const payment = await this.prismaService.payments.findUniqueOrThrow({
        where: { paymentId: id },
      });

      return this.mapToPaymentV4ResponseDto(payment);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NoutFoundError(`Payment with ID ${id} not found`);
      }
    }
  }

  async update(id: string, cancelPaymentsV4Dto: CancelPaymentsV4Dto) {
    const { data } = cancelPaymentsV4Dto;
    const payment = await this.prismaService.payments.update({
      where: { paymentId: id },
      data: {
        ...data,
      },
    });
    return this.mapToPaymentV4ResponseDto(payment);
  }

  async updateAll(id: string, cancelPaymentsV4Dto: CancelPaymentsV4Dto) {
    const { data } = cancelPaymentsV4Dto;
    const payment = await this.prismaService.payments.updateMany({
      where: { consentId: id },
      data: {
        ...data,
      },
    });
    return this.mapToPaymentV4ResponseDto(payment);
  }

  private mapToPaymentV4ResponseDto(payment): ResponsePaymentsV4Dto {
    let data;

    // Verificar se payment é uma lista/array de objetos
    if (Array.isArray(payment)) {
      // Mapear cada objeto da lista para o formato desejado
      data = payment.map((item) => ({
        paymentId: item.paymentId,
        consentId: item.consentId,
        ...(item.qrcode && { qrcode: item.qrcode }), // Torna o qrcode opcional
        debtorAccount: {
          ispb: item.ispbDebtor,
          issuer: item.issuerDebtor,
          number: item.numberDebtor,
          accountType: item.accountTypeDebtor,
        },
        creditorAccount: {
          ispb: item.ispbCreditor,
          issuer: item.issuerCreditor,
          number: item.numberCreditor,
          accountType: item.accountTypeCreditor,
        },
        endToEndId: item.endToEndId,
        creationDateTime: item.creationDateTime,
        statusUpdateDateTime: item.statusUpdateDateTime,
        proxy: item.proxy,
        ibgeTownCode: item.ibgeTownCode,
        status: item.status,
        rejectionReason: {
          code: item.code,
          detail: item.detail,
        },
        localInstrument: item.localInstrument,
        cnpjInitiator: item.cnpjInitiator,
        payment: {
          amount: item.amount,
          currency: item.currency,
        },
        transactionIdentification: item.transactionIdentification,
        remittanceInformation: item.remittanceInformation,
        authorisationFlow: item.authorisationFlow,
      }));
    } else {
      // Transformar o objeto único para o formato desejado
      data = [
        {
          paymentId: payment.paymentId,
          consentId: payment.consentId,
          ...(payment.qrcode && { qrcode: payment.qrcode }), // Torna o qrcode opcional
          debtorAccount: {
            ispb: payment.ispbDebtor,
            issuer: payment.issuerDebtor,
            number: payment.numberDebtor,
            accountType: payment.accountTypeDebtor,
          },
          creditorAccount: {
            ispb: payment.ispbCreditor,
            issuer: payment.issuerCreditor,
            number: payment.numberCreditor,
            accountType: payment.accountTypeCreditor,
          },
          endToEndId: payment.endToEndId,
          creationDateTime: payment.creationDateTime,
          statusUpdateDateTime: payment.statusUpdateDateTime,
          proxy: payment.proxy,
          ibgeTownCode: payment.ibgeTownCode,
          status: payment.status,
          rejectionReason: {
            code: payment.code,
            detail: payment.detail,
          },
          localInstrument: payment.localInstrument,
          cnpjInitiator: payment.cnpjInitiator,
          payment: {
            amount: payment.amount,
            currency: payment.currency,
          },
          transactionIdentification: payment.transactionIdentification,
          remittanceInformation: payment.remittanceInformation,
          authorisationFlow: payment.authorisationFlow,
        },
      ];
    }

    // Retornar a estrutura com o tipo esperado
    return {
      data,
      links: {
        self: '',
      },
      meta: {
        requestDateTime: '',
      },
    };
  }
}
