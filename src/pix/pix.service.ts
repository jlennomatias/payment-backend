import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { GetDictDto } from './dto/get-dict.dto';
import { CreatePixDto } from './dto/create-pix.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class PixService {
  constructor(
    private httpService: HttpService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createPix(data: any): Promise<any> {
    this.logger.info(`Iniciando a criação do pix`);

    const dataPix = await this.getDict({
      // Mock - cpf
      payerId: '11223344556',
      key: data.proxy,
    });

    this.logger.info(`Criando o body para o pix`);
    const pix: CreatePixDto = {
      amount: Number(data.payment.amount),
      transactionIdentification: data.qrcode,
      clientCode: data.transactionIdentification || '14588549',
      debitParty: {
        account: dataPix.data.account.accountNumber,
        branch: dataPix.data.account.branch,
        taxId: dataPix.data.owner.taxIdNumber,
        accountType: dataPix.data.account.accountType,
        name: dataPix.data.owner.name,
      },
      creditParty: {
        key: data.proxy,
        bank: dataPix.data.account.participant,
        account: data.creditorAccount.number,
        branch: dataPix.data.account.branch,
        taxId: '11223344556',
        accountType: data.creditorAccount.accountType,
        name: dataPix.data.owner.name,
      },
      endToEndId: data.endToEndId,
      initiationType: 'string',
      remittanceInformation: data.remittanceInformation,
      paymentType: data.status === 'SCHD' ? 'SCHEDULED' : 'IMMEDIATE',
      urgency: 'HIGH',
      transactionType: 'string',
    };

    this.logger.info(`Efetuando a requisição createPix`);
    const result = await lastValueFrom(
      this.httpService.post('http://localhost:3030/pix', pix),
    );
    this.logger.info(`Response da requisição createPix:  ${result}`);

    return result.data;
  }

  async getPix(id: number): Promise<GetDictDto> {
    const result = await lastValueFrom(
      this.httpService.get(`http://localhost:3030/pix/${id}`),
    );
    return result.data;
  }

  async getDict(data: any): Promise<any> {
    try {
      this.logger.info(`Consultando o dict`);

      const response = await lastValueFrom(
        this.httpService.post(`http://localhost:3030/pix/v1/dict/v2/key`, data),
      );

      return response;
    } catch (error) {
      this.logger.info(
        `Ocorreu um erro ao consultar o dict: ${error?.response?.data || error.code}`,
      );
      return error.response.data;
    }
  }
}
