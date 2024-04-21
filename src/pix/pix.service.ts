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
    // console.log('Imprimindo conteudo do pix', data);
    const dataPix = await this.getDict({
      payerId: '11223344556',
      key: 'testepix@celcoin.com.br',
    });

    const pix: CreatePixDto = {
      amount: Number(data.data.amount),
      clientCode: data.data.transactionIdentification,
      debitParty: {
        account: dataPix.account.accountNumber,
        branch: dataPix.account.branch,
        taxId: dataPix.owner.taxIdNumber,
        accountType: dataPix.account.accountType,
        name: dataPix.owner.name,
      },
      creditParty: {
        key: data.data.proxy,
        bank: dataPix.account.participant,
        account: data.data.numberCreditor,
        branch: dataPix.account.branch,
        taxId: '11223344556',
        accountType: data.data.accountTypeCreditor,
        name: dataPix.owner.name,
      },
      endToEndId: data.data.endToEndId,
      initiationType: 'string',
      remittanceInformation: data.data.remittanceInformation,
      paymentType: data.data.localInstrument,
      urgency: 'HIGH',
      transactionType: 'string',
    };

    const result = await lastValueFrom(
      this.httpService.post('http://localhost:3030/pix', pix),
    );
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
