import { Logger, Injectable } from '@nestjs/common';
import { GetDictDto } from './dto/get-dict.dto';
import { CreatePixDto } from './dto/create-pix.dto';
import { ExternalApiService } from 'src/external-api/external-api.service';

@Injectable()
export class PixService {
  constructor(
    private readonly externalApiService: ExternalApiService,
    private readonly logger: Logger,
  ) {}

  async createPix(data: any, existingDict: any): Promise<any> {
    this.logger.log(`Iniciando a criação do pix`);

    this.logger.log(`Criando o body para o pix`);
    const pix: CreatePixDto = {
      amount: Number(data.payment.amount),
      transactionIdentification: data.qrcode,
      clientCode: data.transactionIdentification || '14588549',
      debitParty: {
        account: 'existingDict.data.account.accountNumber',
        branch: 1234,
        taxId: 'existingDict.data.owner.taxIdNumber',
        accountType: 'existingDict.data.account.accountType',
        name: 'existingDict.data.owner.name',
      },
      creditParty: {
        key: existingDict.key,
        bank: existingDict.account.participant,
        account: data.creditorAccount.number,
        branch: existingDict.account.branch,
        taxId: '11223344556',
        accountType: data.creditorAccount.accountType,
        name: existingDict.owner.name,
      },
      endToEndId: data.endToEndId,
      initiationType: 'string',
      remittanceInformation: data.remittanceInformation,
      paymentType: data.status === 'SCHD' ? 'SCHEDULED' : 'IMMEDIATE',
      urgency: 'HIGH',
      transactionType: 'string',
    };

    this.logger.log(`Efetuando a requisição createPix`);
    const result = await this.externalApiService.createPix(pix);
    this.logger.log(`Response da requisição createPix:  ${result}`);

    return result;
  }

  async getPix(id: string): Promise<GetDictDto> {
    const result = await this.externalApiService.getPix(id);
    return result;
  }

  async getDict(data: any): Promise<any> {
    try {
      this.logger.log(`Consultando o dict`);

      const response = await this.externalApiService.getDictData(data);

      return response;
    } catch (error) {
      this.logger.error(
        `Ocorreu um erro ao consultar o dict: ${error}, ${error.code}`,
      );
      return error?.response?.data || error.code || error.status;
    }
  }
}
