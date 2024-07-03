import { Logger, Injectable } from '@nestjs/common';
import { GetDictDto } from './dto/get-dict.dto';
import {
  AccountPaymentsType,
  PaymentPriorityType,
  PaymentStatusType,
  PersonType,
  localInstrument,
} from 'utils/enum_pix';
import { CreatePixDto } from './dto/create-pix.dto';
import { ConfigService } from '@nestjs/config';
import { PaymentTypeJ17 } from 'utils/enum_j17';
import { ExternalApiService } from 'src/external-api/external-api.service';
import { transformValueEnumAccountType } from 'utils/utils';
import { UnprocessableEntityError } from 'src/erros';
import { ErrorException } from 'src/exceptions/error.exception';
import { ErrorsCode } from 'utils/enum_errors';

@Injectable()
export class PixService {
  constructor(
    private externalApiService: ExternalApiService,
    private readonly logger: Logger,
  ) {}

  async createPix(data: any): Promise<any> {
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

    this.logger.log(`Efetuando a requisição createPix`);
    const result = await this.externalApiService.createPix(pix);

    console.log('result', result);
    this.logger.log(`Response da requisição createPix:  ${result}`);

    return result;
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

      console.log('dict', response);

      const dict = response.data;

      if (dict.length != 0) {
        const dataDict = response.data.data;

        return {
          ispb: dataDict.ispb,
          issuer: dataDict.nrAgencia,
          number: dataDict.nrConta,
          accountType: transformValueEnumAccountType(dataDict.tpConta),
        };
      }

      const message = response.data.message;

      if (message.includes('O CPF informado no header')) {
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
    } catch (error) {
      this.logger.error(`Ocorreu um erro ao consultar o dict: ${error}`);

      throw new ErrorException(
        ErrorsCode.FALHA_INFRAESTRUTURA,
        `Falha ao consultar DICT: proxy ${proxy}`,
      );
    }
  }
}
