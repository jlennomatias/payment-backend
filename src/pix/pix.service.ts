import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
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

@Injectable()
export class PixService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  private BASE_URI: string = this.configService.get<string>('BASE_URL');

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

    const token = await this.generateTokenPix();

    const response = await lastValueFrom(
      this.httpService.post(`${this.BASE_URI}/instant_payment`, pix, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
    );

    return response;
  }

  async validateProxyDebtor(data: any): Promise<any> {
    try {
      console.log('- Consultando o proxy do debtor');

      const response = await lastValueFrom(
        this.httpService.post(`${this.BASE_URI}/key/consult`, data),
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

  async getPix(id: number): Promise<GetDictDto> {
    const token = await this.generateTokenPix();

    const result = await lastValueFrom(
      this.httpService.get(
        `${this.BASE_URI}/instant_payment/details?idTransacao=${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    return result.data;
  }

  async getDict(data: any): Promise<any> {
    try {
      console.log('- Consultando o dict creditor');

      const token = await this.generateTokenPix();

      const response = await lastValueFrom(
        this.httpService.get(`${this.BASE_URI}/key/consult`, {
          data: data,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
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

  async generateTokenPix(): Promise<any> {
    try {
      const request = {
        client_id: this.configService.get<string>('CLIENT_ID'),
        client_secret: this.configService.get<string>('CLIENT_SECRET'),
      };

      const response = await lastValueFrom(
        this.httpService.post(`${this.BASE_URI}/auth`, request),
      );

      return response.data.access_token;
    } catch (error) {
      return error?.response?.data;
    }
  }
}
