import { Injectable, Logger } from '@nestjs/common';
import { ErrorException } from 'src/exceptions/error.exception';
import { CreatePaymentsV4Dto } from 'src/payments-v4/dto/create-payments-v4.dto';
import { ErrorsCode } from 'utils/enum/enum_errors';

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

  async validateDictData(creditorAccount: any, pixData: any): Promise<any> {
    this.logger.log(`Verificando se creditorAccount são iguais`);

    try {
      const differences: any = {};

      if (creditorAccount.ispb != pixData.ispb)
        differences.ispb = {
          expected: creditorAccount.ispb,
          actual: pixData.ispb,
        };
      if (creditorAccount.issuer != pixData.issuer)
        differences.issuer = {
          expected: creditorAccount.issuer,
          actual: pixData.issuer,
        };
      if (creditorAccount.number != pixData.number)
        differences.number = {
          expected: creditorAccount.number,
          actual: pixData.number,
        };
      if (creditorAccount.accountType != pixData.accountType)
        differences.accountType = {
          expected: creditorAccount.accountType,
          actual: pixData.accountType,
        };

      if (Object.keys(differences).length > 0) {
        throw new ErrorException(
          ErrorsCode.DETALHE_PAGAMENTO_INVALIDO,
          `CreditorAccounts are not equal`,
        );
      }

      return;
    } catch (error) {
      throw new ErrorException(
        ErrorsCode.DETALHE_PAGAMENTO_INVALIDO,
        `CreditorAccounts are not equal`,
      );
    }
  }
}
