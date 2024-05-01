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

    console.log('-- Consultando o dict');
    const dataPix = await this.getDict({
      payerId: '11223344556',
      key: 'testepix@celcoin.com.br',
    });

    console.log('-- Criando o body para o pix');
    const pix: CreatePixDto = {
      amount: Number(data.payment.amount),
      clientCode: data.transactionIdentification || '14588549',
      debitParty: {
        account: dataPix.account.accountNumber,
        branch: dataPix.account.branch,
        taxId: dataPix.owner.taxIdNumber,
        accountType: dataPix.account.accountType,
        name: dataPix.owner.name,
      },
      creditParty: {
        key: data.proxy,
        bank: dataPix.account.participant,
        account: data.creditorAccount.number,
        branch: dataPix.account.branch,
        taxId: '11223344556',
        accountType: data.creditorAccount.accountType,
        name: dataPix.owner.name,
      },
      endToEndId: data.endToEndId,
      initiationType: 'string',
      remittanceInformation: data.remittanceInformation,
      paymentType: data.localInstrument,
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

  async getPix(id: number): Promise<any> {
    const result = await lastValueFrom(
      this.httpService.get(`http://localhost:3030/pix/${id}`),
    );
    return result.data;
  }

  async getDict(data: any): Promise<GetDictDto> {
    try {
      console.log(data);

      const response = await lastValueFrom(
        this.httpService.post(`http://localhost:3030/pix/v1/dict/v2/key`, data),
      );

      return response.data;
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      throw error;
    }
  }
}
