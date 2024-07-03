// src/external-api/external-api.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalApiService {
  private readonly apiBaseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(
    private readonly httpService: HttpService,
    config: ConfigService,
  ) {
    this.apiBaseUrl = config.get('BASE_URL');
    this.clientId = config.get('CLIENT_ID');
    this.clientSecret = config.get('CLIENT_SECRET');
  }

  async createPix(data: any): Promise<any> {
    const token = await this.getToken();

    const url = `${this.apiBaseUrl}/instant_payment/`;
    return await this.httpService.post<any>(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getPix(pixId: string): Promise<any> {
    const url = `${this.apiBaseUrl}/pix/${pixId}`;
    return await this.httpService.get<any>(url);
  }

  async deletePix(pixId: string): Promise<any> {
    const url = `${this.apiBaseUrl}/pix/${pixId}`;
    return await this.httpService.delete<any>(url);
  }

  async getAccountData(clientId: string): Promise<any> {
    const url = `https://api.external-service.com/accounts/${clientId}`;
    return await this.httpService.get<any>(url);
  }

  async getDictData(data: any): Promise<any> {
    console.log('chegou aqui');
    const token = await this.getToken();

    const url = `${this.apiBaseUrl}/key/consult`;
    const response = await this.httpService.post<any>(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('response dict', response);

    return response;
  }

  async getToken(): Promise<any> {
    try {
      const request = {
        client_id: this.clientId,
        client_secret: this.clientSecret,
      };

      return await this.httpService.post(`${this.apiBaseUrl}/auth`, request);
    } catch (error) {
      return error?.response?.data;
    }
  }

  async postWebhookPayment(paymentId: string, data: any): Promise<any> {
    const url = `${this.apiBaseUrl}/payments/v4/pix/payments/${paymentId}`;
    return await this.httpService.post<any>(url, data);
  }

  async postWebhookRecurringPayment(
    recurringPaymentId: string,
    data: any,
  ): Promise<any> {
    const url = `${this.apiBaseUrl}/automatic-payments/{versionApi}/pix/recurring-payments/${recurringPaymentId}`;
    return await this.httpService.post<any>(url, data);
  }
}
