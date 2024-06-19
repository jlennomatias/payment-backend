// src/external-api/external-api.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '../http/http.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalApiService {
  private readonly apiBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    config: ConfigService,
  ) {
    this.apiBaseUrl = config.get('PIX_API_BASE_URL');
  }

  async createPix(data: any): Promise<any> {
    const url = `${this.apiBaseUrl}/pix`;
    return await this.httpService.post<any>(url, data);
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
    const url = `${this.apiBaseUrl}/pix/v1/dict/v2/key`;
    return await this.httpService.post<any>(url, data);
  }
}
