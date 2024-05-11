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
    const dataPix = await this.getDict('testepix@celcoin.com.br');

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

  async getDict(keyToFind: string): Promise<GetDictDto> {
    try {
      console.log('buscando a chave pix: ', keyToFind);
      const response = [
        {
          key: 'testepix@celcoin.com.br',
          keyType: 'CPF',
          account: {
            branch: 1,
            accountNumber: '154660617',
            accountType: 'TRAN',
            participant: '08561701',
            openingDate: '2020-10-25T08:07:39.000Z',
          },
          owner: {
            type: 'NATURAL_PERSON',
            taxIdNumber: '11223344556',
            name: 'Fulano de Tal',
          },
          endtoendid: 'E13975893902312192056OacN253q7G9',
          creationDate: '2020-10-26T12:35:48.926Z',
          keyOwnershipDate: '2020-10-26T12:35:48.921Z',
        },
        {
          key: '11223344556',
          keyType: 'CPF',
          account: {
            branch: 1,
            accountNumber: '154660617',
            accountType: 'TRAN',
            participant: '08561701',
            openingDate: '2020-10-25T08:07:39.000Z',
          },
          owner: {
            type: 'NATURAL_PERSON',
            taxIdNumber: '11223344556',
            name: 'Fulano de Tal',
          },
          endtoendid: 'E13975893902312192056OacN253q7G9',
          creationDate: '2020-10-26T12:35:48.926Z',
          keyOwnershipDate: '2020-10-26T12:35:48.921Z',
        },
        {
          key: 'cliente-a00001@pix.bcb.gov.br',
          keyType: 'CPF',
          account: {
            branch: 1,
            accountNumber: '12345678',
            accountType: 'CACC',
            participant: '99999004',
            openingDate: '2020-10-25T08:07:39.000Z',
          },
          owner: {
            type: 'NATURAL_PERSON',
            taxIdNumber: '99991111140',
            name: 'Joao Silva',
          },
          endtoendid: 'E13975893902312192056OacN253q7G9',
          creationDate: '2020-10-26T12:35:48.926Z',
          keyOwnershipDate: '2020-10-26T12:35:48.921Z',
        },
      ];
      // const response = await lastValueFrom(
      //   this.httpService.post(`http://localhost:3030/pix/v1/dict/v2/key`, data),
      // );

      const pixEncontrado = response.find((pix) => pix.key === keyToFind);
      if (pixEncontrado) {
        console.log('achou o pix:', pixEncontrado);
      }

      return pixEncontrado;
    } catch (error) {
      console.error('Ocorreu um erro:', error);
      throw error;
    }
  }
}
