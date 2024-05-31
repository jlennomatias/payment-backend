import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { GetDictDto } from './dto/get-dict.dto';
import { CreatePixDto } from './dto/create-pix.dto';
// import { CreatePixDto } from './dto/create-pix.dto';

@Injectable()
export class PixService {
  constructor(private httpService: HttpService) {}

  async createPix(data: any): Promise<any> {
    console.log('- Iniciando a criação do pix');

    const dataPix = await this.getDict({
      // Mock - cpf
      payerId: '11223344556',
      key: data.proxy,
    });

    console.log('-- Criando o body para o pix');
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

    console.log('-- Efetuando a requisição createPix');
    const result = await lastValueFrom(
      this.httpService.post('http://localhost:3030/pix', pix),
    );
    console.log('-- Response da requisição createPix: ');

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
      console.log('- Consultando o dict');

      const response = await lastValueFrom(
        this.httpService.post(`http://localhost:3030/pix/v1/dict/v2/key`, data),
      );

      return response;
    } catch (error) {
      console.error(
        'Ocorreu um erro ao consultar o dict: ',
        error?.response?.data || error.code,
      );
      return error.response.data;
    }
  }
}
