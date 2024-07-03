import { Injectable } from '@nestjs/common';
import { UnprocessableEntityError } from 'src/erros';
import { CreatePaymentsV4Dto } from 'src/payments-v4/dto/create-payments-v4.dto';
import { PixService } from 'src/pix/pix.service';
import {
  findDifferencesBetweenAccounts,
  transformValueEnumAccountType,
} from 'utils/utils';

@Injectable()
export class RulesPaymentV4Service {
  constructor(private pixService: PixService) {}

  // async validateProxyDebtor(proxy: string, cpfcnpj: string): Promise<boolean> {
  //   const response = await this.pixService.validateProxyDebtor({
  //     chave: proxy,
  //     user_document: cpfcnpj,
  //   });

  //   if (response.status != 200) {
  //     throw new UnprocessableEntityError(
  //       `DETALHE_PAGAMENTO_INVALIDO`,
  //       `Detalhe do pagamento invalido`,
  //       `Proxy with ID ${proxy} not found`,
  //     );
  //   }
  //   return response.data;
  // }

  async consentsAreEquals(
    createPaymentsV4Dto: CreatePaymentsV4Dto,
  ): Promise<boolean> {
    console.log('Verificando se os consentimentos são iguais');

    const consentId = createPaymentsV4Dto.data[0].consentId;
    const allConsentIdsAreEqual = createPaymentsV4Dto.data.every(
      (item) => item.consentId === consentId,
    );
    if (!allConsentIdsAreEqual) {
      throw new UnprocessableEntityError(
        `DETALHE_PAGAMENTO_INVALIDO`,
        `Detalhe do pagamento invalido`,
        `Consents are not equal`,
      );
    }

    console.log('Verificando se as chaves PIX são iguais');
    const proxy = createPaymentsV4Dto.data[0].proxy;
    const allProxysAreEqual = createPaymentsV4Dto.data.every(
      (item) => item.proxy === proxy,
    );
    if (!allProxysAreEqual) {
      throw new UnprocessableEntityError(
        `DETALHE_PAGAMENTO_INVALIDO`,
        `Detalhe do pagamento invalido`,
        `Proxy are not equal`,
      );
    }

    return true;
  }

  async verifyAccountAndDict(creditorAccount: any, dictCreditor: any) {
    console.log('Verificando se creditorAccount são iguais');

    try {
      const allcreditorAccountsDictAreEqual = findDifferencesBetweenAccounts(
        creditorAccount,
        dictCreditor,
      );

      console.log('comparando dados: ', allcreditorAccountsDictAreEqual);
    } catch (error) {
      throw new UnprocessableEntityError(
        `DETALHE_PAGAMENTO_INVALIDO`,
        `Detalhe do pagamento inválido`,
        `Invalid data Creditor account`,
      );
    }
  }

  // async scheduleSingle(proxy: string) {
  //   console.log('Verificando se a chave pix existe');

  //   const pixData = await this.pixService.getDict(proxy);

  //   if (!pixData) {
  //     throw new UnprocessableEntityError(
  //       `DETALHE_PAGAMENTO_INVALIDO`,
  //       `Detalhe do pagamento invalido`,
  //       `Proxy with ID ${proxy} not found`,
  //     );
  //   }
  //   return pixData;
  // }

  async rulesCancelPayments(cancelPayments: any): Promise<any> {
    console.log('Iniciando as regras de negócios');
    try {
      const response = await this.cancelPayment(cancelPayments);

      return response;
    } catch (error) {
      console.error('Erro ao aplicar as regras de negócios:');
      throw error;
    }
  }

  async cancelPayment(payment: any) {
    console.log('Verificando o status do consent');
    let reasonCancel = '';
    if (payment.status === 'PDNG') {
      reasonCancel = 'CANCELADO_PENDENCIA';
    } else if (payment.status === 'SCHD') {
      reasonCancel = 'CANCELADO_AGENDAMENTO';
    } else if (payment.status === 'PATC') {
      reasonCancel = 'CANCELADO_MULTIPLAS_ALCADAS';
    } else {
      console.log('chamando o thorw');

      throw new UnprocessableEntityError(
        `PAGAMENTO_NAO_PERMITE_CANCELAMENTO`,
        `Pagamento não permite cancelamento`,
        `Pagamento possui o status diferente de SCHD/PDNG/PATC`,
      );
    }
    return reasonCancel;
  }
}
