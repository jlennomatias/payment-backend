// src/external-api/external-api.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '../http/http.service';

@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}

  async createPix(data: any): Promise<any> {
    const url = 'http://localhost:3030/pix';
    return await this.httpService.post<any>(url, data);
  }

  async getPix(pixId: number): Promise<any> {
    const url = `http://localhost:3030/pix/${pixId}`;
    return await this.httpService.get<any>(url);
  }

  async deletePix(pixId: number): Promise<any> {
    const url = `http://localhost:3030/pix/${pixId}`;
    return await this.httpService.delete<any>(url);
  }

  async getAccountData(clientId: string): Promise<any> {
    const url = `https://api.external-service.com/accounts/${clientId}`;
    return await this.httpService.get<any>(url);
  }

  async getDictData(data: any): Promise<any> {
    const url = `http://localhost:3030/pix/v1/dict/v2/key`;
    return await this.httpService.post<any>(url, data);
  }
}
