import { Logger, Injectable } from '@nestjs/common';
import { GetDictDto } from './dto/get-dict.dto';
import {
  AccountPaymentsType,
  EnumRejectionReason,
  PaymentPriorityType,
  PaymentStatusType,
  PersonType,
  localInstrument,
} from 'utils/enum/enum_pix';
import { CreatePixDto } from './dto/create-pix.dto';
import { PaymentTypeJ17 } from 'utils/enum/enum_j17';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { transformValueEnumAccountType } from 'utils/utils';
import {
  ErrorException,
  ErrorPaymentException,
} from 'src/exceptions/error.exception';
import { ErrorsCode } from 'utils/enum/enum_errors';

@Injectable()
export class PixService {
  constructor(
    private externalApiService: ExternalApiService,
    private readonly logger: Logger,
  ) {}

  async createPix(data: any): Promise<any> {
    try {
      let priorityPayment = PaymentPriorityType.PRIORITY;
      let typePriorityPayment = PaymentPriorityType.PRIORITY;

      if (data.status == PaymentStatusType.SCHD) {
        priorityPayment = 1;
        typePriorityPayment = PaymentPriorityType.SCHEDULED;
      }

      const pix: CreatePixDto = {
        valor: data.payment.amount,
        tipo: PaymentTypeJ17.TRANSFER,
        pagador_ou_recebedor: true,
        idReqSistemaCliente: data.paymentId,
        tpIniciacao: localInstrument[data.localInstrument],
        prioridadePagamento: priorityPayment,
        tpPrioridadePagamento: typePriorityPayment,
        finalidade: '0',
        ispb_destino: data.creditorAccount.ispb,
        pagador: {
          tpPessoa: PersonType[data.debtorAccount.personType],
          cpfCnpj: data.debtorAccount.cpfCnpj,
          nome: data.debtorAccount.name,
          nrAgencia: data.debtorAccount.issuer,
          tpConta: AccountPaymentsType[data.debtorAccount.accountType],
          nrConta: data.debtorAccount.number,
        },
        recebedor: {
          tpPessoa: PersonType[data.creditorAccount.personType],
          cpfCnpj: data.creditorAccount.cpfCnpj,
          nome: data.creditorAccount.name,
          nrAgencia: data.creditorAccount.issuer,
          tpConta: AccountPaymentsType[data.creditorAccount.accountType],
          nrConta: data.creditorAccount.number,
        },
      };

      this.logger.log(`Efetuando a requisição pix`);
      const response = await this.externalApiService.createPix(pix);

      const createdPix = response?.data;

      return { transactionId: createdPix.idReqJdPi };
    } catch (error) {
      this.logger.log(`Erro na criação do pagamento pix:  ${error}`);

      const errorMessage = error.message || 'Falha não identificada';

      const errorBody = {
        paymentId: data.paymentId,
      };

      if (
        errorMessage.includes('JDPISPI001') ||
        errorMessage.includes('JDPISPI003')
      ) {
        throw new ErrorPaymentException(
          EnumRejectionReason.SALDO_INSUFICIENTE,
          errorMessage,
          errorBody,
        );
      }

      if (errorMessage.includes('JDPISPI002')) {
        throw new ErrorPaymentException(
          EnumRejectionReason.PAGAMENTO_RECUSADO_SPI,
          errorMessage,
          errorBody,
        );
      }

      if (
        errorMessage.includes('JDPISPI004') ||
        errorMessage.includes('JDPISPI005')
      ) {
        throw new ErrorPaymentException(
          EnumRejectionReason.FALHA_INFRAESTRUTURA_DETENTORA,
          errorMessage,
          errorBody,
        );
      }

      if (errorMessage.includes('JDPISPI008')) {
        throw new ErrorPaymentException(
          EnumRejectionReason.VALOR_INVALIDO,
          errorMessage,
          errorBody,
        );
      }

      if (
        errorMessage.includes('JDPISPI009') ||
        errorMessage.includes('JDPISPI010') ||
        errorMessage.includes('JDPISPI011') ||
        errorMessage.includes('JDPISPI012')
      ) {
        throw new ErrorPaymentException(
          EnumRejectionReason.PAGAMENTO_RECUSADO_DETENTORA,
          errorMessage,
          errorBody,
        );
      }

      if (errorMessage.includes('JDPISPI013')) {
        throw new ErrorPaymentException(
          EnumRejectionReason.FALHA_INFRAESTRUTURA_PSP_RECEBEDOR,
          errorMessage,
          errorBody,
        );
      }

      throw new ErrorException(
        ErrorsCode.FALHA_INFRAESTRUTURA,
        errorMessage,
        errorBody,
      );
    }
  }

  async getPix(id: string): Promise<GetDictDto> {
    const result = await this.externalApiService.getPix(id);
    return result;
  }

  async getDict(proxy: string, cpfCnpj: string): Promise<any> {
    try {
      this.logger.log(`Consultando o dict`);

      const response = await this.externalApiService.getDictData({
        chave: proxy,
        user_document: cpfCnpj,
      });

      const dataDict = response.data;

      return {
        ispb: dataDict.ispb,
        issuer: dataDict.nrAgencia,
        number: dataDict.nrConta,
        accountType: transformValueEnumAccountType(dataDict.tpConta),
      };
    } catch (error) {
      const message = error.message;

      if (message.includes('informado no header')) {
        throw new ErrorException(
          ErrorsCode.DETALHE_PAGAMENTO_INVALIDO,
          `CPF/CNPJ is invalid`,
        );
      }

      if (message.includes('Entidade não encontrada')) {
        throw new ErrorException(
          ErrorsCode.DETALHE_PAGAMENTO_INVALIDO,
          `Proxy ${proxy} not found`,
        );
      }

      throw new ErrorException(
        ErrorsCode.FALHA_INFRAESTRUTURA,
        `Falha ao consultar DICT: proxy ${proxy}`,
      );
    }
  }
}
