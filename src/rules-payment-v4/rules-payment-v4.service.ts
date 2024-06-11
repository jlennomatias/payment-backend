import { Inject, Injectable } from '@nestjs/common';
import { UnprocessableEntityError } from 'src/erros';
import { CreatePaymentsV4Dto } from 'src/payments-v4/dto/create-payments-v4.dto';
import { PixService } from 'src/pix/pix.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class RulesPaymentV4Service {
  constructor(
    private pixService: PixService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async rulesCreatePayments(
    createPaymentsV4Dto: CreatePaymentsV4Dto,
  ): Promise<any> {
    this.logger.info(`Iniciando as regras de negócios`);

    try {
      await this.consentsAreEquals(createPaymentsV4Dto);
      const dict = await this.dictExist(createPaymentsV4Dto.data[0].proxy);
      await this.dictAccounts(
        createPaymentsV4Dto.data[0].creditorAccount,
        dict,
      );

      return dict;
    } catch (error) {
      this.logger.error(`Erro ao aplicar as regras de negócios`);

      throw error;
    }
  }

  async consentsAreEquals(
    createPaymentsV4Dto: CreatePaymentsV4Dto,
  ): Promise<boolean> {
    this.logger.info(`Verificando se os consentimentos são iguais`);

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

    this.logger.info(`Verificando se as chaves PIX são iguais`);

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
    this.logger.info(`Verificando se a chave pix existe`);

    const pixData = await this.pixService.getDict({
      // Mock - cpf
      payerId: '11223344556',
      key: proxy,
    });

    if (pixData.status === 404) {
      throw new UnprocessableEntityError(
        `DETALHE_PAGAMENTO_INVALIDO`,
        `Detalhe do pagamento invalido`,
        `Proxy with ID ${proxy} not found`,
      );
    }
    return pixData.data;
  }

  async dictAccounts(creditorAccount: any, pixData: any) {
    this.logger.info(`Verificando se creditorAccount são iguais`);

    const findDifferences = (acc1, acc2) => {
      const differences: any = {};
      if (acc1.ispb !== acc2.ispb)
        differences.ispb = { expected: acc1.ispb, actual: acc2.ispb };
      if (acc1.issuer !== acc2.issuer)
        differences.issuer = {
          expected: acc1.issuer,
          actual: acc2.issuer,
        };
      if (acc1.number !== acc2.number)
        differences.number = {
          expected: acc1.number,
          actual: acc2.number,
        };
      if (acc1.accountType !== acc2.accountType)
        differences.accountType = {
          expected: acc1.accountType,
          actual: acc2.accountType,
        };

      this.logger.info(`Campos diferentes: ${differences}`);

      if (Object.keys(differences).length === 0) {
        return [];
      } else {
        throw differences;
      }
    };

    try {
      const allcreditorAccountsDictAreEqual = findDifferences(creditorAccount, {
        ispb: pixData.account.participant,
        number: pixData.account.accountNumber,
        accountType: pixData.account.accountType,
        issuer: '0001',
      });

      this.logger.info(`comparando dados: ${allcreditorAccountsDictAreEqual}`);
    } catch (error) {
      throw new UnprocessableEntityError(
        `DETALHE_PAGAMENTO_INVALIDO`,
        `Detalhe do pagamento inválido`,
        `CreditorAccounts are not equal`,
      );
    }
  }

  async scheduleSingle(proxy: string) {
    this.logger.info(`Verificando se a chave pix existe`);

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

  async rulesCancelPayments(cancelPayments: any): Promise<any> {
    this.logger.info(`Iniciando as regras de negócios`);

    try {
      const response = await this.cancelPayment(cancelPayments);

      return response;
    } catch (error) {
      this.logger.error(`Erro ao aplicar as regras de negócio`);

      throw error;
    }
  }

  async cancelPayment(payment: any) {
    this.logger.info(`Verificando o status do consent`);

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
    this.logger.info(`Status do consent ${reasonCancel}`);
    return reasonCancel;
  }
}
