import { Injectable, Logger } from '@nestjs/common';
import { UnprocessableEntityError } from 'src/erros';
import { ErrorException } from 'src/exceptions/error.exception';
import { CreatePaymentsV4Dto } from 'src/payments-v4/dto/create-payments-v4.dto';
import { ErrorsCode } from 'utils/enum_errors';

@Injectable()
export class PaymentV4RulesService {
  constructor(private readonly logger: Logger) {}

  async validatePaymentDataAreEquals(
    createPaymentsV4Dto: CreatePaymentsV4Dto,
  ): Promise<boolean> {
    this.logger.log(`Verificando se os consentimentos são iguais`);

    const consentId = createPaymentsV4Dto.data[0].consentId;
    const allConsentIdsAreEqual = createPaymentsV4Dto.data.every(
      (item) => item.consentId === consentId,
    );
    if (!allConsentIdsAreEqual) {
      throw new ErrorException(
        ErrorsCode.DETALHE_PAGAMENTO_INVALIDO,
        `Consents are not equal`,
      );
    }

    this.logger.log(`Verificando se as chaves PIX são iguais`);

    const proxy = createPaymentsV4Dto.data[0].proxy;
    const allProxysAreEqual = createPaymentsV4Dto.data.every(
      (item) => item.proxy === proxy,
    );
    if (!allProxysAreEqual) {
      throw new ErrorException(
        ErrorsCode.DETALHE_PAGAMENTO_INVALIDO,
        "Proxy's are not equal",
      );
    }

    return true;
  }

  async validateDictData(
    creditorAccount: any,
    proxy: string,
    pixData: any,
  ): Promise<any> {
    this.logger.log(
      `Verificando se creditorAccount são iguais: ${creditorAccount}, ${pixData}`,
    );

    try {
      const allcreditorAccountsDictAreEqual = (creditorAccount: any) => {
        const differences: any = {};
        if (creditorAccount.ispb !== pixData.account.participant)
          differences.ispb = {
            expected: creditorAccount.ispb,
            actual: pixData.account.participant,
          };
        if (creditorAccount.issuer !== '0001')
          differences.issuer = {
            expected: creditorAccount.issuer,
            actual: '0001',
          };
        if (creditorAccount.number !== pixData.account.accountNumber)
          differences.number = {
            expected: creditorAccount.number,
            actual: pixData.account.accountNumber,
          };
        if (creditorAccount.accountType !== pixData.account.accountType)
          differences.accountType = {
            expected: creditorAccount.accountType,
            actual: pixData.account.accountType,
          };

        this.logger.log(`Campos diferentes: ${differences}`);

        if (Object.keys(differences).length === 0) {
          return [];
        } else {
          throw differences;
        }
      };

      this.logger.log(`comparando dados: ${allcreditorAccountsDictAreEqual}`);
      return true;
    } catch (error) {
      throw new UnprocessableEntityError(
        `DETALHE_PAGAMENTO_INVALIDO`,
        `Detalhe do pagamento inválido`,
        `CreditorAccounts are not equal`,
      );
    }
  }
}
