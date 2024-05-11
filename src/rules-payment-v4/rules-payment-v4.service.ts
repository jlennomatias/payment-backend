import { Injectable } from '@nestjs/common';
import { UnprocessableEntityError } from 'src/erros';
import { CreatePaymentsV4Dto } from 'src/payments-v4/dto/create-payments-v4.dto';
import { PixService } from 'src/pix/pix.service';

@Injectable()
export class RulesPaymentV4Service {
  constructor(private pixService: PixService) {}

  async rulesCreatePayments(
    createPaymentsV4Dto: CreatePaymentsV4Dto,
  ): Promise<any> {
    console.log('Iniciando as regras de negócios', createPaymentsV4Dto);
    try {
      await this.consentsAreEquals(createPaymentsV4Dto);
      const dict = await this.dictExist(createPaymentsV4Dto.data[0].proxy);

      return dict;
    } catch (error) {
      console.error('Erro ao aplicar as regras de negócios:');
      throw error;
    }
  }

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
        `Consents are not equal`,
        `Consents are not equal`,
        `Consents are not equal`,
      );
    }
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

  async dictExist(proxy: string) {
    console.log('Verificando se a chave pix existe');

    const pixData = await this.pixService.getDict(proxy);

    if (!pixData) {
      throw new UnprocessableEntityError(
        `DETALHE_PAGAMENTO_INVALIDO`,
        `Detalhe do pagamento invalido`,
        `Proxy with ID ${proxy} not found`,
      );
    }
    return pixData;
  }

  async scheduleSingle(proxy: string) {
    console.log('Verificando se a chave pix existe');

    const pixData = await this.pixService.getDict(proxy);

    if (!pixData) {
      throw new UnprocessableEntityError(
        `DETALHE_PAGAMENTO_INVALIDO`,
        `Detalhe do pagamento invalido`,
        `Proxy with ID ${proxy} not found`,
      );
    }
    return pixData;
  }
}
